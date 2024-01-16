import express from 'express';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { renderFile } from 'ejs';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function startServer() {

    const app = express();

    app.set('views', __dirname + '/views');
    app.engine('html', renderFile);
    app.set('view engine', 'ejs');

    app.use('/static', express.static(join(__dirname, 'public')))

    app.get('/', (req, res) => {
        return res.render('home.html');
    });

    app.get('/article/1', (req, res) => {
        return res.render('article_1.html');
    });

    app.get('/article/2', (req, res) => {
        return res.render('article_2.html');
    });

    app.get('/article/3', (req, res) => {
        return res.render('article_3.html');
    });

    app.get('/subscribe', (req, res) => {
        return res.render('subscribe.html');
    });

    app.use(function (_req, res) {
        res.status(404).send("Not found");
    });

    const serverPort = process.env.PORT || 3002
    app.listen(serverPort, () => console.log(`Listening on port: ${serverPort}`));

}

startServer();
