/* =========================================================
   GOLDEN MINE - JavaScript usado por todas as páginas
   5 funcionalidades, cada uma marcada abaixo
   ========================================================= */


/* ---------- FUNCIONALIDADE 1: destacar no menu a página atual ---------- */
// Pega o nome do arquivo aberto (ex: "ps2.html"). Na raiz do site vira "index.html".
const paginaAtual = location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('#lista_cabeca a').forEach(function (link) {
  if (link.getAttribute('href') === paginaAtual) {
    link.classList.add('ativo');
  }
});

// Nas páginas de console, o botão CONSOLES também fica aceso
if (['nintendo64.html', 'xbox360.html', 'ps2.html'].includes(paginaAtual)) {
  document.getElementById('consoles').classList.add('ativo');
}


/* ---------- FUNCIONALIDADE 2: carrinho em janela ---------- */
// Os itens ficam salvos no navegador (localStorage), então não somem ao trocar de página.
// Cada item é guardado assim: { nome: "Halo 3", preco: 49.9 }
const contador = document.getElementById('contador-carrinho');
let itens = [];
try {
  itens = JSON.parse(localStorage.getItem('itensCarrinho')) || [];
} catch (erro) {
  itens = []; // se o dado salvo estiver estragado, começa vazio
}

// Transforma número em dinheiro: 49.9 -> "R$ 49,90"
function emReais(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// A janela do carrinho é criada aqui, assim não precisa repetir no HTML de cada página.
// <dialog> é a "telinha" nativa do HTML: escurece o fundo e fecha com a tecla Esc.
const janela = document.createElement('dialog');
janela.id = 'janela-carrinho';
janela.innerHTML =
  '<div class="carrinho-conteudo">' +
  '  <div class="carrinho-topo">' +
  '    <h2>Carrinho</h2>' +
  '    <button class="fechar" aria-label="Fechar carrinho">✕</button>' +
  '  </div>' +
  '  <ul id="lista-carrinho"></ul>' +
  '  <p class="carrinho-total">Total: <strong id="total-carrinho"></strong></p>' +
  '  <div class="carrinho-acoes">' +
  '    <button class="btn-link" id="esvaziar">Esvaziar</button>' +
  '    <button class="btn" id="finalizar">Finalizar compra</button>' +
  '  </div>' +
  '</div>';
document.body.appendChild(janela);

const lista = document.getElementById('lista-carrinho');

// Salva os itens e redesenha a lista, o total e o contador do menu
function atualizarCarrinho() {
  localStorage.setItem('itensCarrinho', JSON.stringify(itens));
  contador.textContent = itens.length;
  lista.innerHTML = '';

  if (itens.length === 0) {
    lista.innerHTML = '<li class="vazio">Seu carrinho está vazio.</li>';
  }

  let total = 0;
  itens.forEach(function (item, indice) {
    total += item.preco;

    const linha = document.createElement('li');
    linha.innerHTML = '<span></span><strong></strong><button class="remover" aria-label="Remover">✕</button>';
    linha.querySelector('span').textContent = item.nome;
    linha.querySelector('strong').textContent = emReais(item.preco);
    linha.querySelector('.remover').addEventListener('click', function () {
      itens.splice(indice, 1); // tira só esse item
      atualizarCarrinho();
    });
    lista.appendChild(linha);
  });

  document.getElementById('total-carrinho').textContent = emReais(total);
  document.getElementById('esvaziar').disabled = itens.length === 0;
  document.getElementById('finalizar').disabled = itens.length === 0;
}

atualizarCarrinho();

// Botões "Comprar": pegam o nome e o preço do próprio card
document.querySelectorAll('.btn-comprar').forEach(function (botao) {
  botao.addEventListener('click', function () {
    const card = botao.closest('.card');
    const nome = card.querySelector('h3').textContent;
    // "R$ 1.299,90" -> 1299.90
    const preco = Number(card.querySelector('.preco').textContent.replace(/[^\d,]/g, '').replace(',', '.'));

    itens.push({ nome: nome, preco: preco });
    atualizarCarrinho();

    // Mostra "Adicionado!" por 1 segundo e volta ao texto normal
    botao.textContent = 'Adicionado!';
    setTimeout(function () {
      botao.textContent = 'Comprar';
    }, 1000);
  });
});

// Clicar em CARRINHO abre a janela na página em que a pessoa está
document.getElementById('carrinho').addEventListener('click', function (evento) {
  evento.preventDefault();
  janela.showModal();
});

// Fecha no ✕ ou clicando fora da janela
janela.querySelector('.fechar').addEventListener('click', function () {
  janela.close();
});
janela.addEventListener('click', function (evento) {
  if (evento.target === janela) {
    janela.close();
  }
});

document.getElementById('esvaziar').addEventListener('click', function () {
  itens = [];
  atualizarCarrinho();
});

document.getElementById('finalizar').addEventListener('click', function () {
  alert('Pedido realizado! Total: ' + document.getElementById('total-carrinho').textContent);
  itens = [];
  atualizarCarrinho();
  janela.close();
});


/* ---------- FUNCIONALIDADE 3: botão "voltar ao topo" ---------- */
// O botão é criado aqui, assim não precisa repetir no HTML de cada página.
const botaoTopo = document.createElement('button');
botaoTopo.id = 'topo';
botaoTopo.textContent = '▲';
botaoTopo.setAttribute('aria-label', 'Voltar ao topo');
botaoTopo.hidden = true;
document.body.appendChild(botaoTopo);

// Só aparece depois de rolar 300px para baixo
window.addEventListener('scroll', function () {
  botaoTopo.hidden = window.scrollY < 300;
});

botaoTopo.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ---------- FUNCIONALIDADE 4: validação do formulário de perfil ---------- */
// Só roda na página que tem o formulário (perfil.html).
const formulario = document.getElementById('form-perfil');

if (formulario) {
  const mensagem = document.getElementById('mensagem-form');

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); // não recarrega a página

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.replace(/\D/g, ''); // só números
    const nascimento = new Date(document.getElementById('nascimento').value);
    const erros = [];

    if (nome.length < 3) {
      erros.push('O nome precisa ter pelo menos 3 letras.');
    }
    if (telefone.length < 10 || telefone.length > 11) {
      erros.push('O telefone precisa ter DDD + número (10 ou 11 dígitos).');
    }
    if (nascimento > new Date()) {
      erros.push('A data de nascimento não pode ser no futuro.');
    }

    if (erros.length > 0) {
      mensagem.className = 'mensagem erro';
      mensagem.innerHTML = erros.join('<br>');
    } else {
      mensagem.className = 'mensagem sucesso';
      mensagem.textContent = 'Perfil salvo com sucesso, ' + nome + '! Bem-vindo(a) à Golden Mine.';
      formulario.reset();
      atualizarContador();
    }
  });
}


/* ---------- FUNCIONALIDADE 5: contador de caracteres do texto ---------- */
const campoTexto = document.getElementById('sobre');
const contadorCaracteres = document.getElementById('contador-caracteres');

function atualizarContador() {
  if (campoTexto) {
    contadorCaracteres.textContent = campoTexto.value.length + ' / ' + campoTexto.maxLength;
  }
}

if (campoTexto) {
  campoTexto.addEventListener('input', atualizarContador);
  atualizarContador();
}
