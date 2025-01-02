import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import onlineOrderRoutes from "./routes/online-order.js";
import viewRoutes from "./routes/view.js";
import menuRoutes from "./routes/menu.js";
import Handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    partialsDir: path.join(__dirname, "views", "partials"),
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main",
    helpers: {
      formatCurrency: (value) => {
        if (value) {
          return value.toLocaleString("en-US");
        }
        return "0";
      },
    },
  })
);

Handlebars.registerHelper("eq", function (a, b) {
  return a == b;
});

Handlebars.registerHelper("neq", function (a, b) {
  return a != b;
});

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/select-user");
});

app.get("/select-user", (req, res) => {
  res.render("selectUser", {
    layout: false,
    customCSS: ["selectUser.css", "online_user_home.css"],
  });
});

app.get('/employee', (req, res) => {
  res.render('employeeFeatures', {
    layout: 'employee',
    customCSS: ["online_user_home.css", "employeeFeatures.css"],
  });
});

app.get("/online", async (req, res) => {
  res.render("home", {
    customCSS: ["online_user_home.css"],
  });
});

app.get("/online/booking", (req, res) => {
  res.render("booking", {
    customCSS: ["online_booking.css", "online_user_home.css"], // Include relevant CSS for booking
  });
});

app.post("/booking", async (req, res) => {
  const { name, date, time, details } = req.body;

  try {
    // Save the booking to the database
    await db("bookings").insert({ name, date, time, details });
    res.send("Booking successful!");
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).send("An error occurred while processing your booking.");
  }
});

app.use("/online/view", viewRoutes);
app.use("/online/menu", menuRoutes);
app.use("/online/online-order", onlineOrderRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
