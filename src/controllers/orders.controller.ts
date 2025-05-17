import {Router} from "express"
import pool from "../bd"

const router = Router();

router.get('/orders', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM orders");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM orders WHERE 1=1';
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

  const [orders] = await pool.query(sql, params);

  res.render('orders/list', {
    orders,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
    tableName: "orders"
  });
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
    order: orders[0][0],
    customers,
    restaurants,
    couriers,
    action: '/orders/edit/' + req.params.id
  });
});

router.post('/orders/edit/:id', async (req, res) => {
  const { customer_id, restaurant_id, courier_id, status, order_date, total_amount, delivered_at } = req.body;
  await pool.query(
    'UPDATE orders SET customer_id = ?, restaurant_id = ?, courier_id = ?, status = ?, order_date = ?, total_amount = ?, delivered_at = ? WHERE order_id = ?',
    [customer_id, restaurant_id, courier_id || null, status, order_date, total_amount, delivered_at, req.params.id]
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