// =====================================================
// CONFIGURAÇÃO
// =====================================================

// IMPORTANTE:
// Coloca aqui a porta que aparece no Visual Studio.
// Exemplo:
// http://localhost:5234
const API = "http://localhost:5000";


// =====================================================
// MOSTRAR LOGIN
// =====================================================

function mostrarLogin() {
    document.getElementById("formLogin").style.display = "block";
    document.getElementById("formRegisto").style.display = "none";
    document.getElementById("paginaPrincipal").style.display = "none";

    document.getElementById("mensagemLogin").style.display = "none";
}


// =====================================================
// MOSTRAR REGISTO
// =====================================================

function mostrarRegisto() {
    document.getElementById("formLogin").style.display = "none";
    document.getElementById("formRegisto").style.display = "block";
    document.getElementById("paginaPrincipal").style.display = "none";

    document.getElementById("mensagemRegisto").style.display = "none";
}


// =====================================================
// CRIAR NOVO UTILIZADOR
// =====================================================

async function criarUtilizador() {

    const username =
        document.getElementById("novoUsername").value.trim();

    const password =
        document.getElementById("novaPassword").value;

    const confirmarPassword =
        document.getElementById("confirmarPassword").value;

    const mensagem =
        document.getElementById("mensagemRegisto");


    mensagem.style.display = "block";


    // Verificar campos
    if (username === "" ||
        password === "" ||
        confirmarPassword === "") {

        mensagem.className = "mensagem erro";
        mensagem.textContent =
            "Preencha todos os campos.";

        return;
    }


    // Verificar tamanho da password
    if (password.length < 6) {

        mensagem.className = "mensagem erro";
        mensagem.textContent =
            "A password deve ter pelo menos 6 caracteres.";

        return;
    }


    // Confirmar password
    if (password !== confirmarPassword) {

        mensagem.className = "mensagem erro";
        mensagem.textContent =
            "As passwords não coincidem.";

        return;
    }


    try {

        const resposta = await fetch(
            API + "/api/auth/registar",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );


        const dados = await resposta.json();


        // Erro
        if (!resposta.ok) {

            mensagem.className = "mensagem erro";

            mensagem.textContent =
                dados.detail ||
                dados.title ||
                dados.mensagem ||
                "Erro ao criar utilizador.";

            return;
        }


        // Sucesso
        mensagem.className = "mensagem sucesso";

        mensagem.textContent =
            "Utilizador criado com sucesso!";


        // Limpar campos
        document.getElementById("novoUsername").value = "";
        document.getElementById("novaPassword").value = "";
        document.getElementById("confirmarPassword").value = "";


        // Voltar ao login
        setTimeout(function () {

            mostrarLogin();

        }, 1500);

    }
    catch (erro) {

        console.error(erro);

        mensagem.className = "mensagem erro";

        mensagem.textContent =
            "Não foi possível contactar o servidor.";

    }
}


// =====================================================
// LOGIN
// =====================================================

