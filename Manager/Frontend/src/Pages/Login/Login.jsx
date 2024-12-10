import React, { useState, useRef } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Login() {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordRef = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    if (passwordRef.current) {
      passwordRef.current.type = passwordVisible ? "password" : "text";
    }
  };

  const [values, setValues] = useState({
    employee_id: '',
    password: ''
  });

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handlechanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:4000/Login', values)
    .then((res) => {
        if (res.data.Status === 'Success' ) {
          if(res.data.position ==='Manager')
          {
            navigate('/Employees');
          }
          else{
            alert("Error occurred");
          }
        } else {
            alert(res.data.Error || "Error occurred");
        }
    })
    .catch((err) => {
        console.error("Request failed:", err);
        alert("An unexpected error occurred.");
    });

  };
  
  return (
    <div className='content'>
      <div className="wrapper">
        <form action="" onSubmit={handleSubmit}>
          <div className="text-center text-4xl bold">
            <span>Login</span>
          </div>

          <div className="input-box">
            <input type="text" placeholder="Employee ID"  required name="employee_id" onChange={handlechanges}/>
            <i className="bx bxs-user"></i>
          </div>

          <div className="input-box">
            <input type="password" placeholder="Password" required name="password" onChange={handlechanges} ref={passwordRef}/>
            <i className="bx bxs-lock-alt" onClick={togglePasswordVisibility}></i>
          </div>

          <button type="submit" className="btn">Login</button>

          <div className="contact">
            <span>Contact manager in case of any issue</span>
          </div>
        </form>
      </div>
    </div>
    
  );
}

export default Login;
