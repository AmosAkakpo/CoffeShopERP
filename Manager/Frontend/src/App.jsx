import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import './App.css';

import Login from './Pages/Login/Login';
import Account from './Pages/Account/Account';
import Sales from './Pages/Sales/Sales';
import Employees from './Pages/Employees/Employees';
import Footer from './Components/Footer'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Login' element={<Login/>}/>
      </Routes>

        <div>
          <Navbar />
          <div className='application'>
            <Sidebar/>
            <Routes>
              <Route path='/Account' element={<Account />}/>
              <Route path='/Employees' element={<Employees />}/>
              <Route path='/Sales' element={<Sales />}/>
            </Routes>
          </div>
          <Footer/>
        </div>
        
      
    </>
   
  );
}

export default App;
