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
    const { web3: { contract, accounts }, user } = this.props;
    try {
      await contract.methods.addServiceToServiceProvider(
        user.userId,
        values.serviceName,
        values.max,
        values.usersCount,
        values.creditsAmount
      ).send({ from: accounts[0] });
      await  message.success('Successfully Created!')
      await this.toggleModal(false);
      const tempData = [this.state.services, values];
      this.setState({ services: tempData });
      this.filterAndStoreUserServices();
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
    
    this.setState({ services:  allServices})
  }

  fetchAllServices = async () => {
    const { web3: { contract }, user } = this.props;
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
        creditAmount: response[5],
        userId: response[6]
      }
      if (user.userId === response[6]) {
        await allServices.push(payload);
      }
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
