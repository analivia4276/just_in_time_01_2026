const express = require("express");

const {
    login,
    usuarioLogado,
    logout
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);

router.get("/usuario-logado", usuarioLogado);

router.post("/logout", logout);

module.exports = router;