import React from 'react';
import PropTypes from 'prop-types';
import { Layout as AntdLayout } from 'antd';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = AntdLayout;

export const Layout = ({ children, user }) => (
  <AntdLayout style={{ minHeight: '100vh' }}>
    <Sidebar user={user} />
    <AntdLayout style={{ flex: 1, display: 'flex' }}>
      <Header user={user} />
      <Content
        style={{
          padding: 30,
          margin: 20,
          overflowY: 'auto',
          background: '#fff',
          height: '100%',
        }}
      >
        {children}
      </Content>
    </AntdLayout>
  </AntdLayout>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
