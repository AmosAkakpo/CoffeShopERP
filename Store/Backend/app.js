import axios from 'axios'
import express from 'express';
import mysql2 from 'mysql2';
import cors from 'cors';
import jwt from 'jsonwebtoken';
const { verify } = jwt;

import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
app.use(express.json());
app.use(cors({
  origin:["http://localhost:5173"],
  methods:["POST", "GET"],
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql2.createConnection({
  host: "localhost",
  user: 'root',
  password: "951753",
  database: 'coffeeshop',
});

app.post('/Login', (req, res) => {
  const { employee_id, password } = req.body;

  db.query(
    'SELECT * FROM USER WHERE EMPLOYEE_ID = ?',
    [employee_id],
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Database error. Please try again later.' });
      }
      if (data.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      const hashedPassword = data[0].PASSWRD;
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: 'Internal error. Please try again later.' });
        }

        if (isMatch) {
            const token = jwt.sign({employee_id},'jwt-secret-key',{expiresIn:'10h'});  
            res.cookie('token',token);
            return res.status(200).json({
                Status: 'Success',
                message: 'Login successful',
                position: data[0].POSITION,
                data: data[0],
            });
        } else {
          return res.status(401).json({ error: 'Invalid credentials.' });
        }
      });
    }
  );
});


