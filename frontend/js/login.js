const API = "http://127.0.0.1:3000";

document.addEventListener("DOMContentLoaded", function () {

    const formulario =
        document.getElementById("form-login");

    const mensagem =
        document.getElementById("mensagem");

    formulario.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            mensagem.textContent = "Entrando...";
            mensagem.className = "mensagem";

            const email =
                document.getElementById("email").value.trim();

            const senha =
                document.getElementById("senha").value;

            try {

                const resposta = await fetch(
                    `${API}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            email: email,
                            senha: senha
                        })
                    }
                );

                const dados =
                    await resposta.json();

                console.log("Resposta do login:", dados);

                if (!resposta.ok) {

                    mensagem.textContent =
                        dados.mensagem;

                    mensagem.className =
                        "mensagem erro";

                    return;
                }

                mensagem.textContent =
                    "Login realizado com sucesso!";

                mensagem.className =
                    "mensagem sucesso";

                setTimeout(function () {

                    window.location.href =
                        "principal.html";

                }, 500);

            } catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );

                mensagem.textContent =
                    "Não foi possível conectar com o servidor.";

                mensagem.className =
                    "mensagem erro";
            }
        }
    );
});