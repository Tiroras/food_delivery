import {Router} from "express"
import pool from "../bd"
import { QueryResult } from "mysql2";

const router = Router();

router.get('/customers', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM customers");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM customers WHERE 1=1';
  const params: string[] = [];

  Object.entries(req.query).forEach(item => {
    if (
      item[0] !== "sortField" && 
      item[0] !== "sortOrder" && 
      fields.includes(item[0]) &&
      item[1]
    ) {
      sql += ` AND ${item[0]} LIKE ?`;
      params.push(`%${item[1]}%`);
    }
  })

  if (sortField) {
    sql += ` ORDER BY ${sortField} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
  }

  const [customers] = await pool.query(sql, params);

  res.render('customers/list', {
    customers,
    messages: req.flash('info'),
    columns: fields,
    query: req.query,
    tableName: "customers"
  });
});

router.get('/customers/add', (req, res) => {
  res.render('customers/form', { customer: {}, action: '/customers/add' });
});

router.post('/customers/add', async (req, res) => {
  const { email, name, phone, address } = req.body;
  await pool.query('INSERT INTO customers (email, name, phone, address) VALUES (?, ?, ?, ?)', [email, name, phone, address]);
  req.flash('info', 'Клиент добавлен');
  res.redirect('/customers');
});

router.get('/customers/edit/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM customers WHERE customer_id = ?', [req.params.id]);
  const data = rows as QueryResult[];
  if (!data.length) return res.redirect('/customers');
  res.render('customers/form', { customer: data[0], action: '/customers/edit/' + req.params.id });
});

router.post('/customers/edit/:id', async (req, res) => {
  const { email, name, phone, address } = req.body;
  await pool.query('UPDATE customers SET email = ?, name = ?, phone = ?, address = ? WHERE customer_id = ?', [email, name, phone, address, req.params.id]);
  req.flash('info', 'Клиент обновлён');
  res.redirect('/customers');
});

router.post('/customers/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM customers WHERE customer_id = ?', [req.params.id]);
  req.flash('info', 'Клиент удалён');
  res.redirect('/customers');
});

export default router;