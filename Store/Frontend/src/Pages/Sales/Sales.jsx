import React, { useState } from "react";
import axios from "axios"; // Import axios
import "./Sales.css";

function Sales() {
  const [list, setList] = useState([]);
  const [values, setValues] = useState({
    quantity: "",
    menu_item: "",
    payment_method: "Card",
  });

  const menuItems = [
    { menu_item_id: "M001", menu_item_name: "Espresso", unit_price: 10 },
    { menu_item_id: "M002", menu_item_name: "Americano", unit_price: 12 },
    { menu_item_id: "M003", menu_item_name: "Cappuccino", unit_price: 15 },
    { menu_item_id: "M004", menu_item_name: "Green Tea", unit_price: 8 },
    { menu_item_id: "M005", menu_item_name: "Black Tea", unit_price: 8 },
    { menu_item_id: "M006", menu_item_name: "Mint Tea", unit_price: 10 },
    { menu_item_id: "M007", menu_item_name: "Croissant", unit_price: 7 },
    { menu_item_id: "M008", menu_item_name: "Cinnamon Roll", unit_price: 12 },
    { menu_item_id: "M009", menu_item_name: "Cheesecake Slice", unit_price: 15 },
    { menu_item_id: "M0010", menu_item_name: "Chicken Sandwich", unit_price: 18 },
    { menu_item_id: "M0011", menu_item_name: "Turkey Sandwich", unit_price: 25 },
    { menu_item_id: "M0012", menu_item_name: "Club Sandwich", unit_price: 28 },
  ];

  const addItem = () => {
    const selectedItem = menuItems.find(
      (item) => item.menu_item_name === values.menu_item
    );

    if (values.quantity && selectedItem) {
      const newItem = {
        menu_item: selectedItem.menu_item_name,
        quantity: parseInt(values.quantity, 10),
        unit_price: selectedItem.unit_price,
        total_price: selectedItem.unit_price * parseInt(values.quantity, 10),
      };
      setList([...list, newItem]);
      setValues({ ...values, quantity: "", menu_item: "" });
    } else {
      alert("Please select an item and enter quantity.");
    }
  };

  const deleteItem = (index) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
  };

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handlePay = async () => {
    if (list.length === 0) {
      alert("No items to pay for.");
      return;
    }

    const salesData = {
      branch_id: "B001",
      employee_id: "E0003",
      sales_items: list.map((item) => ({
        menu_item: item.menu_item,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      })),
      payment_method: values.payment_method,
    };

    try {
      
      const response = await axios.post("http://localhost:3000/sales", salesData);
      if (response.data.Status === "Success") {
        console.log(salesData );
        alert(`Payment successful: ${response.data.message}`);
        setList([]);
      } else {
        alert('Payment Successful')
        setList([]);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("An error occurred during payment.");
      console.log(salesData );
    }
  };

  const totalCost = list.reduce((acc, item) => acc + item.total_price, 0);

  return (
    <>
      <div className="sales-wrapper">
        <h2 className="sales-wrapper-title">Sales</h2>
        <div className="add-item">
          <div className="input-box-sales">
            <span>Item</span>
            <select
              name="menu_item"
              value={values.menu_item}
              onChange={handleChanges}
            >
              <option value="">Select an item</option>
              {menuItems.map((item, index) => (
                <option key={index} value={item.menu_item_name}>
                  {item.menu_item_name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-box-sales">
            <span>Quantity</span>
            <input
              type="number"
              name="quantity"
              value={values.quantity}
              onChange={handleChanges}
            />
          </div>
          <div className="input-box-sales">
            <button className="btn" onClick={addItem}>
              Add
            </button>
          </div>
        </div>

        <div className="sale-content">
          {list.length > 0 && (
            <>
              <table className="sale-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price (AED)</th>
                    <th>Total Price (AED)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, index) => (
                    <tr key={index}>
                      <td>{item.menu_item}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit_price}</td>
                      <td>{item.total_price} AED</td>
                      <td>
                        <button
                          className="delete-sale-button"
                          onClick={() => deleteItem(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="total-cost">
                <h3>Total Cost: {totalCost} AED</h3>
              </div>
              <div className="sale-payment">
                <div>
                  <span>Payment method</span>
                  <select
                    name="payment_method"
                    value={values.payment_method}
                    onChange={handleChanges}
                  >
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <button className="sale-pay-button" onClick={handlePay}>
                    Pay
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Sales;
