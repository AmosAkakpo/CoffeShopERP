import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Employees.css';

function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {

    axios.get('http://localhost:4000/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="employee-page">
      {employees.length > 0 ? (
        employees.map(employee => (
          <div className="employee-card" key={employee.EMPLOYEE_ID}>
            <i className="bx bxs-user profile-icon"></i>
            <h2>{employee.POSITION_NAME} {employee.EMPLOYEE_FNAME} {employee.EMPLOYEE_LNAME}</h2>
            <p className="employee-title">Employee ID: {employee.EMPLOYEE_ID}</p>
            <p>Contact: {employee.EMPLOYEE_TELEPHONE}</p>
            <p>Salary: {employee.EMPLOYEE_SALARY}</p>
            <p>IBAN: {employee.EMPLOYEE_IBAN}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Employees;
