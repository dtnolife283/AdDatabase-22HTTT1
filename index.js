import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import knex from "knex";
import dotenv from "dotenv";
import { get } from "http";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const db = knex({
  client: "mssql",
  connection: {
    server: process.env.SERVER,
    database: process.env.DATABASE,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    options: {
      port: parseInt(process.env.PORT),
    },
  },
});

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    partialsDir: path.join(__dirname, "views", "partials"),
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("home", {
    customCSS: ["online_user_home.css"],
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
