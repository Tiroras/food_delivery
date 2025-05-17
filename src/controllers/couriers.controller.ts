import { Router } from "express";
import pool from "../bd";
import { QueryResult } from "mysql2";

const router = Router();

router.get('/couriers', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM couriers");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM couriers WHERE 1=1';
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

  const [couriers] = await pool.query(sql, params);

  res.render('couriers/list', {
    couriers,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
    tableName: "couriers"
  });
});

router.get('/couriers/add', (req, res) => {
  res.render('couriers/form', { courier: {}, action: '/couriers/add' });
});

router.post('/couriers/add', async (req, res) => {
  const { name, phone, vehicle, hired_at } = req.body;
  try {
    await pool.query(
      'INSERT INTO couriers (name, phone, vehicle, hired_at) VALUES (?, ?, ?, ?)',
      [name, phone, vehicle, hired_at]
    );
    req.flash('info', 'Курьер добавлен');
  } catch (err) {
    req.flash('info', `Ошибка: возможно, телефон уже существует; ${err}`);
  }
  res.redirect('/couriers');
});

router.get('/couriers/edit/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM couriers WHERE courier_id = ?', [req.params.id]);
  const data = rows as QueryResult[];
  if (!data.length) return res.redirect('/couriers');
  res.render('couriers/form', { courier: data[0], action: '/couriers/edit/' + req.params.id });
});

router.post('/couriers/edit/:id', async (req, res) => {
  const { name, phone, vehicle, hired_at } = req.body;
  try {
    await pool.query(
      'UPDATE couriers SET name = ?, phone = ?, vehicle = ?, hired_at = ? WHERE courier_id = ?',
      [name, phone, vehicle, hired_at, req.params.id]
    );
    req.flash('info', 'Курьер обновлён');
  } catch (err) {
    req.flash('info', `Ошибка обновления: возможно, дублируется телефон; ${err}`);
  }
  res.redirect('/couriers');
});

router.post('/couriers/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM couriers WHERE courier_id = ?', [req.params.id]);
  req.flash('info', 'Курьер удалён');
  res.redirect('/couriers');
});

export default router;