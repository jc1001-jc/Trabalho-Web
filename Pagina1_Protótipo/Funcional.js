/* ---------- FUNCIONALIDADE 6: login e console favorito ---------- */
// Só roda na página que tem o formulário de login (login.html).
// Colar no fim do script.js. Os nomes das variáveis são diferentes dos de cima para não dar conflito.
const formLogin = document.getElementById('form-login');

if (formLogin) {
  const campoEmail = document.getElementById('email');
  const campoSenha = document.getElementById('senha');
  const botaoMostrar = document.getElementById('mostrar-senha');
  const campoLembrar = document.getElementById('lembrar');
  const campoConsole = document.getElementById('console-favorito');
  const previewConsole = document.getElementById('preview-console');
  const mensagemLogin = document.getElementById('mensagem-login');

  // Nome de cada console (a chave é a mesma classe de cor usada no CSS)
  const nomesConsoles = {
    n64: 'Nintendo 64',
    xbox: 'Xbox 360',
    ps2: 'PlayStation 2'
  };

  // Troca a cor da página e o texto da caixinha conforme o console escolhido
  function aplicarConsole(valor) {
    document.body.classList.remove('n64', 'xbox', 'ps2');

    if (valor) {
      document.body.classList.add(valor);
      previewConsole.textContent = 'Favorito: ' + nomesConsoles[valor];
    } else {
      previewConsole.textContent = 'Nenhum console escolhido.';
    }
  }

  // Ao abrir a página, recupera o que foi salvo no navegador (localStorage)
  const consoleSalvo = localStorage.getItem('consoleFavorito') || '';
  const emailSalvo = localStorage.getItem('emailLembrado') || '';
  const avisoSalvo = localStorage.getItem('avisoPreferido');

  campoConsole.value = consoleSalvo;
  aplicarConsole(consoleSalvo);

  if (emailSalvo) {
    campoEmail.value = emailSalvo;
    campoLembrar.checked = true;
  }

  if (avisoSalvo) {
    const opcaoAviso = formLogin.querySelector('input[name="aviso"][value="' + avisoSalvo + '"]');
    if (opcaoAviso) {
      opcaoAviso.checked = true;
    }
  }

  // Botão "Mostrar" / "Ocultar" senha
  botaoMostrar.addEventListener('click', function () {
    const escondida = campoSenha.type === 'password';
    campoSenha.type = escondida ? 'text' : 'password';
    botaoMostrar.textContent = escondida ? 'Ocultar' : 'Mostrar';
    botaoMostrar.setAttribute('aria-label', escondida ? 'Ocultar senha' : 'Mostrar senha');
  });

  // A cor da página muda na hora, sem precisar enviar o formulário
  campoConsole.addEventListener('change', function () {
    aplicarConsole(campoConsole.value);
  });

  // Some com a mensagem de erro assim que a pessoa volta a digitar
  formLogin.addEventListener('input', function () {
    mensagemLogin.className = 'mensagem';
    mensagemLogin.textContent = '';
  });

  // Validação ao clicar em "Entrar"
  formLogin.addEventListener('submit', function (evento) {
    evento.preventDefault(); // não recarrega a página

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;
    const erros = [];

    // Confere o formato básico: texto@texto.texto
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      erros.push('Digite um e-mail válido.');
    }
    if (senha.length < 6) {
      erros.push('A senha precisa ter pelo menos 6 caracteres.');
    }

    if (erros.length > 0) {
      mensagemLogin.className = 'mensagem erro';
      mensagemLogin.innerHTML = erros.join('<br>');
      return;
    }

    // Salva as preferências da pessoa no navegador
    const avisoEscolhido = formLogin.querySelector('input[name="aviso"]:checked').value;
    localStorage.setItem('consoleFavorito', campoConsole.value);
    localStorage.setItem('avisoPreferido', avisoEscolhido);

    if (campoLembrar.checked) {
      localStorage.setItem('emailLembrado', email);
    } else {
      localStorage.removeItem('emailLembrado');
    }

    let texto = 'Login feito! Bem-vindo(a) de volta à Golden Mine.';
    if (campoConsole.value) {
      texto += ' Console favorito: ' + nomesConsoles[campoConsole.value] + '.';
    }

    mensagemLogin.className = 'mensagem sucesso';
    mensagemLogin.textContent = texto;
    campoSenha.value = ''; // limpa a senha por segurança
  });
}