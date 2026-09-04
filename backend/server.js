const express = require("express");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./app/routes/authRoutes");
const produtoRoutes = require("./app/routes/produtoRoutes");
const producaoRoutes = require("./app/routes/producaoRoutes");

require("dotenv").config();

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(express.json());

app.use(session({
    name: "just-in-time-session",
    secret: "just-in-time-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));

app.get("/", (req, res) => {
    res.json({
        mensagem: "API Just in Time funcionando!"
    });
});

app.use("/", authRoutes);
app.use("/produtos", produtoRoutes);
app.use("/producao", producaoRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
});