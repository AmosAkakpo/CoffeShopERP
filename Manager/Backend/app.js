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
  origin:["http://localhost:5174"],
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

app.get('/account', (req, res) => {
  const employeeId = 'E0001'; 
  const sql = `
    SELECT EMPLOYEES.EMPLOYEE_FNAME,EMPLOYEES.EMPLOYEE_LNAME,EMPLOYEES.EMPLOYEE_TELEPHONE,EMPLOYEES.BRANCH_ID,POSITIONS.POSITION_NAME
    FROM EMPLOYEES
    JOIN POSITIONS ON EMPLOYEES.POSITION_ID = POSITIONS.POSITION_ID
    WHERE EMPLOYEES.EMPLOYEE_ID = ?;
  `;

  db.query(sql, [employeeId], (err, result) => {
    if (err) {
      return res.json({ Message: 'Error inside server', error: err });
    }
    return res.json(result);
  });
});

app.get('/employees', (req, res) => {
  const BRANCH_ID = 'B001'; 
  const sql = `
    SELECT EMPLOYEES.EMPLOYEE_ID, EMPLOYEES.EMPLOYEE_FNAME,EMPLOYEES.EMPLOYEE_LNAME,
    EMPLOYEES.EMPLOYEE_TELEPHONE,POSITIONS.POSITION_NAME,EMPLOYEE_SALARY,EMPLOYEE_IBAN
    FROM EMPLOYEES
    JOIN POSITIONS ON EMPLOYEES.POSITION_ID = POSITIONS.POSITION_ID
    WHERE EMPLOYEES.BRANCH_ID =?
  `;

  
  db.query(sql, [BRANCH_ID], (err, result) => {
    if (err) {
      return res.json({ Message: 'Error inside server', error: err });
    }
    return res.json(result);
  });
});

app.get('/sales', (req, res) => {
  const BRANCH_ID = 'B001'; 
  const sql = `
    SELECT EMPLOYEES.EMPLOYEE_ID, CONCAT(EMPLOYEES.EMPLOYEE_FNAME,' ',EMPLOYEES.EMPLOYEE_LNAME) AS 'EMPLOYEE_NAME',
    SALE_TIMESTAMP,TOTAL_AMOUNT,PAYMENT_METHOD
    FROM EMPLOYEES
    JOIN SALES ON EMPLOYEES.BRANCH_ID = SALES.BRANCH_ID
    WHERE EMPLOYEES.BRANCH_ID =?
  `;

  db.query(sql, [BRANCH_ID], (err, result) => {
    if (err) {
      return res.json({ Message: 'Error inside server', error: err });
    }
    return res.json(result);
  });
});


app.listen(4000, () => {
    console.log("Server is Running");
  });
  