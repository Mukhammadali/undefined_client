import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Spin, message } from 'antd';
import DetailsModal from './DetailsModal';
import { all } from 'async';


export default class ServicesTableForStudent extends Component {
  state = {
    loading: false,
    modalVisible: false,
    chosenServiceIndex: null,
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
                <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.enrollVolunteering(record.id) } >Enroll</Button>
                <Button type="primary" ghost onClick={() => this.toggleModal(true, index)}>Details</Button>
              </Row>
            )
          }
          return <span style={{ color: 'red', fontSize: 18 }}>Full</span>
        },
      },
    ],
  }
  enrollVolunteering = async serviceId => {
    console.log('serviceId', serviceId);
    const { web3: { contract, accounts }, user } = this.props;
    try {
      await contract.methods.setVolunteering(user.userId, serviceId).send({ from: accounts[0] });
      message.success('Successfully Enrolled!')
      const tempData = this.state.services.filter(o => o.id !== serviceId);
      this.setState({ services: tempData });
      await this.filterAndStoreUserServices();
    }
    catch (err) {
      console.error(err);
      message.error('Something went wrong! Please try again!')
    }
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
  
  toggleModal = (bool, index) => this.setState({ modalVisible: bool, chosenServiceIndex: index });

  render() {
    const { modalVisible, columns, chosenServiceIndex, services, loading } = this.state;
    return (
      <div>
        <Table
          columns={columns}
          dataSource={services}
          pagination={false}
          loading={loading}
          rowKey="id"
        />
        <DetailsModal
          modalVisible={modalVisible}
          service={services[chosenServiceIndex]}
          chosenServiceIndex={chosenServiceIndex}
          toggleModal={this.toggleModal}
        />
      </div>
    )
  }
}
