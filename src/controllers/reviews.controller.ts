import { Router } from "express";
import pool from "../bd";

const router = Router();

router.get('/reviews', async (req, res) => {
  const {
    sortField, 
    sortOrder 
  } = req.query;

  const [columns] = await pool.query("SHOW COLUMNS FROM reviews");
  const fields = (columns as Array<{ Field: string }>).map(column => column.Field)

  let sql = 'SELECT * FROM reviews WHERE 1=1';
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

  const [reviews] = await pool.query(sql, params);

  res.render('reviews/list', {
    reviews,
    messages: req.flash('info'),
    query: req.query,
    columns: fields,
  });
});

router.post('/reviews/add', async (req, res) => {
  const { customer_id, restaurant_id, courier_id, rating, comment } = req.body;
  if ((!restaurant_id && !courier_id) || (restaurant_id && courier_id)) {
    req.flash('error', 'Выберите ресторан ИЛИ курьера');
    return res.redirect('back');
  }

  try {
    await pool.query(
      'INSERT INTO reviews (customer_id, restaurant_id, courier_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [customer_id, restaurant_id || null, courier_id || null, rating, comment]
    );
    req.flash('info', 'Отзыв добавлен');
  } catch (error) {
    req.flash('error', `Ошибка при добавлении; ${error}`);
  }
  
  res.redirect('/reviews');
});

router.post('/reviews/delete/:id', async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE review_id = ?', [req.params.id]);
  req.flash('info', 'Отзыв удалён');
  res.redirect('/reviews');
});

export default router;