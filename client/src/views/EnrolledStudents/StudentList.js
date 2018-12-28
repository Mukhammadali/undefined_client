import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Spin, Tag, Row, Button } from 'antd';


export default class StudentList extends Component {
  state = {
    loading: false,
    contract: null,
    volunteers: [],
    columns: [
      { title: 'Student ID', dataIndex: 'userId', key: 'userId' },
      { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName' },
      { title: 'Status', dataIndex: 'completed', key: 'completed', render: (text, { completed }) => {
        console.log('completed', completed);
        if(completed) return <Tag color="green">Completed</Tag>
        return <Tag color="blue">In Progress</Tag>
      } },
      {
        title: 'Complete', dataIndex: 'completed', key: 'completed', render: (text, record, index) => {
          console.log('record', record);
          if (record.completed) {
            return <span style={{ color: 'red', fontSize: 18 }}>Completed</span>
          }
          return (
            <Row  type="flex" align="middle">
              <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.completeVolunteering(record.volunteerId)}>Complete</Button>
            </Row>
          )
        },
      },
    ]
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
    this.setState({ volunteers:  filteredData})
  }

  fetchAllVolunteerings = async () => {
    const { web3: { contract }, user } = this.props;
    const allVolunteerings = [];
    const volunteeringsCount = await contract.methods.volunteeringsCount().call();
    for (let index = 0; index < volunteeringsCount; index++) {
      const volunteering = await contract.methods.getVolunteering(index).call()
      console.log('volunteering', volunteering);
      const payload = {
        userId: volunteering[0],
        serviceId: volunteering[1],
        completed: volunteering[2],
        volunteerId: volunteering[3]
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
  completeVolunteering = async volunteerId => {
    console.log('volunteerId', volunteerId);
    const { web3: { contract, accounts }, user } = this.props;
    try {
      await contract.methods.completeVolunteering(volunteerId).send({ from: accounts[0] });
      const data = JSON.parse(JSON.stringify(this.state.volunteers))
      await data.map(volunteer => {
        if(volunteer.volunteerId === volunteerId) {
          volunteer.completed = true;
        }
      })
      this.setState({ volunteers: data });
      this.filterAndStoreUserServices();
    } catch (Err) {
      console.log(Err)
    }
  }

  render() {
    return (
      <div>
        <Table
          columns={this.state.columns}
          dataSource={this.state.volunteers}
          pagination={false}
          loading={this.state.loading}
          rowKey="volunteerId"
        />
      </div>
    )
  }
}
