import React from 'react'
import ServicesTableForStudent from './Tables/ServicesTableForStudent';
import ServicesTableForProvider from './Tables/ServiceTableForProvider';
import AppContext from '../../AppContext';
import { Spin } from 'antd';

const ManageServices = ({ user, title }) => {
  return (
    <AppContext.Consumer>
      {
        web3 => {
          console.log('web3', web3);
          if(!web3.contract) return <Spin />
          return (
            <div>
              <h1>{title}</h1>
              {user.role === 'student' && <ServicesTableForStudent web3={web3} /> }
              {user.role === 'provider' && <ServicesTableForProvider web3={web3} /> }
            </div>
          )
        }
      }
    
    </AppContext.Consumer>
  )
}

export default ManageServices
