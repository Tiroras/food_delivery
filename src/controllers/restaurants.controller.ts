import {Router} from "express"
import pool from "../bd"
import { QueryResult } from "mysql2";

const router = Router();

router.get('/restaurants', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM restaurants");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM restaurants WHERE 1=1';
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

  const [restaurants] = await pool.query(sql, params);

  res.render('restaurants/list', {
    restaurants,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
    tableName: "restaurants"
  });
});

router.get('/restaurants/add', (req, res) => {
  res.render('restaurants/form', { restaurant: {}, action: '/restaurants/add' });
});

router.post('/restaurants/add', async (req, res) => {
  const { name, address, phone } = req.body;
  await pool.query('INSERT INTO restaurants (name, address, phone) VALUES (?, ?, ?)', [name, address, phone]);
  req.flash('info', 'Ресторан добавлен');
  res.redirect('/restaurants');
});

router.get('/restaurants/edit/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM restaurants WHERE restaurant_id = ?', [req.params.id]);
  const data = rows as QueryResult[];
  if (!data.length) return res.redirect('/restaurants');
  res.render('restaurants/form', { restaurant: rows[0], action: '/restaurants/edit/' + req.params.id });
});

router.post('/restaurants/edit/:id', async (req, res) => {
  const { name, address, phone } = req.body;
  await pool.query('UPDATE restaurants SET name = ?, address = ?, phone = ? WHERE restaurant_id = ?', [name, address, phone, req.params.id]);
  req.flash('info', 'Ресторан обновлён');
  res.redirect('/restaurants');
});

router.post('/restaurants/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM restaurants WHERE restaurant_id = ?', [req.params.id]);
  req.flash('info', 'Ресторан удалён');
  res.redirect('/restaurants');
});

export default router;