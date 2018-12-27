import React from 'react'
import { Modal, Row, Form, Input } from 'antd';
import styled from 'styled-components';
import { compose, withHandlers } from 'recompose';

const CreateServiceModal = props => {
  const { modalVisible, toggleModal, form, onCreate } = props;
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={modalVisible}
      title="Create New Voluntary Service"
      okText="Create"
      width={800}
      onCancel={() => toggleModal(false)}
      onOk={onCreate}
    >
      <Row type="flex" align="middle" justify="space-between">
        <Form.Item label="Name of the Service:" required>
          {
            getFieldDecorator('serviceName',{
              rules: [{ required: true, message: 'Service Name is required' }],
              initialValue: ''
            })(
              <StyledInput placeholder="Enter service name" />
            )
          }
        </Form.Item>
        <Form.Item label="Maximum Number of Students:" required>
          {
            getFieldDecorator('max',{
              rules: [{ required: true, message: 'Max Number is required' }],
              initialValue: ''
            })(
              <Input placeholder="Enter maximum number" />
            )
          }
        </Form.Item>
        <Form.Item label="Number of Credits:" required>
          {
            getFieldDecorator('creditsAmount',{
              rules: [{ required: true, message: 'Number of Credits is required' }],
              initialValue: ''
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
              initialValue: ''
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
    onCreate: props => async () => {
      console.log('Clicked');
      const { form, createService } = props;
      await form.validateFields((formErr, values) => {
        if(!formErr) {
          createService({...values, usersCount: 0 });
        }
      })
    }
  })
)(CreateServiceModal)


const StyledInput = styled(Input)`
  min-width: 300px;
`;