const API = "http://127.0.0.1:3000";

const nomeUsuario =
    document.getElementById("nome-usuario");

const btnSair =
    document.getElementById("btn-sair");

async function carregarUsuario() {

    try {

        const resposta = await fetch(
            `${API}/usuario-logado`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const dados =
            await resposta.json();

        console.log(
            "Resposta do usuário:",
            dados
        );

        if (!resposta.ok) {

            nomeUsuario.textContent =
                "Usuário não identificado";

            return;
        }

        nomeUsuario.textContent =
            dados.usuario.nome;

    } catch (erro) {

        console.error(
            "Erro ao carregar usuário:",
            erro
        );

        nomeUsuario.textContent =
            "Usuário não identificado";
    }
}

async function sair() {

    try {

        await fetch(
            `${API}/logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        window.location.href =
            "login.html";

    } catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );

        window.location.href =
            "login.html";
    }
}

btnSair.addEventListener(
    "click",
    sair
);

carregarUsuario();