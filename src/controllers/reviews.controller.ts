import { Router } from "express";
import pool from "../bd";

const router = Router();

router.get('/reviews', async (req, res) => {
  const [reviews] = await pool.query(`
    SELECT rv.*, 
      c.name AS customer_name,
      rs.name AS restaurant_name,
      cr.name AS courier_name
    FROM reviews rv
    LEFT JOIN customers c ON rv.customer_id = c.customer_id
    LEFT JOIN restaurants rs ON rv.restaurant_id = rs.restaurant_id
    LEFT JOIN couriers cr ON rv.courier_id = cr.courier_id
  `);
  res.render('reviews/list', { reviews, messages: req.flash('info') });
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