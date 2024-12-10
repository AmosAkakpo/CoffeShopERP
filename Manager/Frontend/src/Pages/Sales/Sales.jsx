// import React from 'react'
// import { useEffect, useState } from 'react'
// import { NavLink} from 'react-router-dom';
// import axios from 'axios'
// import './Sales.css'
// function Sales() {
//     const [list,setList] = useState([]);
  
//     useEffect(()=>{
//       axios.get('http://localhost:4000/sales')
//       .then(res=>setList(res.data))
//       .catch(err=>console.log(err));
//     },[])

//   return (
//     <div className="page-content">
//         <h2 className="page-title">Sales list</h2>
//         <table className="content-table">
//           <thead>
//             <tr>
//               <th>Employee id</th>
//               <th>Employee Name</th>
//               <th>Time</th>
//               <th>Total Amount</th>
//               <th>Payment Method</th>
//             </tr>
//           </thead>
//           <tbody>
//             {list.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.EMPLOYEE_ID}</td>
//                 <td>{item.EMPLOYEE_NAME}</td>
//                 <td>{item.SALE_TIMESTAMP}</td>
//                 <td>{item.TOTAL_AMOUNT} AED</td>
//                 <td>{item.PAYMENT_METHOD}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//   )
// }

// export default Sales

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Sales.css';

function Sales() {
    const [list, setList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortOrder, setSortOrder] = useState({ field: 'timestamp', order: 'asc' }); // New state for sorting
    const [rowLimit, setRowLimit] = useState(10);

    useEffect(() => {
        axios.get('http://localhost:4000/sales')
            .then(res => {
                setList(res.data);
                setFilteredData(res.data);
            })
            .catch(err => console.log(err));
    }, []);


    const applyFilters = () => {
        let sortedData = [...list];
        

        if (sortOrder.field === 'timestamp') {
            sortedData.sort((a, b) => {
                const dateA = new Date(a.SALE_TIMESTAMP);
                const dateB = new Date(b.SALE_TIMESTAMP);
                return sortOrder.order === 'asc' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortOrder.field === 'amount') {
            sortedData.sort((a, b) => {
                const amountA = parseFloat(a.TOTAL_AMOUNT);
                const amountB = parseFloat(b.TOTAL_AMOUNT);
                return sortOrder.order === 'asc' ? amountA - amountB : amountB - amountA;
            });
        }

        if (rowLimit !== Infinity) {
            sortedData = sortedData.slice(0, rowLimit);
        }
        setFilteredData(sortedData);
    };


    const toggleSortOrder = (field) => {
        setSortOrder(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleRowLimitChange = (event) => {
        const value = event.target.value === 'all' ? Infinity : Number(event.target.value);
        setRowLimit(value);
    };

    
    useEffect(() => {
        applyFilters();
    }, [sortOrder, rowLimit, list]);

    return (
        <div className="page-content">
            <h2 className="page-title">Sales List</h2>
            <div className="filters">
                <button
                    onClick={() => toggleSortOrder('timestamp')}
                    className="filter-button"
                >
                    Sort by Timestamp ({sortOrder.field === 'timestamp' ? sortOrder.order : 'asc'})
                </button>
                <button
                    onClick={() => toggleSortOrder('amount')}
                    className="filter-button"
                >
                    Sort by Total Amount ({sortOrder.field === 'amount' ? sortOrder.order : 'asc'})
                </button>
                <select onChange={handleRowLimitChange} value={rowLimit === Infinity ? 'all' : rowLimit} className="filter-select">
                    <option value={10}>Last 10</option>
                    <option value={20}>Last 20</option>
                    <option value={50}>Last 50</option>
                    <option value={100}>Last 100</option>
                    <option value="all">All</option>
                </select>
            </div>
            <table className="content-table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Time</th>
                        <th>Total Amount</th>
                        <th>Payment Method</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.EMPLOYEE_ID}</td>
                            <td>{item.EMPLOYEE_NAME}</td>
                            <td>{item.SALE_TIMESTAMP}</td>
                            <td>{item.TOTAL_AMOUNT} AED</td>
                            <td>{item.PAYMENT_METHOD}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Sales;


