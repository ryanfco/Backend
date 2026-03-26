const perguntas = [
    {
        pergunta: "Qual tag HTML é usada para criar um link?",
        respostas: [
            { texto: "<a>", correta: true },
            { texto: "<link>", correta: false },
            { texto: "<href>", correta: false },
            { texto: "<url>", correta: false }
        ]
    },
    {
        pergunta: "Qual propriedade CSS é usada para mudar a cor do texto?",
        respostas: [
            { texto: "text-color", correta: false },
            { texto: "color", correta: true },
            { texto: "font-color", correta: false },
            { texto: "text-style", correta: false }
        ]
    }
    // Adicione mais perguntas aqui
];

let indicePerguntaAtual = 0;
let pontuacao = 0;
let tempoRestante = 30;
let idTemporizador = null;

// Elementos DOM
const telaInicial = document.getElementById('tela-inicial');
const telaPergunta = document.getElementById('tela-pergunta');
const telaResultado = document.getElementById('tela-resultado');
const elementoPergunta = document.getElementById('pergunta');
const containerRespostas = document.getElementById('container-respostas');
const botaoIniciar = document.getElementById('botao-iniciar');
const botaoReiniciar = document.getElementById('botao-reiniciar');
const elementoTemporizador = document.querySelector('#temporizador span');
const elementoPontuacao = document.querySelector('#pontuacao span');
const elementoPontuacaoFinal = document.getElementById('pontuacao-final');

// Eventos
botaoIniciar.addEventListener('click', iniciarQuiz);
botaoReiniciar.addEventListener('click', iniciarQuiz);

function iniciarQuiz() {
    indicePerguntaAtual = 0;
    pontuacao = 0;
    tempoRestante = 30;
    mostrarTela(telaPergunta);
    mostrarPergunta();
    iniciarTemporizador();
    atualizarPontuacao();
}

function mostrarTela(tela) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    tela.classList.add('active');
}

function mostrarPergunta() {
    const pergunta = perguntas[indicePerguntaAtual];
    elementoPergunta.textContent = pergunta.pergunta;
    containerRespostas.innerHTML = '';
    
    pergunta.respostas.forEach(resposta => {
        const botao = document.createElement('button');
        botao.textContent = resposta.texto;
        botao.classList.add('btn');
        // Passa tanto o objeto resposta quanto o botão para marcar a UI corretamente
        botao.addEventListener('click', () => selecionarResposta(resposta, botao));
        containerRespostas.appendChild(botao);
    });
}

function selecionarResposta(resposta, botaoClicado) {
    // Atualiza pontuação se correta
    if (resposta.correta) {
        pontuacao += 10;
        atualizarPontuacao();
    }

    // Mostra feedback na UI (quais botões estão corretos/errados)
    mostrarResposta(resposta);

    // Move para próxima pergunta após um pequeno delay
    setTimeout(() => {
        if (indicePerguntaAtual < perguntas.length - 1) {
            indicePerguntaAtual++;
            mostrarPergunta();
        } else {
            finalizarQuiz();
        }
    }, 1000);
}

function mostrarResposta(respostaSelecionada) {
    const botoes = containerRespostas.getElementsByTagName('button');
    Array.from(botoes).forEach(botao => {
        // Desabilita cliques adicionais
        botao.disabled = true;

        // Se este botão corresponde à resposta selecionada, marca como correto/errado
        if (botao.textContent === respostaSelecionada.texto) {
            botao.classList.add(respostaSelecionada.correta ? 'correct' : 'wrong');
        } else {
            // Também destaca a resposta correta para que o usuário a veja
            const correspondente = perguntas[indicePerguntaAtual].respostas.find(r => r.texto === botao.textContent);
            if (correspondente && correspondente.correta) {
                botao.classList.add('correct');
            }
        }
    });
}

function atualizarPontuacao() {
    elementoPontuacao.textContent = pontuacao;
    elementoPontuacaoFinal.textContent = pontuacao;
}

function iniciarTemporizador() {
    if (idTemporizador) clearInterval(idTemporizador);
    idTemporizador = setInterval(() => {
        tempoRestante--;
        elementoTemporizador.textContent = tempoRestante;
        if (tempoRestante <= 0) {
            finalizarQuiz();
        }
    }, 1000);
}

function enviarPontuacao(pontuacao) {
    fetch('http://localhost:3333/salvar-pontuacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pontuacao })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data);
    }).catch(error => {
        console.error('Erro ao enviar pontuação:', error);
    });
}

function finalizarQuiz() {
    clearInterval(idTemporizador);
    mostrarTela(telaResultado);
    enviarPontuacao(pontuacao);
}