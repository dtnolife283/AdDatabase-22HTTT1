import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import knex from 'knex';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const db = knex({
    client: 'mssql',
    connection: {
        server: 'LAPTOP-SSV985PL', 
        database: 'DOANCSDLNC',     
        user: 'sa',                 
        password: 'Mh271004!',      
        options: {
            port: 1433
        }
    }
});

app.engine('.hbs', engine({
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views', 'partials'),
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main',
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));


