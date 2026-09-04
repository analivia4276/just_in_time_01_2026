function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.status(401).json({
            mensagem: "Usuário não está logado."
        });
    }

    next();
}

module.exports = verificarLogin;