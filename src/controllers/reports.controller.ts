import {Router} from "express"
import pool from "../bd"

const router = Router();

router.get("/reports", (req, res) => {
  res.render("reports", { messages: req.flash("info") })
})

// Отчет доходов по ресторанам
router.get("/reports/restaurant-sales", (req, res) => {
  res.render("reports/restaurant_sales_form", { query: req.query, results: null, messages: req.flash("info") });
});
router.post("/reports/restaurant-sales", async (req, res) => {
  const { min_total = 0, limit = 10 } = req.body;
  const [rows] = await pool.query(`
    SELECT restaurant_id, name AS restaurant_name, orders_count, total_sales
    FROM v_restaurant_sales
    WHERE total_sales >= ?
    ORDER BY total_sales DESC
    LIMIT ?
  `, [Number(min_total), Number(limit)]);
  res.render("reports/restaurant_sales_form", { query: req.body, results: rows, messages: req.flash("info") });
});

// Отчет активности клиентов
router.get("/reports/customer-activity", (req, res) => {
  res.render("reports/customer_activity_form", { query: req.query, results: null, messages: req.flash("info") });
});
router.post("/reports/customer-activity", async (req, res) => {
  const { date_from, date_to, min_orders = 1 } = req.body;
  const [rows] = await pool.query(`
    SELECT c.customer_id, c.name AS customer_name,
           COUNT(o.order_id) AS orders_count,
           SUM(o.total_amount) AS total_spent
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.order_date BETWEEN ? AND ?
    GROUP BY c.customer_id, c.name
    HAVING orders_count >= ?
    ORDER BY total_spent DESC, orders_count DESC
  `, [date_from, date_to, min_orders]);
  res.render("reports/customer_activity_form", { query: req.body, results: rows, messages: req.flash("info") });
});

// Отчет среднего рейтинга по ресторанам
router.get("/reports/restaurant-ratings", (req, res) => {
  res.render("reports/restaurant_ratings_form", { query: req.query, results: null, messages: req.flash("info") });
});
router.post("/reports/restaurant-ratings", async (req, res) => {
  const { min_reviews = 1, sort_order = "DESC" } = req.body;
  const [rows] = await pool.query(`
    SELECT mc.restaurant_id,
           r.name AS restaurant_name,
           COUNT(mc.review_id) AS reviews_count,
           ROUND(AVG(mc.rating), 2) AS avg_rating
    FROM reviews mc
    JOIN restaurants r ON mc.restaurant_id = r.restaurant_id
    WHERE mc.restaurant_id IS NOT NULL
    GROUP BY mc.restaurant_id, r.name
    HAVING reviews_count >= ?
    ORDER BY avg_rating ${sort_order === "ASC" ? "ASC" : "DESC"}
  `, [min_reviews]);
  res.render("reports/restaurant_ratings_form", { query: req.body, results: rows, messages: req.flash("info") });
});

export default router;