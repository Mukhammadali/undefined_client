import React from 'react'
import ServicesTableForStudent from './Tables/ServicesTableForStudent';
import ServicesTableForProvider from './Tables/ServiceTableForProvider';

const ManageServices = ({ user, title }) => {
  return (
    <div>
      <h1>{title}</h1>
      {user.role === 'student' && <ServicesTableForStudent /> }
      {user.role === 'provider' && <ServicesTableForProvider /> }
    </div>
  )
}

export default ManageServices
