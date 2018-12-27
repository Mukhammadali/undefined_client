import React from 'react'
import { Modal, Row } from 'antd';

const DetailsModal = props => {
  const { modalVisible, service, toggleModal, chosenServiceIndex } = props;
  if (!service) return null;
  return (
    <Modal
      visible={modalVisible}
      title={`${service.serviceName}`}
      width={800}
      onCancel={() => toggleModal(false, chosenServiceIndex)}
      footer={null}
    >
      <Row type="flex" align="middle" justify="space-between">
        <span><h3>Enrolled Students Number:</h3><span>{service.usersCount}</span></span>
        <span><h3>Available Positions Number:</h3><span>{service.max - service.usersCount}</span></span>
      </Row>
      <br/> 
      <h3>Description:</h3>
      <div>{service.description}</div>
    </Modal>
  )
}

export default DetailsModal
