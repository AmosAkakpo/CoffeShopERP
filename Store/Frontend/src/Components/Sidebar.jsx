import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("");

  const menuItems = [
    { name: "Account", path: "/Account" },
    { name: "Menu", path: "/Menu" },
    { name: "Sales", path: "/Sales" },
    { name: "Review", path: "/Review" }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find(item => item.path === currentPath);
    if (activeItem) {
      setActiveMenu(activeItem.name);
    }
  }, [location, menuItems]);

  return (
    <div className='menu'>
      {menuItems.map(item => (
        <NavLink key={item.name} to={item.path} onClick={() => setActiveMenu(item.name)} className={`menu-item ${activeMenu === item.name ? 'active' : ''}`}>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}

export default Sidebar;
