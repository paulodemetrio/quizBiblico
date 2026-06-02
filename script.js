const perguntas = [
    {
        pergunta: "Quantos pares de cada animal Moisés colocou na arca?",
        respostas: ["1", "2", "7", "Nenhuma das anteriores"],
        correta: 3
    },
    {
        pergunta: "Com quantos anos Jesus inicia o ministério?",
        respostas: ["10", "20", "30", "33"],
        correta: 2
    },
    {
        pergunta: "Qual dessas mulheres se tornou bisavó do rei Davi?",
        respostas: ["Ester", "Débora", "Rute", "Marta"],
        correta: 2
    }
];

let perguntaAtual = 0;
let pontos = 0;
let sequencia = 0;
let maiorSequencia = 0;
let respostaSelecionada = null;
let tempo = 10;
let intervalo;
let nomeJogador = "";

const inicio = document.getElementById("inicio");
const quiz = document.getElementById("quiz");
const resultado = document.getElementById("resultado");

const perguntaEl = document.getElementById("pergunta");
const respostasEl = document.getElementById("respostas");

document
    .getElementById("btnComecar")
    .addEventListener("click", iniciarQuiz);

function iniciarQuiz() {
    nomeJogador = document.getElementById("nomeJogador").value;

    if (nomeJogador.trim() === "") {
        alert("Digite seu nome.");
        return;
    }
    perguntas.sort(() => Math.random() - 0.5);
    inicio.classList.add("oculto");
    quiz.classList.remove("oculto");
    carregarPergunta();
}

function carregarPergunta() {
    respostaSelecionada = null;

    const atual = perguntas[perguntaAtual];
    const respostasMisturadas = [...atual.respostas]
        .map((texto, indice) => ({ texto, original: indice }))
        .sort(() => Math.random() - 0.5);

    perguntaEl.textContent = atual.pergunta;
    respostasEl.innerHTML = "";

    respostasMisturadas.forEach(item => {
        const botao = document.createElement("button");

        botao.textContent = item.texto;
        botao.classList.add("resposta");

        botao.addEventListener("click", () => {
            document.querySelectorAll(".resposta").forEach(btn => btn.classList.remove("selecionada"));
            botao.classList.add("selecionada");
            respostaSelecionada = item.original;
            responder(item.original);
        });

        respostasEl.appendChild(botao);
    });

    document.getElementById("contadorPergunta").textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;
    const porcentagem = (perguntaAtual / perguntas.length) * 100;
    document.getElementById("progresso").style.width = `${porcentagem}%`;
    iniciarTimer();

    const seqEl = document.getElementById("sequencia");
    let icone = "🔥";
    if (sequencia >= 10) {
        icone = "🔥🔥🔥";
    } else if (sequencia >= 5) {
        icone = "🔥🔥";
    }

    seqEl.textContent =
        `${icone} ${sequencia}`;
}

function responder(indiceSelecionado) {
    clearInterval(intervalo);

    const atual = perguntas[perguntaAtual];
    const botoes = document.querySelectorAll(".resposta");

    botoes.forEach(btn => { btn.disabled = true; });

    const respostaCorreta = atual.respostas[atual.correta];

    botoes.forEach(btn => {
        if (btn.textContent === respostaCorreta) { btn.classList.add("correta"); }
    });

    if (indiceSelecionado !== null) {
        if (indiceSelecionado === atual.correta) {
            pontos++;
            sequencia++;
            if (sequencia > maiorSequencia) { maiorSequencia = sequencia; }
        } else {
            sequencia = 0;
            const respostaEscolhida = atual.respostas[indiceSelecionado];
            botoes.forEach(btn => {
                if (btn.textContent === respostaEscolhida) {
                    btn.classList.remove("selecionada");
                    btn.classList.add("errada");
                }
            });
        }
    } else {
        sequencia = 0;
    }
    setTimeout(() => { avancarPergunta(); }, 1500);
}

function iniciarTimer() {
    clearInterval(intervalo);

    tempo = 10;

    const timerEl = document.getElementById("timer");

    timerEl.textContent = tempo;
    timerEl.style.backgroundColor = "#34495e";
    timerEl.style.color = "white";

    intervalo = setInterval(() => {
        tempo--;
        timerEl.textContent = tempo;
        if (tempo <= 5) { timerEl.style.backgroundColor = "#f39c12"; }

        if (tempo <= 3) { timerEl.style.backgroundColor = "#c0392b"; }

        if (tempo <= 0) {
            clearInterval(intervalo);
            responder(null);
        }
    }, 1000);
}

function avancarPergunta() {
    perguntaAtual++;
    if (perguntaAtual < perguntas.length) { carregarPergunta(); } else { finalizarQuiz(); }
}

function finalizarQuiz() {
    quiz.classList.add("oculto");
    resultado.classList.remove("oculto");

    const porcentagem = Math.round((pontos / perguntas.length) * 100);

    document.getElementById("pontuacao").innerHTML =
        `
        <strong>${nomeJogador}</strong><br><br>
        Acertos: ${pontos}/${perguntas.length}<br>
        Maior sequência: 🔥 ${maiorSequencia}<br>
        Aproveitamento: ${porcentagem}%
        `;

    const barra = document.getElementById("progressoFinal");

    if (porcentagem >= 80) {
        barra.style.background = "#27ae60";
    } else if (porcentagem >= 50) {
        barra.style.background = "#f39c12";
    } else {
        barra.style.background = "#c0392b";
    }

    setTimeout(() => { barra.style.width = `${porcentagem}%`; }, 200);
}

const temaBtn = document.getElementById("temaBtn");

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
    temaBtn.textContent = "☀️";
}

temaBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        temaBtn.textContent = "☀️";
        localStorage.setItem(
            "tema",
            "dark"
        );
    } else {
        temaBtn.textContent = "🌙";
        localStorage.setItem(
            "tema",
            "light"
        );
    }
});