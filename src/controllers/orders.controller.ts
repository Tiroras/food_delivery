import {Router} from "express"
import pool from "../bd"

const router = Router();

router.get('/orders', async (req, res) => {
  const [orders] = await pool.query(`
    SELECT o.*, c.name AS customer_name, r.name AS restaurant_name, cr.name AS courier_name
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN restaurants r ON o.restaurant_id = r.restaurant_id
    LEFT JOIN couriers cr ON o.courier_id = cr.courier_id
  `);
  res.render('orders/list', { orders, messages: req.flash('info') });
});

router.get('/orders/add', async (req, res) => {
  const [customers] = await pool.query('SELECT * FROM customers');
  const [restaurants] = await pool.query('SELECT * FROM restaurants');
  const [couriers] = await pool.query('SELECT * FROM couriers');
  res.render('orders/form', { order: {}, customers, restaurants, couriers, action: '/orders/add' });
});

router.post('/orders/add', async (req, res) => {
  const { customer_id, restaurant_id, courier_id, status } = req.body;
  await pool.query('INSERT INTO orders (customer_id, restaurant_id, courier_id, status) VALUES (?, ?, ?, ?)', [customer_id, restaurant_id, courier_id || null, status]);
  req.flash('info', 'Заказ добавлен');
  res.redirect('/orders');
});

router.get('/orders/edit/:id', async (req, res) => {
  const orders = await pool.query('SELECT * FROM orders WHERE order_id = ?', [req.params.id]);
  if (!orders.length) return res.redirect('/orders');

  const [customers] = await pool.query('SELECT * FROM customers');
  const [restaurants] = await pool.query('SELECT * FROM restaurants');
  const [couriers] = await pool.query('SELECT * FROM couriers');

  res.render('orders/form', {
    order: orders[0],
    customers,
    restaurants,
    couriers,
    action: '/orders/edit/' + req.params.id
  });
});

router.post('/orders/edit/:id', async (req, res) => {
  const { customer_id, restaurant_id, courier_id, status } = req.body;
  await pool.query(
    'UPDATE orders SET customer_id = ?, restaurant_id = ?, courier_id = ?, status = ? WHERE order_id = ?',
    [customer_id, restaurant_id, courier_id || null, status, req.params.id]
  );
  req.flash('info', 'Заказ обновлён');
  res.redirect('/orders');
});

router.post('/orders/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM orders WHERE order_id = ?', [req.params.id]);
  req.flash('info', 'Заказ удалён');
  res.redirect('/orders');
});

export default router;