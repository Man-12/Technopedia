const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const bp = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

// app.use(bp.json());
// app.use(bp.urlencoded({ extended: true }));
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.use(cookieParser("TechnopediaSecure"));
app.use(
  session({
    secret: "TechnopediaSecretSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

const routes = require("./server/routes/techRoutes.js");
app.use("/", routes);
app.listen(port, console.log(`Listening on port ${port}`));
