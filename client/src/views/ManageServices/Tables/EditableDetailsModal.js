import React from 'react'
import { Modal, Row, Form, Input } from 'antd';
import styled from 'styled-components';
import { compose, withHandlers } from 'recompose';

const EditableDetailsModal = props => {
  const { modalVisible, service, toggleModal, chosenServiceIndex, form, onUpdate } = props;
  console.log('chosenServiceIndex', chosenServiceIndex);
  const { getFieldDecorator } = form;
  if (!service) return null;
  return (
    <Modal
      visible={modalVisible}
      title={`${service.serviceName}`}
      okText="Update"
      width={800}
      onCancel={() => toggleModal(false, chosenServiceIndex)}
      onOk={onUpdate}
    >
      <Row type="flex" align="middle" justify="space-between">
        <Form.Item label="Name of the Service:" required>
          {
            getFieldDecorator('serviceName',{
              rules: [{ required: true, message: 'Service Name is required' }],
              initialValue: service.serviceName
            })(
              <StyledInput placeholder="Enter service name" />
            )
          }
        </Form.Item>
        <Form.Item label="Maximum Number of Students:" required>
          {
            getFieldDecorator('max',{
              rules: [{ required: true, message: 'Max Number is required' }],
              initialValue: service.max
            })(
              <Input placeholder="Enter maximum number" />
            )
          }
        </Form.Item>
        <Form.Item label="Number of Credits:" required>
          {
            getFieldDecorator('creditAmount',{
              rules: [{ required: true, message: 'Number of Credits is required' }],
              initialValue: service.creditAmount
            })(
              <Input placeholder="Enter number of credits" />
            )
          }
        </Form.Item>
      </Row>
      <Row type="flex" align="middle">
        <Form.Item label="Description:" required style={{ width: '100%' }}>
          {
            getFieldDecorator('description',{
              rules: [{ required: true, message: 'Description is required' }],
              initialValue: service.description
            })(
              <Input.TextArea
                placeholder="Enter description here..."
                autosize
                style={{ width: '100%', minHeight: '200px' }}
              />
            )
          }
        </Form.Item>
      </Row>
    </Modal>
  )
}

export default compose(
  Form.create(),
  withHandlers({
    onUpdate: props => async () => {
      const { form, updateService, service } = props;
      await form.validateFields((formErr, values) => {
        if(!formErr) {
          form.resetFields();
          updateService({ ...service, ...values });
        }
      })
    }
  })
)(EditableDetailsModal)


const StyledInput = styled(Input)`
  min-width: 300px;
`;