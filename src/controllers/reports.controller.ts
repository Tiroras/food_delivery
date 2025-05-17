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
  const minTotal = parseFloat(req.body.min_total) || 0;
  const limitNum  = Math.min(Math.max(parseInt(req.body.limit,10) || 10, 1), 1000);
  const allowedFields = ["orders_count", "total_sales", "restaurant_name"];
  const sortField = allowedFields.includes(req.body.sort_field) 
    ? req.body.sort_field 
    : "total_sales";
  const sortOrder = req.body.sort_order === "ASC" ? "ASC" : "DESC";

  const sql = `
    SELECT restaurant_id, name AS restaurant_name, orders_count, total_sales
    FROM v_restaurant_sales
    WHERE total_sales >= ?
    ORDER BY ${sortField} ${sortOrder}
    LIMIT ${limitNum}
  `;
  const [rows] = await pool.query(sql, [minTotal]);
  res.render("reports/restaurant_sales_form", {
    query: req.body,
    results: rows,
    messages: req.flash("info")
  });
});

// Отчет активности клиентов
router.get("/reports/customer-activity", (req, res) => {
  res.render("reports/customer_activity_form", { query: req.query, results: null, messages: req.flash("info") });
});
router.post("/reports/customer-activity", async (req, res) => {
  const from = req.body.date_from;
  const to   = req.body.date_to;
  const minO = parseInt(req.body.min_orders,10) || 1;

  const allowed = ["orders_count", "total_spent", "customer_name"];
  const sortF = allowed.includes(req.body.sort_field) 
    ? req.body.sort_field 
    : "total_spent";
  const sortO = req.body.sort_order === "ASC" ? "ASC" : "DESC";

  const [rows] = await pool.query(`
    SELECT c.customer_id, c.name AS customer_name,
           COUNT(o.order_id)   AS orders_count,
           SUM(o.total_amount) AS total_spent
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.order_date BETWEEN ? AND ?
    GROUP BY c.customer_id, c.name
    HAVING orders_count >= ?
    ORDER BY ${sortF} ${sortO}
  `, [from, to, minO]);

  res.render("reports/customer_activity_form", {
    query: req.body,
    results: rows,
    messages: req.flash("info")
  });
});

// Отчет среднего рейтинга по ресторанам
router.get("/reports/restaurant-ratings", (req, res) => {
  res.render("reports/restaurant_ratings_form", { query: req.query, results: null, messages: req.flash("info") });
});
router.post("/reports/restaurant-ratings", async (req, res) => {
  const minR = parseInt(req.body.min_reviews,10) || 1;
  const allowedR = ["avg_rating", "reviews_count", "restaurant_name"];
  const sortF = allowedR.includes(req.body.sort_field) 
    ? req.body.sort_field 
    : "avg_rating";
  const sortO = req.body.sort_order === "ASC" ? "ASC" : "DESC";

  const [rows] = await pool.query(`
    SELECT mc.restaurant_id,
           r.name             AS restaurant_name,
           COUNT(mc.review_id)   AS reviews_count,
           ROUND(AVG(mc.rating),2) AS avg_rating
    FROM reviews mc
    JOIN restaurants r ON mc.restaurant_id = r.restaurant_id
    WHERE mc.restaurant_id IS NOT NULL
    GROUP BY mc.restaurant_id, r.name
    HAVING reviews_count >= ?
    ORDER BY ${sortF} ${sortO}
  `, [minR]);

  res.render("reports/restaurant_ratings_form", {
    query: req.body,
    results: rows,
    messages: req.flash("info")
  });
});

export default router;