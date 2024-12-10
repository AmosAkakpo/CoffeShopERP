import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import './App.css';

import Login from './Pages/Login/Login';
import Account from './Pages/Account/Account';
import Menu from './Pages/Menu/Menu';
import Sales from './Pages/Sales/Sales';
import Footer from './Components/Footer';
import Review from './Pages/Review/Review';

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
              <Route path='/Menu' element={<Menu />}/>
              <Route path='/Sales' element={<Sales />}/>
              <Route path='/Review' element={<Review />}/>
            </Routes>
          </div>
          <Footer/>
        </div>
        
      
    </>
   
  );
}

export default App;
