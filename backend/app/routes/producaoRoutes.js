const express = require("express");

const verificarLogin = require("../middlewares/authMiddleware");

const {
    listarProdutosParaProducao,
    registrarProducao
} = require("../controllers/producaoController");

const router = express.Router();

router.get("/produtos", verificarLogin, listarProdutosParaProducao);

router.post("/", verificarLogin, registrarProducao);

module.exports = router;