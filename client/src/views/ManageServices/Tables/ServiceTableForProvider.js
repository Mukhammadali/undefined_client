import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, message, Icon } from 'antd';
import EditableDetailsModal from './EditableDetailsModal';


export default class ServicesTableForProvider extends Component {
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
                <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.toggleModal(true, index)}>Edit</Button>
                <Button type="danger" style={{ marginRight: 10 }}>Delete</Button>
              </Row>
            )
          }
          return <span style={{ color: 'red', fontSize: 18 }}>Full</span>
        },
      },
    ],
  }
  updateService = async serviceId => {
    console.log('serviceId', serviceId);
    const { web3: { contract, accounts }, user } = this.props;
    try {
      await contract.methods.setVolunteering(user.userId, serviceId).send({ from: accounts[0] });
      await  message.success('Successfully Updated!')
      await this.toggleModal(false, this.state.chosenServiceIndex);
    }
    catch (err) {
      console.error(err);
      message.error('Something went wrong! Please try again!')
    }
  }
  async componentDidMount (){
    this.setState({ loading: true });
    const { accounts, contract } = this.props.web3;
    const servicesLength = await contract.methods.servicesCount().call();
    const volunteeringsLength = await contract.methods.volunteeringsCount().call();
    await this.setState({ loading: false })
    // console.log('volunteeringsLength', volunteeringsLength);
    // console.log('servicesLength', servicesLength);
    const newVolunteerings = [];
    for (let index = 0; index < volunteeringsLength; index++) {
      const response = await contract.methods.getVolunteering(index).call();
      const payload = {
        userId: response[0],
        serviceId: response[1],
        completed: response[2]
      }
      await newVolunteerings.push(payload);
    }
    const newServices = [];
    for (let index = 0; index < servicesLength; index++) {
      const response = await contract.methods.getService(index).call();
      const payload = {
        id: response[0],
        max: response[1],
        usersCount: response[2],
        serviceName: response[3],
        completed: response[4]
      }
      await newServices.push(payload);
    }
    this.setState({ services: newServices })
  }
  
  toggleModal = (bool, index) => this.setState({ modalVisible: bool, chosenServiceIndex: index });

  render() {
    const { modalVisible, columns, chosenServiceIndex, services, loading } = this.state;
    return (
      <div>
        <Button  type="primary" ghost><Icon type="plus" /> Create Service</Button>
        <Table
          columns={columns}
          dataSource={services}
          pagination={false}
          loading={loading}
          rowKey="id"
        />
        <EditableDetailsModal
          modalVisible={modalVisible}
          service={services[chosenServiceIndex]}
          chosenServiceIndex={chosenServiceIndex}
          toggleModal={this.toggleModal}
          updateService={this.updateService}
        />
      </div>
    )
  }
}
