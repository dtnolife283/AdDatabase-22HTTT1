import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import onlineOrderRoutes from "./routes/online-order.js";
import inRestaurantRoutes from "./routes/in-restaurant.js";
import viewRoutes from "./routes/view.js";
import menuRoutes from "./routes/menu.js";
import manageCusRoutes from "./routes/manage_cus.js";
import viewEmployeeRoutes from "./routes/view-employee.js";
import Handlebars from "handlebars";
import moveEmployee from "./routes/employee.js";
import { db } from "./utils/db.js";
import orderRoutes from "./routes/order.js";

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
      formatDate: (date) => {
        if (date) {
          return new Date(date).toLocaleDateString("en-US");
        }
        return "";
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

app.get("/employee", (req, res) => {
  res.render("employeeFeatures", {
    layout: "employee",
    customCSS: ["online_user_home.css", "employeeFeatures.css"],
  });
});

app.get("/online", async (req, res) => {
  res.render("customer_home", {
    customCSS: ["online_user_home.css"],
  });
});

app.get("/online/booking", async (req, res) => {
  try {
    const topBranches = await db("BRANCH").select("BranchName", "ID_Branch");
    return res.render("booking", {
      customCSS: ["online_booking.css", "online_user_home.css"],
      topBranches: topBranches,
    });
  } catch (error) {
    console.log(error);
  }
});

// app.post("/booking", async (req, res) => {
//   const {date, time, details, numberpeople } = req.body;

//   try {
//     // Get the current max ID_Order
//     const maxIdOrder = await db("ORDER").max("ID_Order as maxId");
//     const nextIdOrder = maxIdOrder[0].maxId ? maxIdOrder[0].maxId + 1 : 1;
//     // Save the booking to the database
//     await db("ORDER").insert({ID_Order: nextIdOrder, OrderDate: date});
//     await db("RESERVATION_ORDER").insert({ID_Reservation: nextIdOrder, ID_Table: null, ArrivalTime: time, NumberOfPeople: numberpeople, Notes: details})
//     res.send("Booking successful!");
//   } catch (error) {
//     console.error("Error saving booking:", error);
//     res.status(500).send("An error occurred while processing your booking.");
//   }
// });

app.use("/employee/manage_cus", manageCusRoutes);
app.use("/online/view", viewRoutes);
app.use("/online/menu", menuRoutes);
app.use("/online/online-order", onlineOrderRoutes);
app.use("/employee/view-employee", viewEmployeeRoutes);
app.use("/in-restaurant", inRestaurantRoutes);

app.use("/employee/transfer", moveEmployee);
app.use("/employee/orders", orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