async function fazerLogin() {

    const username =
        document.getElementById("loginUsername").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const mensagem =
        document.getElementById("mensagemLogin");


    mensagem.style.display = "block";


    // Verificar campos
    if (username === "" || password === "") {

        mensagem.className = "mensagem erro";

        mensagem.textContent =
            "Introduza o utilizador e a password.";

        return;
    }


    try {

        const resposta = await fetch(
            API + "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );


        const dados = await resposta.json();


        // Login errado
        if (!resposta.ok) {

            mensagem.className = "mensagem erro";

            mensagem.textContent =
                "Utilizador ou password incorretos.";

            return;
        }


        // Esconder login
        document.getElementById("formLogin").style.display = "none";

        // Esconder registo
        document.getElementById("formRegisto").style.display = "none";

        // Mostrar página principal
        document.getElementById("paginaPrincipal").style.display = "block";


        // Mostrar nome do utilizador
        document.getElementById("utilizadorAtual").textContent =
            dados.username || username;


        // Carregar clientes
        carregarClientes();

    }
    catch (erro) {

        console.error(erro);

        mensagem.className = "mensagem erro";

        mensagem.textContent =
            "Não foi possível contactar o servidor.";

    }
}


// =====================================================
// LOGOUT
// =====================================================

async function fazerLogout() {

    try {

        await fetch(
            API + "/api/auth/logout",
            {
                method: "POST",

                credentials: "include"
            }
        );

    }
    catch (erro) {

        console.error(erro);

    }


    // Voltar ao login
    mostrarLogin();


    // Limpar campos
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";

}


// =====================================================
// VERIFICAR SE EXISTE LOGIN
// =====================================================

async function verificarLogin() {

    try {

        const resposta = await fetch(
            API + "/api/auth/me",
            {
                method: "GET",

                credentials: "include"
            }
        );


        if (!resposta.ok) {

            mostrarLogin();

            return;
        }


        const dados = await resposta.json();


        document.getElementById("formLogin").style.display = "none";

        document.getElementById("formRegisto").style.display = "none";

        document.getElementById("paginaPrincipal").style.display = "block";


        document.getElementById("utilizadorAtual").textContent =
            dados.username;


        carregarClientes();

    }
    catch (erro) {

        console.error(
            "Erro ao verificar login:",
            erro
        );

        mostrarLogin();
    }
}


// =====================================================
// CARREGAR CLIENTES
// =====================================================

async function carregarClientes() {

    try {

        const resposta = await fetch(
            API + "/api/clientes",
            {
                method: "GET",

                credentials: "include"
            }
        );


        // Não autenticado
        if (resposta.status === 401) {

            mostrarLogin();

            return;
        }


        if (!resposta.ok) {

            console.error(
                "Erro ao carregar clientes."
            );

            return;
        }


        const clientes =
            await resposta.json();


        const tabela =
            document.getElementById("listaClientes");


        tabela.innerHTML = "";


        clientes.forEach(function (cliente) {

            const linha =
                document.createElement("tr");


            const id =
                cliente.id ?? cliente.ID;

            const nome =
                cliente.nome ?? cliente.Nome;

            const nif =
                cliente.nif ?? cliente.Nif;


            linha.innerHTML = `
                <td>${id}</td>
                <td>${nome}</td>
                <td>${nif}</td>
            `;


            tabela.appendChild(linha);

        });

    }
    catch (erro) {

        console.error(
            "Erro ao carregar clientes:",
            erro
        );

    }
}


// =====================================================
// CALCULAR IVA
// =====================================================

async function calcularIVA() {

    const campo =
        document.getElementById("valorBase");


    const valor =
        campo.value;


    const resultado =
        document.getElementById("resultadoIVA");


    if (valor === "" ||
        Number(valor) < 0) {

        resultado.textContent =
            "Introduza um valor válido.";

        return;
    }


    try {

        const resposta = await fetch(
            API +
            "/api/calculo-iva?valorBase=" +
            encodeURIComponent(valor)
        );


        if (!resposta.ok) {

            resultado.textContent =
                "Erro ao calcular IVA.";

            return;
        }


        const dados =
            await resposta.json();


        const base =
            dados.base ?? dados.Base;

        const iva =
            dados.iva ?? dados.IVA;

        const total =
            dados.total ?? dados.Total;


        resultado.innerHTML = `
            <p>
                <strong>Base:</strong>
                ${base.toFixed(2)} €
            </p>

            <p>
                <strong>IVA (23%):</strong>
                ${iva.toFixed(2)} €
            </p>

            <p>
                <strong>Total:</strong>
                ${total.toFixed(2)} €
            </p>
        `;

    }
    catch (erro) {

        console.error(erro);

        resultado.textContent =
            "Não foi possível calcular o IVA.";

    }
}


// =====================================================
// INICIAR A APLICAÇÃO
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        verificarLogin();

    }
);
