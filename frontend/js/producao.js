const API = "http://127.0.0.1:3000";

const formulario =
    document.getElementById("form-producao");

const selectProduto =
    document.getElementById("produto");

const mensagem =
    document.getElementById("mensagem");

const listaProdutos =
    document.getElementById("lista-produtos");

const dataMovimentacao =
    document.getElementById(
        "data_movimentacao"
    );

let produtos = [];

function definirDataAtual() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    dataMovimentacao.value =
        `${ano}-${mes}-${dia}`;
}

async function verificarLogin() {

    try {

        const resposta = await fetch(
            `${API}/usuario-logado`,
            {
                credentials: "include"
            }
        );

        if (!resposta.ok) {

            window.location.href =
                "login.html";

            return false;
        }

        return true;

    } catch (erro) {

        console.error(erro);

        window.location.href =
            "login.html";

        return false;
    }
}

async function carregarProdutos() {

    try {

        const resposta = await fetch(
            `${API}/producao/produtos`,
            {
                credentials: "include"
            }
        );

        if (resposta.status === 401) {

            window.location.href =
                "login.html";

            return;
        }

        produtos =
            await resposta.json();

        produtos.sort(
            (a, b) =>
                a.nome.localeCompare(
                    b.nome,
                    "pt-BR"
                )
        );

        preencherSelect();

        mostrarProdutos();

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar produtos.",
            "erro"
        );
    }
}

function preencherSelect() {

    selectProduto.innerHTML = `
        <option value="">
            Selecione um produto
        </option>
    `;

    produtos.forEach(produto => {

        const option =
            document.createElement("option");

        option.value =
            produto.id_produto;

        option.textContent =
            `${produto.nome} - Estoque: ${produto.quantidade_estoque}`;

        selectProduto.appendChild(
            option
        );
    });
}

function mostrarProdutos() {

    listaProdutos.innerHTML = "";

    if (produtos.length === 0) {

        listaProdutos.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum produto cadastrado.
                </td>
            </tr>
        `;

        return;
    }

    produtos.forEach(produto => {

        const linha =
            document.createElement("tr");

        const estoqueBaixo =
            produto.quantidade_estoque <
            produto.estoque_minimo;

        linha.innerHTML = `
            <td>
                ${produto.nome}
            </td>

            <td>
                ${produto.quantidade_estoque}
            </td>

            <td>
                ${produto.estoque_minimo}
            </td>

            <td>
                ${
                    estoqueBaixo
                        ? "ESTOQUE BAIXO"
                        : "Estoque normal"
                }
            </td>
        `;

        listaProdutos.appendChild(
            linha
        );
    });
}

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const idProduto =
            Number(
                selectProduto.value
            );

        const tipo =
            document.getElementById(
                "tipo"
            ).value;

        const quantidade =
            Number(
                document.getElementById(
                    "quantidade"
                ).value
            );

        const data =
            dataMovimentacao.value;

        if (
            !idProduto ||
            !tipo ||
            !quantidade ||
            !data
        ) {

            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );

            return;
        }

        if (quantidade <= 0) {

            mostrarMensagem(
                "A quantidade deve ser maior que zero.",
                "erro"
            );

            return;
        }

        try {

            const resposta =
                await fetch(
                    `${API}/producao`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({
                            id_produto:
                                idProduto,

                            tipo:
                                tipo,

                            quantidade:
                                quantidade,

                            data_movimentacao:
                                data
                        })
                    }
                );

            const resultado =
                await resposta.json();

            if (!resposta.ok) {

                mostrarMensagem(
                    resultado.mensagem,
                    "erro"
                );

                return;
            }

            mostrarMensagem(
                resultado.mensagem,
                "sucesso"
            );

            if (
                resultado.alerta_estoque_minimo
            ) {

                mostrarMensagem(
                    `Atenção: o estoque de ${resultado.produto} está abaixo do estoque mínimo.`,
                    "erro"
                );
            }

            formulario.reset();

            definirDataAtual();

            await carregarProdutos();

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                "Erro ao registrar movimentação.",
                "erro"
            );
        }
    }
);

function mostrarMensagem(
    texto,
    tipo
) {

    mensagem.textContent =
        texto;

    mensagem.className =
        `mensagem ${tipo}`;

    setTimeout(() => {

        mensagem.textContent = "";

    }, 5000);
}

document.getElementById(
    "btn-sair"
).addEventListener(
    "click",
    async function () {

        try {

            await fetch(
                `${API}/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (erro) {

            console.error(erro);
        }

        window.location.href =
            "login.html";
    }
);

async function iniciar() {

    const logado =
        await verificarLogin();

    if (!logado) {
        return;
    }

    definirDataAtual();

    await carregarProdutos();
}

iniciar();