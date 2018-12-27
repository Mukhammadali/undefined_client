import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Row } from 'antd';
import DetailsModal from './DetailsModal';
import data from './mockServices';


export default class ServicesTableForProvider extends Component {
  static propTypes = {
    prop: PropTypes,
  }
    
  state = {
    modalVisible: false,
    chosenServiceIndex: 0,
    columns: [
      { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName', width: '60%', },
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
                <Button type="primary" style={{ marginRight: 10 }}>Edit</Button>
                <Button type="danger" style={{ marginRight: 10 }}>Delete</Button>
                <Button type="primary" ghost onClick={() => this.toggleModal(true, index)}>Edit Details</Button>
              </Row>
            )
          }
          return <span style={{ color: 'red', fontSize: 18 }}>Full</span>
        },
      },
    ],
  }

  toggleModal = (bool, index) => this.setState({ modalVisible: bool, chosenServiceIndex: index });

  render() {
    const { modalVisible, columns, chosenServiceIndex } = this.state;
    return (
      <div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        <DetailsModal
          modalVisible={modalVisible}
          service={data[chosenServiceIndex]}
          toggleModal={this.toggleModal}
        />
      </div>
    )
  }
}
