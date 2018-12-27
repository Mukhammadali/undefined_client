import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row, Spin, message } from 'antd';
import DetailsModal from './DetailsModal';


export default class ServicesTableForStudent extends Component {
  state = {
    loading: false,
    modalVisible: false,
    chosenServiceIndex: null,
    contract: null,
    data: [],
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
      await  message.success('Successfully Enrolled!')
    }
    catch (err) {
      console.error(err);
      message.error('Something went wrong! Please try again!')
    }
  }
  async componentDidMount (){
    this.setState({ loading: true });
    const { accounts, contract } = this.props.web3;
    console.log('nextProps', this.props);
    // console.log('contract', contract);
    
    // const result = await contract.methods.setService('very good service', 20, 10).send({ from: accounts[0] });
    // console.log('result', result);
    const servicesLength = await contract.methods.servicesCount().call();
    console.log('servicesLength', servicesLength);

    const newData = [];
    await this.setState({ loading: false })
    for (let index = 0; index < servicesLength; index++) {
      const response = await contract.methods.getService(index).call();
      console.log('response', response);
      const payload = {
        id: response[0],
        max: response[1],
        usersCount: response[2],
        serviceName: response[3],
        completed: response[4]
      }
      await newData.push(payload);
    }
    console.log('newData', newData);
    this.setState({ data: newData })
  }
  
  toggleModal = (bool, index) => this.setState({ modalVisible: bool, chosenServiceIndex: index });

  render() {
    const { modalVisible, columns, chosenServiceIndex, data, loading } = this.state;
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          loading={loading}
          rowKey="id"
        />
        <DetailsModal
          modalVisible={modalVisible}
          service={data[chosenServiceIndex]}
          chosenServiceIndex={chosenServiceIndex}
          toggleModal={this.toggleModal}
        />
      </div>
    )
  }
}