app.post('/review', (req, res) => {
  const { branch_id, review_date, star_rating, review_comment } = req.body;

  console.log('Received data:', { branch_id, review_date, star_rating, review_comment });

  const getLastIdSql = `SELECT REVIEW_ID FROM REVIEWS ORDER BY REVIEW_ID DESC LIMIT 1`;

  db.query(getLastIdSql, (err, result) => {
    if (err) {
      console.error("Error fetching last REVIEW_ID:", err.code, err.message);
      return res.status(500).json({ Message: 'Error fetching last REVIEW_ID', error: err });
    }

 
    const lastId = result.length > 0 ? result[0].REVIEW_ID : null;
    const nextId = lastId
      ? `R${String(parseInt(lastId.substring(1)) + 1).padStart(4, '0')}` 
      : 'R0001'; 

    console.log('Generated REVIEW_ID:', nextId);

    const insertSql = `
      INSERT INTO REVIEWS (REVIEW_ID, BRANCH_ID, REVIEW_DATE, STAR_RATING, REVIEW_COMMENT)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertSql, [nextId, branch_id, review_date, star_rating, review_comment], (err, result) => {
      if (err) {
        console.error("Error saving review:", err.code, err.message);
        return res.status(500).json({ Message: 'Error saving review', error: err });
      }

      console.log("Review saved successfully:", result);
      return res.status(200).json({
        Status: 'Success',
        Message: 'Review saved successfully!',
      });
    });
  });
});


app.get('/menu',(req,res)=>{
  const sql = 
  `SELECT MENU_ITEM_ID,CATEGORY_NAME,
  MENU_ITEM_NAME,UNIT_PRICE FROM MENU_ITEMS,CATEGORIES 
  WHERE CATEGORIES.CATEGORY_ID=MENU_ITEMS.CATEGORY_ID;`

  db.query(sql,(err,result)=>{
    if(err) return res.json({Message:'Error inside server'});
    return res.json(result);
  })
})


app.get('/account', (req, res) => {
  const employeeId = 'E0003'; 
  const sql = `
    SELECT 
      EMPLOYEES.EMPLOYEE_FNAME,
      EMPLOYEES.EMPLOYEE_LNAME,
      EMPLOYEES.EMPLOYEE_TELEPHONE,
      EMPLOYEES.BRANCH_ID,
      POSITIONS.POSITION_NAME,
      SHIFT_SCHEDULES.STARTING_TIME,
      SHIFT_SCHEDULES.ENDING_TIME
    FROM 
      SHIFT_SCHEDULES
    JOIN 
      EMPLOYEES ON SHIFT_SCHEDULES.EMPLOYEE_ID = EMPLOYEES.EMPLOYEE_ID
    JOIN POSITIONS ON EMPLOYEES.POSITION_ID = POSITIONS.POSITION_ID
    WHERE 
      EMPLOYEES.EMPLOYEE_ID = ? AND 
      SHIFT_SCHEDULES.EMPLOYEE_ID = EMPLOYEES.EMPLOYEE_ID;
  `;

 
  db.query(sql, [employeeId], (err, result) => {
    if (err) {
      return res.json({ Message: 'Error inside server', error: err });
    }
    return res.json(result);
  });
});

// app.post('/sales', (req, res) => {
//   const { branch_id, employee_id, payment_method, sales_items } = req.body;

//   if (!sales_items || sales_items.length === 0) {
//     return res.status(400).json({ message: 'No items provided for the sale.' });
//   }

//   const getLastSaleIdSql = `SELECT SALE_ID FROM SALES ORDER BY SALE_ID DESC LIMIT 1`;
//   db.query(getLastSaleIdSql, (err, saleResult) => {
//     if (err) {
//       console.error('Error fetching last SALE_ID:', err);
//       return res.status(500).json({ message: 'Error fetching last SALE_ID', error: err });
//     }

//     const lastSaleId = saleResult.length > 0 ? saleResult[0].SALE_ID : null;
//     const newSaleId = lastSaleId
//       ? `S${String(parseInt(lastSaleId.substring(1)) + 1).padStart(4, '0')}`
//       : 'S0001'; 

//     const totalAmount = sales_items.reduce((acc, item) => acc + item.total_price, 0);
//     const saleTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); 

    
//     const insertSaleSql = `
//       INSERT INTO SALES (SALE_ID, BRANCH_ID, EMPLOYEE_ID, SALE_TIMESTAMP, TOTAL_AMOUNT, PAYMENT_METHOD)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     db.query(
//       insertSaleSql,
//       [newSaleId, branch_id, employee_id, saleTimestamp, totalAmount, payment_method],
//       (err, saleInsertResult) => {
//         if (err) {
//           console.error('Error inserting sale:', err);
//           return res.status(500).json({ message: 'Error inserting sale', error: err });
//         }

        
//         const getLastSaleItemIdSql = `SELECT SALE_ITEM_ID FROM SALE_ITEMS ORDER BY SALE_ITEM_ID DESC LIMIT 1`;
//         db.query(getLastSaleItemIdSql, (err, saleItemResult) => {
//           if (err) {
//             console.error('Error fetching last SALE_ITEM_ID:', err);
//             return res.status(500).json({ message: 'Error fetching last SALE_ITEM_ID', error: err });
//           }

//           const lastSaleItemId = saleItemResult.length > 0 ? saleItemResult[0].SALE_ITEM_ID : null;
//           let nextSaleItemId = lastSaleItemId
//             ? parseInt(lastSaleItemId.substring(2)) + 1
//             : 1; 

//           const saleItemInserts = sales_items.map((item) => {
//             const saleItemId = `SI${String(nextSaleItemId++).padStart(4, '0')}`; 
//             return [
//               saleItemId,
//               newSaleId, 
//               item.menu_item_id,
//               item.quantity,
//               item.unit_price,
//               item.total_price,
//             ];
//           });

          
//           const insertSaleItemsSql = `
//             INSERT INTO SALE_ITEMS (SALE_ITEM_ID, SALE_ID, MENU_ITEM_ID, QUANTITY, UNIT_PRICE, TOTAL_PRICE)
//             VALUES ?
//           `;

//           db.query(insertSaleItemsSql, [saleItemInserts], (err, saleItemsInsertResult) => {
//             if (err) {
//               console.error('Error inserting sale items:', err);
//               return res.status(500).json({ message: 'Error inserting sale items', error: err });
//             }

            
//             res.status(201).json({
//               message: 'Sale and sale items saved successfully.',
//               sale_id: newSaleId,
//               total_amount: totalAmount,
//             });
//           });
//         });
//       }
//     );
//   });
// });

app.post('/sales', (req, res) => {
  const { branch_id, employee_id, payment_method, sales_items } = req.body;

  if (!sales_items || sales_items.length === 0) {
    return res.status(400).json({ message: 'No items provided for the sale.' });
  }

  function generateSaleID() {
    return `S${Math.floor(Math.random() * 100000000)}`; 
  }

  function generateSaleItemID() {
    return `SI${Math.floor(Math.random() * 10000000)}`; 
  }

  const newSaleId = generateSaleID(); 
  const totalAmount = sales_items.reduce((acc, item) => acc + item.total_price, 0);
  const saleTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const insertSaleSql = `
    INSERT INTO SALES (SALE_ID, BRANCH_ID, EMPLOYEE_ID, SALE_TIMESTAMP, TOTAL_AMOUNT, PAYMENT_METHOD)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertSaleSql,
    [newSaleId, branch_id, employee_id, saleTimestamp, totalAmount, payment_method],
    (err, saleInsertResult) => {
      if (err) {
        console.error('Error inserting sale:', err);
        return res.status(500).json({ message: 'Error inserting sale', error: err });
      }

      const saleItemInserts = sales_items.map((item) => {
        const saleItemId = generateSaleItemID(); 
        return [
          saleItemId,
          newSaleId,
          item.menu_item_id,
          item.quantity,
          item.unit_price,
          item.total_price,
        ];
      });

      const insertSaleItemsSql = `
        INSERT INTO SALE_ITEMS (SALE_ITEM_ID, SALE_ID, MENU_ITEM_ID, QUANTITY, UNIT_PRICE, TOTAL_PRICE)
        VALUES ?
      `;

      db.query(insertSaleItemsSql, [saleItemInserts], (err, saleItemsInsertResult) => {
        if (err) {
          console.error('Error inserting sale items:', err);
          return res.status(500).json({ message: 'Error inserting sale items', error: err });
        }

        res.status(201).json({
          message: 'Sale and sale items saved successfully.',
          sale_id: newSaleId,
          total_amount: totalAmount,
        });
      });
    }
  );
});



app.get('/Logout',(req,res)=>{
  res.clearCookie('token');
  return res.json({Status:'Success'});
})


app.listen(3000, () => {
  console.log("Server is Running");
});
