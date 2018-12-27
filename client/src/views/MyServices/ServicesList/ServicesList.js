import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Spin, Tag } from 'antd';
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
  { title: 'No', dataIndex: 'usersCount', key: 'usersCount', render: (text, record, index) => {
    return (
      <span>{record.usersCount} / <b>{record.max}</b></span>
    )
  } },
  { title: 'Author', dataIndex: 'providerName', key: 'providerName', render: (text, record, index) => {
    return (
      <span>{record.providerName}</span>
    )
  } },
  { title: 'Status', dataIndex: 'completed', key: 'completed', render: (text, { completed }) => {
    console.log('completed', completed);
    if(completed) return <Tag color="green">Completed</Tag>
    return <Tag color="blue">In Progress</Tag>

  } },
];


export default class ServicesList extends Component {
  state = {
    loading: false,
    contract: null,
    services: []
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
      return userExists;
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
      const providerAuthor = await contract.methods.serviceProviders(response[6]).call()
      const payload = {
        id: response[0],
        max: response[1],
        usersCount: response[2],
        serviceName: response[3],
        completed: response[4],
        creditAmount: response[5],
        userId: response[6],
        providerName: providerAuthor.name
      }
      await allServices.push(payload);
    }
    return allServices;
  }

  render() {
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.services}
          pagination={false}
          loading={this.state.loading}
          rowKey="id"
        />
      </div>
    )
  }
}
