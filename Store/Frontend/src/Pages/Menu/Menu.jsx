import React from 'react'
import { useEffect, useState } from 'react'
import { NavLink} from 'react-router-dom';
import axios from 'axios'
import './Menu.css'
function Menu() {
  const [list,setList] = useState([]);

  useEffect(()=>{
    axios.get('http://localhost:3000/menu')
    .then(res=>setList(res.data))
    .catch(err=>console.log(err));
  },[])
  return (
    <>
      <div className="page-content">
        <h2 className="page-title">List of Store Items</h2>
        <table className="content-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>Category</th>
              <th>Item Name</th>
              <th>Price (AED)</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>{item.MENU_ITEM_ID}</td>
                <td>{item.CATEGORY_NAME}</td>
                <td>{item.MENU_ITEM_NAME}</td>
                <td>{item.UNIT_PRICE} AED</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </>
  )
}

export default Menu