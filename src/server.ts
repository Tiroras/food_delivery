import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser"
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import customersRouter from "./controllers/customers.controller";
import ordersRouter from "./controllers/orders.controller";
import restaurantsRouter from "./controllers/restaurants.controller";
import couriersRouter from "./controllers/couriers.controller";
import menuItemsRouter from "./controllers/menu_items.controller";
import reviewsRouter from "./controllers/reviews.controller";
import menuCategoriesRouter from "./controllers/menu_categories.controller";
import orderItemsRouter from "./controllers/order_items.controller";
import menuItemCategoriesRouter from "./controllers/menu_item_categories.controller"
import ejsLocals from "ejs-locals";

const app = express();
const PORT = 3000;
app.engine("ejs", ejsLocals);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  secret: process.env.SECRET || "",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/", customersRouter);
app.use("/", restaurantsRouter);
app.use("/", ordersRouter);
app.use("/", couriersRouter);
app.use("/", menuItemsRouter);
app.use("/", reviewsRouter);
app.use("/", menuCategoriesRouter);
app.use("/", orderItemsRouter);
app.use("/", menuItemCategoriesRouter)
app.get('/', (req, res) => res.redirect('/customers'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


export default app;