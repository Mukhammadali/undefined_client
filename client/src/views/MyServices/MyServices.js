import React from 'react'
import ServicesList from './ServicesList';
import AppContext from '../../AppContext';

const MyServices = ({ user, title }) => {
  return (
    <AppContext.Consumer>
      {
         web3 => {
           console.log('web3', web3);
           if (!web3.contract) {
             return <div>Loading ...</div>
           }
           return (
             <div>
              <h1>{title}</h1>
              <ServicesList user={user} web3={web3}/>
             </div>
           )
         }

      }
    </AppContext.Consumer>
  )
}

export default MyServices
