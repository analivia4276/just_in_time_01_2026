const express = require("express");

const verificarLogin = require("../middlewares/authMiddleware");

const {
    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    editarProduto,
    excluirProduto,
    pesquisarProdutos
} = require("../controllers/produtoController");

const router = express.Router();

router.get("/", verificarLogin, listarProdutos);

router.get("/pesquisa/:nome", verificarLogin, pesquisarProdutos);

router.get("/:id", verificarLogin, buscarProduto);

router.post("/", verificarLogin, cadastrarProduto);

router.put("/:id", verificarLogin, editarProduto);

router.delete("/:id", verificarLogin, excluirProduto);

module.exports = router;