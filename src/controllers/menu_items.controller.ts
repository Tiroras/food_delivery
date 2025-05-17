import { Router } from "express";
import pool from "../bd";
import { QueryResult } from "mysql2";

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
    tableName: "menu_items"
  });
});

router.get("/menu_items/add", async (req, res) => {
  const [restaurants] = await pool.query("SELECT * FROM restaurants");
  res.render("menu_items/form", {
    item: {},
    restaurants,
    action: "/menu_items/add"
  });
});

router.post("/menu_items/add", async (req, res) => {
  const { restaurant_id, name, price, available } = req.body;
  await pool.query(
    "INSERT INTO menu_items (restaurant_id, name, price, available) VALUES (?, ?, ?, ?)",
    [restaurant_id, name, price, available ? 1 : 0]
  );
  req.flash("info", "Блюдо добавлено");
  res.redirect("/menu_items");
});

router.get("/menu_items/edit/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM menu_items WHERE item_id = ?", [req.params.id]);
  const data = rows as QueryResult[]
  if (!data.length) return res.redirect("/menu_items");
  const [restaurants] = await pool.query("SELECT * FROM restaurants");
  res.render("menu_items/form", {
    item: data[0],
    restaurants,
    action: "/menu_items/edit/" + req.params.id
  });
});

router.post("/menu_items/edit/:id", async (req, res) => {
  const { restaurant_id, name, price, available } = req.body;
  await pool.query(
    `UPDATE menu_items SET restaurant_id = ?, name = ?, price = ?, available = ? WHERE item_id = ?`,
    [restaurant_id, name, price, available ? 1 : 0, req.params.id]
  );
  req.flash("info", "Блюдо обновлено");
  res.redirect("/menu_items");
});

router.post("/menu_items/delete/:id", async (req, res) => {
  await pool.query("DELETE FROM menu_items WHERE item_id = ?", [req.params.id]);
  req.flash("info", "Блюдо удалено");
  res.redirect("/menu_items");
});

export default router;