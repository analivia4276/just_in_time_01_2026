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

async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                mensagem: "Email e senha são obrigatórios."
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            }
        });

        if (!usuario) {
            return res.status(401).json({
                mensagem: "Email não cadastrado."
            });
        }

        if (usuario.senha !== senha) {
            return res.status(401).json({
                mensagem: "Senha incorreta."
            });
        }

        req.session.usuario = {
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email
        };

        req.session.save((erro) => {
            if (erro) {
                console.error("Erro ao salvar sessão:", erro);

                return res.status(500).json({
                    mensagem: "Erro ao criar sessão."
                });
            }

            console.log("Sessão criada:", req.session.usuario);

            res.json({
                mensagem: "Login realizado com sucesso.",
                usuario: req.session.usuario
            });
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro interno do servidor."
        });
    }
}

function usuarioLogado(req, res) {
    console.log("Sessão recebida:", req.session.usuario);

    if (!req.session.usuario) {
        return res.status(401).json({
            mensagem: "Usuário não está logado."
        });
    }

    res.json({
        usuario: req.session.usuario
    });
}

function logout(req, res) {
    req.session.destroy((erro) => {
        if (erro) {
            console.error(erro);

            return res.status(500).json({
                mensagem: "Erro ao sair da conta."
            });
        }

        res.clearCookie("just-in-time-session");

        res.json({
            mensagem: "Logout realizado com sucesso."
        });
    });
}

module.exports = {
    login,
    usuarioLogado,
    logout
};