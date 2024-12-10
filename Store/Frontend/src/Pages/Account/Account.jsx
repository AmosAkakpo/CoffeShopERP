import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Account.css'
function Account() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/account')
      .then(res => setUser(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="account-page">
      {user.length > 0 ? (
        <div className="card">
          <i className="bx bxs-user profile-icon"></i>
          <h2>{user[0].POSITION_NAME} {user[0].EMPLOYEE_FNAME} {user[0].EMPLOYEE_LNAME}</h2>
          <p className="employee-title">Employee ID: E003</p>
          <p>Contact: {user[0].EMPLOYEE_TELEPHONE}</p>
          <p>Shift: MTWRF {user[0].STARTING_TIME} - {user[0].ENDING_TIME}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Account;
