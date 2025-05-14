import { Router } from "express";
import pool from "../bd";
import { ResultSetHeader } from "mysql2";

const router = Router();

router.get('/menu-items', async (req, res) => {
  const { restaurant_id, available } = req.query;
  let query = `
    SELECT mi.*, r.name AS restaurant_name 
    FROM menu_items mi
    JOIN restaurants r ON mi.restaurant_id = r.restaurant_id
  `;
  const params = [];

  if (restaurant_id) {
    query += ' WHERE mi.restaurant_id = ?';
    params.push(restaurant_id);
  }

  if (available === 'true') query += ' AND mi.available = 1';

  const [menuItems] = await pool.query(query, params);
  const [restaurants] = await pool.query('SELECT * FROM restaurants');
  
  res.render('menu-items/list', { 
    menuItems, 
    restaurants,
    messages: req.flash('info') 
  });
});

router.get('/menu-items/add', async (req, res) => {
  const [restaurants] = await pool.query('SELECT * FROM restaurants');
  const [categories] = await pool.query('SELECT * FROM menu_categories');
  res.render('menu-items/form', { 
    item: {}, 
    restaurants, 
    categories,
    action: '/menu-items/add' 
  });
});

router.post('/menu-items/add', async (req, res) => {
  const { restaurant_id, name, price, available, categories } = req.body;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO menu_items (restaurant_id, name, price, available) VALUES (?, ?, ?, ?)',
      [restaurant_id, name, price, available ? 1 : 0]
    );
    for (const category_id of categories) {
      await connection.query(
        'INSERT INTO menu_item_categories (item_id, category_id) VALUES (?, ?)',
        [result.insertId, category_id]
      );
    }

    await connection.commit();
    req.flash('info', 'Пункт меню добавлен');
  } catch (error) {
    await connection.rollback();
    req.flash('error', `Ошибка при создании; ${error}`);
  } finally {
    connection.release();
  }
  
  res.redirect('/menu-items');
});

export default router;