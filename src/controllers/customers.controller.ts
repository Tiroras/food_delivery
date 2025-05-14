import {Router} from "express"
import pool from "../bd"

const router = Router();

router.get('/customers', async (req, res) => {
  // Читаем параметры из query string
  const {
    searchName,
    searchEmail, 
    filterPhone,
    sortField, 
    sortOrder 
  } = req.query;

  let sql = 'SELECT * FROM customers WHERE 1=1';
  const params = [];

  if (searchName) {
    sql += ' AND name LIKE ?';
    params.push(`%${searchName}%`);
  }
  if (searchEmail) {
    sql += ' AND email LIKE ?';
    params.push(`%${searchEmail}%`);
  }
  if (filterPhone) {
    sql += ' AND phone LIKE ?';
    params.push(`%${filterPhone}%`);
  }

  const allowedSort = ['name','email','phone','address','registered_at'];
  if (sortField && allowedSort.includes(sortField.toString())) {
    sql += ` ORDER BY ${sortField} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}`;
  }

  const [customers] = await pool.query(sql, params);

  res.render('customers/list', {
    customers,
    messages: req.flash('info'),
    query: req.query
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
  const rows = await pool.query('SELECT * FROM customers WHERE customer_id = ?', [req.params.id]);
  if (!rows.length) return res.redirect('/customers');
  res.render('customers/form', { customer: rows[0], action: '/customers/edit/' + req.params.id });
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