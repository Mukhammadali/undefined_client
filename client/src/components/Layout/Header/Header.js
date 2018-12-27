import React from 'react';
import { Layout as AntdLayout, Avatar, Row } from 'antd';


const AntdHeader = AntdLayout.Header;

function Header({ user }) {
  return (
    <AntdHeader style={{ background: '#fff', padding: 0 }}>
      <Row type="flex" align="middle" justify="end" style={{ height: '100%' }}>
        <Avatar
          icon="search"
          size="large"
          style={{
            marginRight: 10,
            background: 'transparent',
            color: '#2e2e22',
            cursor: 'pointer'
          }}
        />
        <Avatar
          style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginRight: 10 }}
          size="large"
        >
          {user.userName[0].toUpperCase()}
        </Avatar>
        <span style={{ marginRight: 30  }}>{user.userName}</span>
      </Row>
    </AntdHeader>
  );
}

export default Header;