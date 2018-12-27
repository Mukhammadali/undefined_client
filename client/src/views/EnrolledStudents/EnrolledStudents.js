import React from 'react'
import AppContext from '../../AppContext';
import StudentList from './StudentList';

const EnrolledStudents = ({ user, title }) => {
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
              <StudentList user={user} web3={web3}/>
             </div>
           )
         }

      }
    </AppContext.Consumer>
  )
}

export default EnrolledStudents
