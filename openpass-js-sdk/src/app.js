import express from "express";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { renderFile } from "ejs";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function startServer() {
    const app = express();

    app.set("views", __dirname + "/views");
    app.engine("html", renderFile);
    app.set("view engine", "ejs");

    app.use("/static", express.static(join(__dirname, "public")));

    app.get("/", (_, res) => {
        return res.render("home.html");
    });

    app.get("/handle-redirect", (_, res) => {
        return res.render("handle-redirect.html");
    });

    app.get("/redirect-manual-button", (_, res) => {
        return res.render("redirect-manual-button.html");
    });

    app.get("/quick-auth-html-popup", (_, res) => {
        return res.render("quick-auth-html-popup.html");
    });

    app.get("/quick-auth-popup", (_, res) => {
        return res.render("quick-auth-popup.html");
    });

    app.get("/quick-auth-popup-session-check", (_, res) => {
        return res.render("quick-auth-popup-session-check.html");
    });

    app.get("/quick-auth-redirect", (_, res) => {
        return res.render("quick-auth-redirect.html");
    });

    app.get("/popup-manual-button", (_, res) => {
        return res.render("popup-manual-button.html");
    });

    app.get("/redirect-generated-button-html-api", (_, res) => {
        return res.render("redirect-generated-button-html-api.html");
    });

    app.get("/popup-generated-button-html-api", (_, res) => {
        return res.render("popup-generated-button-html-api.html");
    });

    app.get("/generated-buttons-js-api", (_, res) => {
        return res.render("generated-buttons-js-api.html");
    });

    app.get("/redirect-inline-sign-in-form", (_, res) => {
        return res.render("redirect-inline-sign-in-form.html");
    });

    app.get("/popup-inline-sign-in-form", (_, res) => {
        return res.render("popup-inline-sign-in-form.html");
    });

    app.use(function (_, res) {
        res.status(404).send("Not found");
    });

    const serverPort = process.env.PORT || 3011;
    app.listen(serverPort, () => {
        console.log(`Listening on port: ${serverPort}`);
        console.log(`Localhost address: http://localhost:${serverPort}`);
    });
}

startServer();
