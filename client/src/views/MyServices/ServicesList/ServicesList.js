import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Spin } from 'antd';
// import data from './mockData';
// import getWeb3 from "../../../utils/getWeb3";
import Volunteer from '../../../contracts/Volunteer.json';
import getWeb3 from '../../../utils/getWeb3';
// import Volunteer from "./contracts/Volunteer.json";
// import getWeb3 from "./utils/getWeb3";

console.log('Volunteer', Volunteer);
console.log('getWeb3', getWeb3);

const columns = [
  { title: 'Service Name', dataIndex: 'serviceName', width: '50%' },
  { title: 'Credit Amount', dataIndex: 'creditAmount' },
  // { title: 'No', dataIndex: 'usersCount', key: 'usersCount', render: (text, record, index) => {
  //   return (
  //     <span>{record.usersCount} / <b>{record.max}</b></span>
  //   )
  // } },
];


export default class ServicesList extends Component {
  state = {
    loading: false,
    contract: null,
    data: []
  }

  async componentDidMount (){
    await this.setState({ loading: true });
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
      // newData[index].serviceName = element[3];
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

  render() {
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          loading={this.state.loading}
          rowKey="id"
        />
      </div>
    )
  }
}
