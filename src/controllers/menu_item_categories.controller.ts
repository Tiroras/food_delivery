import { Router } from "express";
import pool from "../bd";

const router = Router();

router.get('/menu_item_categories', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM menu_item_categories");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM menu_item_categories WHERE 1=1';
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

  const [menu_item_categories] = await pool.query(sql, params);

  res.render('menu_item_categories/list', {
    menu_item_categories,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
    tableName: "menu_item_categories"
  });
});

router.get('/menu_item_categories/add', async (req, res) => {
  const [items] = await pool.query('SELECT * FROM menu_items');
  const [categories] = await pool.query('SELECT * FROM menu_categories');
  res.render('menu_item_categories/form', {
    link: {},
    items,
    categories,
    action: '/menu_item_categories/add'
  });
});

router.post('/menu_item_categories/add', async (req, res) => {
  const { item_id, category_id } = req.body;
  try {
    await pool.query('INSERT INTO menu_item_categories (item_id, category_id) VALUES (?, ?)', [item_id, category_id]);
    req.flash('info', 'Связь добавлена');
  } catch (err) {
    req.flash('info', `Ошибка: такая связь уже существует или данные некорректны; ${err}`);
  }
  res.redirect('/menu_item_categories');
});

router.post('/menu_item_categories/delete', async (req, res) => {
  const { item_id, category_id } = req.body;
  await pool.query('DELETE FROM menu_item_categories WHERE item_id = ? AND category_id = ?', [item_id, category_id]);
  req.flash('info', 'Связь удалена');
  res.redirect('/menu_item_categories');
});

export default router;