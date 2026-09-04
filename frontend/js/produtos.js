const API = "http://127.0.0.1:3000";

const formulario =
    document.getElementById("form-produto");

const listaProdutos =
    document.getElementById("lista-produtos");

const mensagem =
    document.getElementById("mensagem");

const pesquisa =
    document.getElementById("pesquisa");

const btnSalvar =
    document.getElementById("btn-salvar");

const btnCancelar =
    document.getElementById("btn-cancelar");

const tituloFormulario =
    document.getElementById("titulo-formulario");

let produtoEditando = null;

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
            `${API}/produtos`,
            {
                credentials: "include"
            }
        );

        if (resposta.status === 401) {

            window.location.href =
                "login.html";

            return;
        }

        const produtos =
            await resposta.json();

        mostrarProdutos(produtos);

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao carregar produtos.",
            "erro"
        );
    }
}

function mostrarProdutos(produtos) {

    listaProdutos.innerHTML = "";

    if (produtos.length === 0) {

        listaProdutos.innerHTML = `
            <tr>
                <td colspan="7">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;

        return;
    }

    produtos.forEach(produto => {

        const linha =
            document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.id_produto}</td>
            <td>${produto.nome}</td>
            <td>${produto.descricao}</td>
            <td>R$ ${Number(produto.custo).toFixed(2)}</td>
            <td>${produto.quantidade_estoque}</td>
            <td>${produto.estoque_minimo}</td>

            <td>

                <div class="acoes">

                    <button
                        class="btn-editar"
                        onclick="editarProduto(${produto.id_produto})">
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirProduto(${produto.id_produto})">
                        Excluir
                    </button>

                </div>

            </td>
        `;

        listaProdutos.appendChild(linha);
    });
}

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const nome =
            document.getElementById("nome").value.trim();

        const descricao =
            document.getElementById("descricao").value.trim();

        const custo =
            Number(
                document.getElementById("custo").value
            );

        const quantidadeEstoque =
            Number(
                document.getElementById(
                    "quantidade_estoque"
                ).value
            );

        const estoqueMinimo =
            Number(
                document.getElementById(
                    "estoque_minimo"
                ).value
            );

        if (!nome || !descricao) {

            mostrarMensagem(
                "Preencha todos os campos obrigatórios.",
                "erro"
            );

            return;
        }

        if (
            custo < 0 ||
            quantidadeEstoque < 0 ||
            estoqueMinimo < 0
        ) {

            mostrarMensagem(
                "Os valores não podem ser negativos.",
                "erro"
            );

            return;
        }

        const dados = {
            nome: nome,
            descricao: descricao,
            custo: custo,
            quantidade_estoque: quantidadeEstoque,
            estoque_minimo: estoqueMinimo
        };

        try {

            let resposta;

            if (produtoEditando === null) {

                resposta = await fetch(
                    `${API}/produtos`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify(dados)
                    }
                );

            } else {

                resposta = await fetch(
                    `${API}/produtos/${produtoEditando}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify(dados)
                    }
                );
            }

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

            limparFormulario();

            carregarProdutos();

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                "Erro ao conectar com o servidor.",
                "erro"
            );
        }
    }
);

async function editarProduto(id) {

    try {

        const resposta = await fetch(
            `${API}/produtos/${id}`,
            {
                credentials: "include"
            }
        );

        const produto =
            await resposta.json();

        if (!resposta.ok) {

            mostrarMensagem(
                produto.mensagem,
                "erro"
            );

            return;
        }

        document.getElementById("nome").value =
            produto.nome;

        document.getElementById("descricao").value =
            produto.descricao;

        document.getElementById("custo").value =
            produto.custo;

        document.getElementById(
            "quantidade_estoque"
        ).value =
            produto.quantidade_estoque;

        document.getElementById(
            "estoque_minimo"
        ).value =
            produto.estoque_minimo;

        produtoEditando = id;

        tituloFormulario.textContent =
            "Editar produto";

        btnSalvar.textContent =
            "Salvar alterações";

        btnCancelar.style.display =
            "inline-block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao buscar produto.",
            "erro"
        );
    }
}

async function excluirProduto(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este produto?"
        );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(
            `${API}/produtos/${id}`,
            {
                method: "DELETE",
                credentials: "include"
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

        carregarProdutos();

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao excluir produto.",
            "erro"
        );
    }
}

pesquisa.addEventListener(
    "input",
    async function () {

        const nome =
            pesquisa.value.trim();

        if (nome === "") {

            carregarProdutos();

            return;
        }

        try {

            const resposta = await fetch(
                `${API}/produtos/pesquisa/${encodeURIComponent(nome)}`,
                {
                    credentials: "include"
                }
            );

            const produtos =
                await resposta.json();

            if (!resposta.ok) {

                mostrarMensagem(
                    produtos.mensagem,
                    "erro"
                );

                return;
            }

            mostrarProdutos(produtos);

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                "Erro ao pesquisar produtos.",
                "erro"
            );
        }
    }
);

btnCancelar.addEventListener(
    "click",
    function () {
        limparFormulario();
    }
);

function limparFormulario() {

    formulario.reset();

    produtoEditando = null;

    tituloFormulario.textContent =
        "Cadastrar produto";

    btnSalvar.textContent =
        "Cadastrar";

    btnCancelar.style.display =
        "none";
}

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

    }, 4000);
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

    await carregarProdutos();
}

iniciar();