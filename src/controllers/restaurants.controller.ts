import {Router} from "express"
import pool from "../bd"

const router = Router();

router.get('/restaurants', async (req, res) => {
  const [restaurants] = await pool.query('SELECT * FROM restaurants');
  res.render('restaurants/list', { restaurants, messages: req.flash('info') });
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
  const rows = await pool.query('SELECT * FROM restaurants WHERE restaurant_id = ?', [req.params.id]);
  if (!rows.length) return res.redirect('/restaurants');
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