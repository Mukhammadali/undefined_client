import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, message, Icon } from 'antd';
import CreateServiceModal from './CreateServiceModal';


export default class ServicesTableForProvider extends Component {
  state = {
    loading: false,
    modalVisible: false,
    contract: null,
    services: [],
    columns: [
      { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName', width: '50%' },
      { title: 'Credit Amount', dataIndex: 'creditAmount', key: 'creditAmount' },
      { title: 'No', dataIndex: 'usersCount', key: 'usersCount', render: (text, record, index) => {
        return (
          <span>{record.usersCount} / <b>{record.max}</b></span>
        )
      } },
      {
        title: 'Enroll', dataIndex: '', key: 'x', render: (text, record, index) => {
          if (record.usersCount !== record.max){
            return (
              <Row  type="flex" align="middle">
                <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.toggleModal(true, index)}>Edit</Button>
                <Button type="info" style={{ marginRight: 10 }}>Complete</Button>
              </Row>
            )
          }
          return <span style={{ color: 'red', fontSize: 18 }}>Full</span>
        },
      },
    ],
  }
  createService = async values => {
    // const { web3: { contract, accounts }, user } = this.props;
    // try {
    //   await contract.methods.setVolunteering(user.userId, serviceId).send({ from: accounts[0] });
    //   await  message.success('Successfully Updated!')
    //   await this.toggleModal(false, this.state.chosenServiceIndex);
    // }
    // catch (err) {
    //   console.error(err);
    //   message.error('Something went wrong! Please try again!')
    // }
  }
  async componentDidMount (){
    this.setState({ loading: true }); 
    await this.filterAndStoreUserServices();
    
  }

  filterAndStoreUserServices = async () => {
    const allServices = await this.fetchAllServices();
    const allVolunteerings = await this.fetchAllVolunteerings();

    const filteredData = allServices.filter(service => {
      const userExists = allVolunteerings.find(o => o.serviceId === service.id);
      return !userExists;
    })
    this.setState({ services:  filteredData})
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
      if (volunteering[0] === user.userId) {
        allVolunteerings.push(payload);
      }
      
    }
    return allVolunteerings;
  }

  fetchAllServices = async () => {
    const { web3: { contract } } = this.props;
    const servicesLength = await contract.methods.servicesCount().call()

    const allServices = [];
    await this.setState({ loading: false })
    for (let index = 0; index < servicesLength; index++) {
      const response = await contract.methods.getService(index).call();
      console.log('response', response);
      const payload = {
        id: response[0],
        max: response[1],
        usersCount: response[2],
        serviceName: response[3],
        completed: response[4],
        creditAmount: response[5]
      }
      await allServices.push(payload);
    }
    return allServices;
  }
  
  toggleModal = (bool) => this.setState({ modalVisible: bool });

  render() {
    const { modalVisible, columns, chosenServiceIndex, services, loading } = this.state;
    return (
      <div>
        <Button
          type="primary"
          style={{ marginBottom: 10 }}
          onClick={() => this.toggleModal(true)}
        >
          <Icon type="plus" /> Create Service
        </Button>
        <Table
          columns={columns}
          dataSource={services}
          pagination={false}
          loading={loading}
          rowKey="id"
        />
        <CreateServiceModal
          modalVisible={modalVisible}
          toggleModal={this.toggleModal}
          createService={this.createService}
        />
      </div>
    )
  }
}
