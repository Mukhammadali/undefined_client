import React from 'react';
import styled from 'styled-components';
import { Icon, Layout, Menu } from 'antd';
import { withRouter, NavLink } from 'react-router-dom';
import { compose, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { CLIENT_LOG_OUT } from '../../../apollo/auth/mutations';

const allSidebarLinks = [
  {
    key: 'manage-services',
    iconName: 'user',
    title:'Manage Services',
    to: '/main/manage-services',
  },
  {
    key: 'enroll-voluntary-service',
    iconName: 'team',
    title:'Enroll Voluntary Service',
    to: '/main/enroll-voluntary-service',
  },
  {
    key: 'my-voluntary-services',
    iconName: 'user',
    title:'My Voluntary Services',
    to: '/main/my-voluntary-services',
  },
  {
    key: 'option-1',
    iconName: 'user',
    title:'Option 1',
    to: '/main/option-1',
  },
  {
    key: 'option-2',
    iconName: 'user',
    title:'Option 2',
    to: '/main/option-2',
  },
  
];

const studentHasAccess = ['enroll-voluntary-service', 'my-voluntary-services'];
const providerAccess = ['manage-services', 'option-1', 'option-2'];

const studentAllowedLinks = allSidebarLinks.filter(link =>
  studentHasAccess.includes(link.key)
);
const providerAllowedLinks = allSidebarLinks.filter(link =>
  providerAccess.includes(link.key)
);

const Sidebar = props => {
  const {
    location: { pathname },
    user,
    onLogout
  } = props;


  const { role } = user;
  console.log('user', user);

  let currentSidebarLinks = studentAllowedLinks;
  if (role === 'provider')
    currentSidebarLinks = providerAllowedLinks;

  return (
    <Layout.Sider
      breakpoint="lg"
      width={260}
    >
      <UserName>
        {user.userName}
      </UserName>
      <Menu theme="dark" mode="inline" selectedKeys={[pathname.split('/')[2]]}>
        {currentSidebarLinks.map(link => (
          <StyledMenuItem key={link.key}>
            <NavLink exact to={link.to}>
              <Icon type={link.iconName} />
              {link.title}
            </NavLink>
          </StyledMenuItem>
        ))}
        <StyledMenuItem key="logout" onClick={onLogout}>
          <div>
            <Icon type="logout" />
            Log Out
          </div>
        </StyledMenuItem>
      </Menu>
    </Layout.Sider>
  );
};

export default  compose(
  withRouter,
  graphql(CLIENT_LOG_OUT, { name: 'clientLogOut' }),
  withHandlers({
    onLogout: props => async () => {
      await props.clientLogOut();
    },
  })
)(Sidebar);

const StyledMenuItem = styled(Menu.Item)`
  height: 50px !important;
  line-height: 50px !important;
  font-size: 17px !important;
  display: flex;
  white-space: nowrap;
  flex: 1;
`;
const UserName = styled.div`
  color: #fff;
  font-size: 30px;
  height: 64px;
  line-height: 64px;
  text-align: center;
`;