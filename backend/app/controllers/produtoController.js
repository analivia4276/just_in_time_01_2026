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

async function listarProdutos(req, res) {
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

async function buscarProduto(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: "ID do produto inválido."
            });
        }

        const produto = await prisma.produto.findUnique({
            where: {
                id_produto: id
            }
        });

        if (!produto) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        res.json(produto);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar produto."
        });
    }
}

async function cadastrarProduto(req, res) {
    try {
        const {
            nome,
            descricao,
            custo,
            quantidade_estoque,
            estoque_minimo
        } = req.body;

        if (
            !nome ||
            !descricao ||
            custo === undefined ||
            quantidade_estoque === undefined ||
            estoque_minimo === undefined
        ) {
            return res.status(400).json({
                mensagem: "Todos os campos são obrigatórios."
            });
        }

        if (Number(custo) < 0) {
            return res.status(400).json({
                mensagem: "O custo não pode ser negativo."
            });
        }

        if (Number(quantidade_estoque) < 0) {
            return res.status(400).json({
                mensagem: "A quantidade em estoque não pode ser negativa."
            });
        }

        if (Number(estoque_minimo) < 0) {
            return res.status(400).json({
                mensagem: "O estoque mínimo não pode ser negativo."
            });
        }

        const produto = await prisma.produto.create({
            data: {
                nome: String(nome),
                descricao: String(descricao),
                custo: Number(custo),
                quantidade_estoque: Number(quantidade_estoque),
                estoque_minimo: Number(estoque_minimo)
            }
        });

        res.status(201).json({
            mensagem: "Produto cadastrado com sucesso.",
            produto: produto
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar produto."
        });
    }
}

async function editarProduto(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: "ID do produto inválido."
            });
        }

        const {
            nome,
            descricao,
            custo,
            quantidade_estoque,
            estoque_minimo
        } = req.body;

        if (
            !nome ||
            !descricao ||
            custo === undefined ||
            quantidade_estoque === undefined ||
            estoque_minimo === undefined
        ) {
            return res.status(400).json({
                mensagem: "Todos os campos são obrigatórios."
            });
        }

        if (Number(custo) < 0) {
            return res.status(400).json({
                mensagem: "O custo não pode ser negativo."
            });
        }

        if (Number(quantidade_estoque) < 0) {
            return res.status(400).json({
                mensagem: "A quantidade em estoque não pode ser negativa."
            });
        }

        if (Number(estoque_minimo) < 0) {
            return res.status(400).json({
                mensagem: "O estoque mínimo não pode ser negativo."
            });
        }

        const produtoExistente = await prisma.produto.findUnique({
            where: {
                id_produto: id
            }
        });

        if (!produtoExistente) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        const produto = await prisma.produto.update({
            where: {
                id_produto: id
            },
            data: {
                nome: String(nome),
                descricao: String(descricao),
                custo: Number(custo),
                quantidade_estoque: Number(quantidade_estoque),
                estoque_minimo: Number(estoque_minimo)
            }
        });

        res.json({
            mensagem: "Produto atualizado com sucesso.",
            produto: produto
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar produto."
        });
    }
}

async function excluirProduto(req, res) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                mensagem: "ID do produto inválido."
            });
        }

        const produtoExistente = await prisma.produto.findUnique({
            where: {
                id_produto: id
            }
        });

        if (!produtoExistente) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        const producoes = await prisma.producao.count({
            where: {
                id_produto: id
            }
        });

        if (producoes > 0) {
            return res.status(400).json({
                mensagem: "Não é possível excluir um produto que possui registros de produção."
            });
        }

        await prisma.produto.delete({
            where: {
                id_produto: id
            }
        });

        res.json({
            mensagem: "Produto excluído com sucesso."
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao excluir produto."
        });
    }
}

async function pesquisarProdutos(req, res) {
    try {
        const nome = req.params.nome;

        const produtos = await prisma.produto.findMany({
            where: {
                nome: {
                    contains: nome
                }
            },
            orderBy: {
                nome: "asc"
            }
        });

        res.json(produtos);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao pesquisar produtos."
        });
    }
}

module.exports = {
    listarProdutos,
    buscarProduto,
    cadastrarProduto,
    editarProduto,
    excluirProduto,
    pesquisarProdutos
};