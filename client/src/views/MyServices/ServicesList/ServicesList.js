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
  { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName', width: '50%' },
  { title: 'Credit Amount', dataIndex: 'creditAmount', key: 'creditAmount' },
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
    data: [
      {
        key: 2,
        serviceName: '',
        usersCount: 42,
        max: 50,
        creditAmount: 4,
      },
      {
        key: 3,
        serviceName: '',
        usersCount: 32,
        max: 32,
        creditAmount: 3,
      },
      {
        key: 4,
        serviceName: 'Administrative Office Work in Student Union Building',
        usersCount: 23,
        max: 32,
        creditAmount: 3,
      },
    ]
  }

  async componentDidMount (){
        // console.log('Contract is null')
        // if (this.props.web3.contract){
          const { accounts, contract } = this.props.web3;
          console.log('nextProps', this.props);
          // console.log('contract', contract);
          
          // const result = await contract.methods.setService('very good service', 20, 10).send({ from: accounts[0] });
          // console.log('result', result);
          const servicesLength = await contract.methods.servicesCount().call();
          console.log('servicesLength', servicesLength);

          const newData = [...this.state.data];
          for (let index = 0; index < servicesLength; index++) {
            const element = await contract.methods.getService(index).call();
            newData[index].serviceName = element[3];
          }
          console.log('newData', newData);
          this.setState({ data: newData })
          // return {
          //   // ...prevState,
          //   data: newData,
          //   loading: false,
          //   contract: nextProps.web3.contract
          
  }

  render() {
    if(this.state.loading) return <Spin />
    console.log('rerendered');
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
        />
      </div>
    )
  }
}
