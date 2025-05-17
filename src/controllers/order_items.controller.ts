import { Router } from "express";
import pool from "../bd";

const router = Router();

router.get('/order_items', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM order_items");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM order_items WHERE 1=1';
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

  const [order_items] = await pool.query(sql, params);

  res.render('order_items/list', {
    order_items,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
    tableName: "order_items"
  });
});

router.get('/order_items/add', async (req, res) => {
  const [orders] = await pool.query('SELECT order_id FROM orders');
  const [menuItems] = await pool.query('SELECT * FROM menu_items');
  

  res.render('order_items/form', {
    item: {},
    orders,
    menuItems,
    action: '/order_items/add'
  });
});

router.post('/order_items/add', async (req, res) => {
  const { order_id, item_id, quantity, price_each } = req.body;
  await pool.query(
    'INSERT INTO order_items (order_id, item_id, quantity, price_each) VALUES (?, ?, ?, ?)',
    [order_id, item_id, quantity, price_each]
  );
  req.flash('info', 'Позиция добавлена в заказ');
  res.redirect('/order_items');
});

router.get('/order_items/edit/:id', async (req, res) => {
  const [item] = await pool.query('SELECT * FROM order_items WHERE order_item_id = ?', [req.params.id]);
  const [orders] = await pool.query('SELECT order_id FROM orders');
  const [menuItems] = await pool.query('SELECT * FROM menu_items');
  res.render('order_items/form', {
    item,
    orders,
    menuItems,
    action: '/order_items/edit/' + req.params.id
  });
});
router.post('/order_items/edit/:id', async (req, res) => {
  const { order_id, item_id, quantity, price_each } = req.body;
  await pool.query(
    'UPDATE order_items SET order_id = ?, item_id = ?, quantity = ?, price_each = ? WHERE order_item_id = ?',
    [order_id, item_id, quantity, price_each, req.params.id]
  );
  req.flash('info', 'Позиция обновлена');
  res.redirect('/order_items');
});

router.post('/order_items/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM order_items WHERE order_item_id = ?', [req.params.id]);
  req.flash('info', 'Позиция удалена');
  res.redirect('/order_items');
});

export default router;