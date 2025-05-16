import { Router } from "express";
import pool from "../bd";
import { ResultSetHeader } from "mysql2";

const router = Router();

router.get('/menu_items', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM menu_items");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM menu_items WHERE 1=1';
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

  const [menuItems] = await pool.query(sql, params);

  res.render('menu_items/list', {
    menuItems,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
  });
});

router.get('/menu_items/add', async (req, res) => {
  const [restaurants] = await pool.query('SELECT * FROM restaurants');
  const [categories] = await pool.query('SELECT * FROM menu_categories');
  res.render('menu_items/form', { 
    item: {}, 
    restaurants, 
    categories,
    action: '/menu_items/add' 
  });
});

router.post('/menu_items/add', async (req, res) => {
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
  
  res.redirect('/menu_items');
});

export default router;