import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Spin, Tag, Row, Button } from 'antd';
const columns = [
  { title: 'Student ID', dataIndex: 'userId', key: 'userId' },
  { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName' },
  { title: 'Status', dataIndex: 'completed', key: 'completed', render: (text, { completed }) => {
    console.log('completed', completed);
    if(completed) return <Tag color="green">Completed</Tag>
    return <Tag color="blue">In Progress</Tag>
  } },
  {
    title: 'Complete', dataIndex: '', key: 'x', render: (text, record, index) => {
      if (record.completed) {
        return <span style={{ color: 'red', fontSize: 18 }}>Completed</span>
      }
      if (record.usersCount !== record.max){
        return (
          <Row  type="flex" align="middle">
            <Button type="info" style={{ marginRight: 10 }} onClick={() => this.completeService(record.id)}>Complete</Button>
          </Row>
        )
      }
      return <span style={{ color: 'red', fontSize: 18 }}>Full</span>
    },
  },
];


export default class StudentList extends Component {
  state = {
    loading: false,
    contract: null,
    volunteers: []
  }

  async componentDidMount (){
    this.setState({ loading: true }); 
    await this.filterAndStoreUserServices();
    
  }

  filterAndStoreUserServices = async () => {
    const allServices = await this.fetchAllServices();
    const allVolunteerings = await this.fetchAllVolunteerings();

    const filteredData = [];
    for (let index = 0; index < allVolunteerings.length; index++) {
      const volunteer = allVolunteerings[index];
      for (let j = 0; j < allServices.length; j++) {
        const service = allServices[j];
        if( volunteer.serviceId === service.id) {
          const payload = {
            ...volunteer,
            serviceName: service.serviceName
          }
          filteredData.push(payload);
        }
        
      }
    }
    //  allVolunteerings.filter(volunteering => {
    //   allServices.map(o => {
    //     if(o.id === volunteering.serviceId){
    //       console.log('o', o);
    //       volunteering.serviceName = o.serviceName;
    //       return true;
    //     }
    //     return false;
    //   });
    // })
    console.log('filteredData', filteredData);
    this.setState({ volunteers:  filteredData})
  }

  fetchAllVolunteerings = async () => {
    const { web3: { contract }, user } = this.props;
    const allVolunteerings = [];
    const volunteeringsCount = await contract.methods.volunteeringsCount().call();
    for (let index = 0; index < volunteeringsCount; index++) {
      const volunteering = await contract.methods.getVolunteering(index).call()
      const payload = {
        userId: volunteering[0],
        serviceId: volunteering[1],
        completed: volunteering[2]
      }
        allVolunteerings.push(payload);
    }
    return allVolunteerings;
  }

  fetchAllServices = async () => {
    const { web3: { contract }, user } = this.props;
    const servicesLength = await contract.methods.servicesCount().call()

    const allServices = [];
    await this.setState({ loading: false })
    for (let index = 0; index < servicesLength; index++) {
      const response = await contract.methods.getService(index).call();
      const description = await contract.methods.getServiceDescription(index).call();
      const providerAuthor = await contract.methods.serviceProviders(response[6]).call()
      const payload = {
        id: response[0],
        max: response[1],
        usersCount: response[2],
        serviceName: response[3],
        completed: response[4],
        creditAmount: response[5],
        userId: response[6],
        providerName: providerAuthor.name,
        description: description
      }
      if (response[6] === user.userId){
        await allServices.push(payload);
      }
    }
    return allServices;
  }

  render() {
    console.log(this.state.volunteers);
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.volunteers}
          pagination={false}
          loading={this.state.loading}
          rowKey="id"
        />
      </div>
    )
  }
}
