import {Router} from "express"
import pool from "../bd"

const router = Router();

router.get('/menu_categories', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM menu_categories");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM menu_categories WHERE 1=1';
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

  const [menu_categories] = await pool.query(sql, params);

  res.render('menu_categories/list', {
    menu_categories,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
  });
});

router.get('/menu_categories/add', (req, res) => {
  res.render('menu_categories/form', { category: {}, action: '/menu_categories/add' });
});

router.post('/menu_categories/add', async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO menu_categories (name) VALUES (?)', [name]);
  req.flash('info', 'Категория добавлена');
  res.redirect('/menu_categories');
});

router.get('/menu_categories/edit/:id', async (req, res) => {
  const rows = await pool.query('SELECT * FROM menu_categories WHERE category_id = ?', [req.params.id]);
  if (!rows.length) return res.redirect('/menu_categories');
  res.render('menu_categories/form', { category: rows[0], action: '/menu_categories/edit/' + req.params.id });
});

router.post('/menu_categories/edit/:id', async (req, res) => {
  const { name } = req.body;
  await pool.query('UPDATE menu_categories SET name = ? WHERE category_id = ?', [name, req.params.id]);
  req.flash('info', 'Категория обновлена');
  res.redirect('/menu_categories');
});

router.post('/menu_categories/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM menu_categories WHERE category_id = ?', [req.params.id]);
  req.flash('info', 'Категория удалена');
  res.redirect('/menu_categories');
});

export default router;