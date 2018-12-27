import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Form, Icon, Row } from 'antd';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { graphql } from 'react-apollo';
import { StyledInput } from '../../../components/CommonStyledComponent';
import { Styles, UserSceneMessages, mediaQuery } from '../../../lib/constants';
import { warnMessage } from '../../../lib/utils';
import { loginMutation, CLIENT_LOG_IN } from '../../../graphql/auth/mutations';
import { withLoadingToggle } from '../../../components/HOCs';

const FormItem = Form.Item;

const LogIn = props => {
  const { SubmitForm, form, intl, isLoading } = props;
  const { getFieldDecorator } = form;
  const { formatMessage } = intl;
  return (
    <StyledLayout id="login">
      <Row style={{ marginBottom: '16px' }}>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <img src="/images/logo.png" height="40px" alt="logo" />
          </div>
        </Col>
        <Col span={16} />
      </Row>
      <StyledContainer>
        <StyledCard>
          <Form className="login-form">
            <h3 style={{ fontSize: '18px' }}>
              <FormattedMessage id={UserSceneMessages.loginFormTitle} />
            </h3>
            <br />
            <FormItem
              label={formatMessage({ id: 'user.loginFormLabelEmail' })}
              colon={false}
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'user.loginFormValidatorEmail',
                    }),
                  },
                  { type: 'email' },
                ],
              })(
                <StyledInput
                  placeholder={formatMessage({
                    id: 'user.loginFormPlaceHolderEmail',
                  })}
                />
              )}
            </FormItem>
            <FormItem
              label={formatMessage({ id: 'user.loginFormLabelPassword' })}
              colon={false}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({
                      id: 'user.loginFormValidatorPassword',
                    }),
                  },
                ],
              })(
                <StyledInput
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  onPressEnter={SubmitForm}
                  type="password"
                  placeholder={formatMessage({
                    id: 'user.loginFormPlaceHolderPassword',
                  })}
                />
              )}
            </FormItem>

            <FormItem>
              <div style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  style={Styles.STYLE_BUTTON_SUBMIT}
                  onClick={SubmitForm}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <FormattedMessage id="user.loginFormButtonLogin" />
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
    const { form, login, toggleIsLoading, clientLogIn } = props;
    form.validateFields(async (err, values) => {
      if (err) return;
      toggleIsLoading(true);
      try {
        const { data } = await login({ variables: values });
        await toggleIsLoading(false);
        await clientLogIn({
          variables: {
            token: data.login.jwt,
          },
        });
      } catch (error) {
        await toggleIsLoading(false);
        warnMessage(error, '로그인에 실패하였습니다.');
      }
    });
  },
};

const enhance = compose(
  Form.create(),
  withLoadingToggle,
  injectIntl,
  graphql(loginMutation, { name: 'login' }),
  graphql(CLIENT_LOG_IN, { name: 'clientLogIn' }),
  withHandlers(handlers)
);

LogIn.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  SubmitForm: PropTypes.func.isRequired,
};

export default enhance(LogIn);

const StyledCard = styled(Card)`
  width: 510px;
  ${mediaQuery.small`
    width: 100%;
    margin: 16px 24px 16px 16px !important;
    `};
`;

const StyledLayout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  ${mediaQuery.small`
    padding: 0px;
  `};
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;
