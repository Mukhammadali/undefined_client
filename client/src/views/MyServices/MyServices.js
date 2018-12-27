import React from 'react'
import ServicesList from './ServicesList';

const MyServices = ({ user, title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <ServicesList user={user} />
    </div>
  )
}

export default MyServices
