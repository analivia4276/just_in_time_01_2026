const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("../../src/generated/prisma/client");

const adapter = new PrismaMariaDb({
    host: "localhost",
    user: "root",
    password: "",
    database: "preparacao_db",
    connectionLimit: 5
});

const prisma = new PrismaClient({
    adapter
});

async function listarProdutosParaProducao(req, res) {
    try {
        const produtos = await prisma.produto.findMany({
            orderBy: {
                nome: "asc"
            }
        });

        res.json(produtos);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar produtos."
        });
    }
}

async function registrarProducao(req, res) {
    try {
        const {
            id_produto,
            tipo,
            quantidade,
            data_movimentacao
        } = req.body;

        if (
            id_produto === undefined ||
            !tipo ||
            quantidade === undefined ||
            !data_movimentacao
        ) {
            return res.status(400).json({
                mensagem: "Todos os campos são obrigatórios."
            });
        }

        if (tipo !== "fabricado" && tipo !== "pedido") {
            return res.status(400).json({
                mensagem: "O tipo deve ser fabricado ou pedido."
            });
        }

        if (Number(quantidade) <= 0) {
            return res.status(400).json({
                mensagem: "A quantidade deve ser maior que zero."
            });
        }

        const produto = await prisma.produto.findUnique({
            where: {
                id_produto: Number(id_produto)
            }
        });

        if (!produto) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        let novoEstoque;

        if (tipo === "fabricado") {
            novoEstoque =
                produto.quantidade_estoque + Number(quantidade);
        } else {
            if (Number(quantidade) > produto.quantidade_estoque) {
                return res.status(400).json({
                    mensagem: "Quantidade solicitada maior que o estoque disponível."
                });
            }

            novoEstoque =
                produto.quantidade_estoque - Number(quantidade);
        }

        const resultado = await prisma.$transaction([
            prisma.produto.update({
                where: {
                    id_produto: Number(id_produto)
                },
                data: {
                    quantidade_estoque: novoEstoque
                }
            }),

            prisma.producao.create({
                data: {
                    id_produto: Number(id_produto),
                    id_usuario: req.session.usuario.id_usuario,
                    tipo: tipo,
                    quantidade: Number(quantidade),
                    data_movimentacao: new Date(data_movimentacao)
                }
            })
        ]);

        const alerta =
            novoEstoque < produto.estoque_minimo;

        res.status(201).json({
            mensagem: "Movimentação registrada com sucesso.",
            estoque_atual: novoEstoque,
            alerta_estoque_minimo: alerta,
            produto: produto.nome
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao registrar produção."
        });
    }
}

module.exports = {
    listarProdutosParaProducao,
    registrarProducao
};