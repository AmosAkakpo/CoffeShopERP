import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const navigate = useNavigate();
  
  const handleDelete =()=>
  {
    axios.get('http://localhost:4000/Logout')
    .then(res=>{
      navigate('/Login');
    }).catch(err=>console.log(err));
  }
  return (
    <>
      <div className='navbar'>
        <div>
          <span className='logo'>Coffee Shop</span>
        </div>
        <div className='navbar-section'>
          <span>E001</span>
          <i className="bx bxs-user"></i>
          <button onClick={handleDelete}>Logout</button>
        </div>
      </div>
    </>
  );
}

export default Navbar;

