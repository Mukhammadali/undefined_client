import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd';
import data from './mockData';
import getWeb3 from "../../../utils/getWeb3";
import Volunteer from '../../../contracts/Volunteer.json';


export default class ServicesList extends Component {
  async componentDidMount(){
    try {
          // Get network provider and web3 instance.
          const web3 = await getWeb3();
          console.log('web3', web3);
    
          // Use web3 to get the user's accounts.
          // await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          // console.log('accounts', accounts);
    
          // Get the contract instance.
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = Volunteer.networks[networkId];
          const instance = new web3.eth.Contract(
            Volunteer.abi,
            deployedNetwork && deployedNetwork.address,
          );

          // instance.methods.
    
          // Set web3, accounts, and contract to the state, and then proceed with an
          // example of interacting with the contract's methods.
          this.setState({ web3, accounts, contract: instance });
        } catch (error) {
          // Catch any errors for any of the above operations.
          alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
          );
          console.error(error);
        }
  }
    
  state = {
    columns: [
      { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName', width: '50%' },
      { title: 'Credit Amount', dataIndex: 'creditAmount', key: 'creditAmount' },
      // { title: 'No', dataIndex: 'usersCount', key: 'usersCount', render: (text, record, index) => {
      //   return (
      //     <span>{record.usersCount} / <b>{record.max}</b></span>
      //   )
      // } },
    ],
  }

  render() {
    const { columns } = this.state;
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </div>
    )
  }
}
