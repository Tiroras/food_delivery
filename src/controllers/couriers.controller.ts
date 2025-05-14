import { Router } from "express";
import pool from "../bd";

const router = Router();

router.get('/couriers', async (req, res) => {
  const { vehicle } = req.query;
  let query = 'SELECT * FROM couriers';
  const params = [];

  if (vehicle) {
    query += ' WHERE vehicle = ?';
    params.push(vehicle);
  }

  const [couriers] = await pool.query(query, params);
  res.render('couriers/list', { 
    couriers, 
    vehicles: ['Велосипед', 'Авто', 'Скутер', 'Пешком'],
    messages: req.flash('info') 
  });
});

router.get('/couriers/add', (req, res) => {
  res.render('couriers/form', { 
    courier: {}, 
    vehicles: ['Велосипед', 'Авто', 'Скутер', 'Пешком'],
    action: '/couriers/add' 
  });
});

router.post('/couriers/add', async (req, res) => {
  const { name, phone, vehicle, hired_at } = req.body;
  try {
    await pool.query(
      'INSERT INTO couriers (name, phone, vehicle, hired_at) VALUES (?, ?, ?, ?)',
      [name, phone, vehicle, hired_at]
    );
    req.flash('info', 'Курьер добавлен');
  } catch (error) {
    req.flash('error', `Ошибка: номер телефона уже существует; ${error}`);
  }
  res.redirect('/couriers');
});


router.get('/couriers/edit/:id', async (req, res) => {
  const rows = await pool.query('SELECT * FROM couriers WHERE courier_id = ?', [req.params.id]);
  if (!rows.length) return res.redirect('/couriers');
  res.render('couriers/form', { 
    courier: rows[0], 
    vehicles: ['Велосипед', 'Авто', 'Скутер', 'Пешком'],
    action: `/couriers/edit/${req.params.id}` 
  });
});

router.post('/couriers/edit/:id', async (req, res) => {
  const { name, phone, vehicle, hired_at } = req.body;
  await pool.query(
    'UPDATE couriers SET name = ?, phone = ?, vehicle = ?, hired_at = ? WHERE courier_id = ?',
    [name, phone, vehicle, hired_at, req.params.id]
  );
  req.flash('info', 'Данные курьера обновлены');
  res.redirect('/couriers');
});

router.post('/couriers/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM couriers WHERE courier_id = ?', [req.params.id]);
  req.flash('info', 'Курьер удалён');
  res.redirect('/couriers');
});

export default router;