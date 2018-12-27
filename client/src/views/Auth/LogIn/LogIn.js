import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form, Icon, message, Input } from 'antd';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import { loginMutation, CLIENT_LOG_IN } from '../../../apollo/auth/mutations';
import { withLoadingToggle } from '../../../components/HOCs';

const FormItem = Form.Item;

const LogIn = props => {
  const { SubmitForm, form, loading } = props;
  const { getFieldDecorator } = form;
  return (
    <StyledLayout id="login">
      <StyledContainer>
        <StyledCard>
          <Form className="login-form">
            <h3 style={{ fontSize: '18px' }}>
              LOG IN
            </h3>
            <br />
            <FormItem
              label="User ID"
              colon={false}
            >
              {getFieldDecorator('userId', {
                rules: [
                  {
                    required: true,
                    message: 'UserID is invalid'
                  },
                ],
              })(
                <Input
                  placeholder="Enter your user ID"
                />
              )}
            </FormItem>
            <FormItem
              label="Password"
              colon={false}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: "Invalid password"
                  },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  onPressEnter={SubmitForm}
                  type="password"
                  placeholder="Enter your password"
                />
              )}
            </FormItem>

            <FormItem>
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  onClick={SubmitForm}
                  loading={loading}
                  disabled={loading}
                >
                  Log In
                </Button>
              </div>
            </FormItem>
          </Form>
        </StyledCard>
      </StyledContainer>
    </StyledLayout>
  );
};

const handlers = {
  SubmitForm: props => async () => {
    const { form, login, toggleLoading, clientLogIn } = props;
    form.validateFields(async (err, values) => {
      if (err) return;
      toggleLoading(true);
      try {
        const { data } = await login({ variables: values });
        console.log('data', data);
        await toggleLoading(false);
        await clientLogIn({
          variables: {
            token: data.login.jwt,
          },
        });
      } catch (error) {
        await toggleLoading(false);
        if (error.graphQLErrors) {
          error.graphQLErrors.map(error => {
            message.error(error.message);
          })
        }
      }
    });
  },
};

const enhance = compose(
  Form.create(),
  withLoadingToggle,
  graphql(loginMutation, { name: 'login' }),
  graphql(CLIENT_LOG_IN, { name: 'clientLogIn' }),
  withHandlers(handlers)
);

LogIn.propTypes = {
  loading: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  SubmitForm: PropTypes.func.isRequired,
};

export default enhance(LogIn);

const StyledCard = styled(Card)`
  width: 510px;
`;

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 30px;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
