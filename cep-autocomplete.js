// EuroCompra — preenchimento automático do endereço pelo CEP brasileiro.
(function () {
  async function consultar(url) {
    const controlador = new AbortController();
    const timeout = setTimeout(() => controlador.abort(), 8000);
    try {
      const resposta = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: controlador.signal,
        cache: 'no-store'
      });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
      return await resposta.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  async function buscarCEP(cep) {
    const valor = cep.value.replace(/\D/g, '');
    if (valor.length !== 8 || cep.dataset.cepConsultando === '1') return;

    cep.dataset.cepConsultando = '1';
    cep.setCustomValidity('');

    try {
      let dados;

      try {
        dados = await consultar(`https://viacep.com.br/ws/${valor}/json/`);
      } catch (erro) {
        dados = await consultar(`https://brasilapi.com.br/api/cep/v2/${valor}`);
      }

      if (dados.erro) {
        cep.setCustomValidity('CEP não encontrado. Confira o número informado.');
        return;
      }

      const endereco = document.getElementById('endereco');
      const bairro = document.getElementById('bairro');
      const cidade = document.getElementById('cidade');
      const estado = document.getElementById('estado');

      if (endereco) endereco.value = dados.logradouro || dados.street || '';
      if (bairro) bairro.value = dados.bairro || dados.neighborhood || '';
      if (cidade) cidade.value = dados.localidade || dados.city || '';
      if (estado) estado.value = dados.uf || dados.state || '';

      cep.setCustomValidity('');

      const numero = document.getElementById('numero');
      if (numero) numero.focus();
    } catch (erro) {
      console.error('Erro ao consultar CEP:', erro);
      // Não bloqueia o cadastro se o serviço externo estiver indisponível.
      cep.setCustomValidity('');
    } finally {
      cep.dataset.cepConsultando = '0';
    }
  }

  // Delegação de eventos: funciona mesmo que o formulário seja clonado/substituído.
  document.addEventListener('input', function (event) {
    if (event.target && event.target.id === 'cep') {
      const valor = event.target.value.replace(/\D/g, '');
      if (valor.length === 8) buscarCEP(event.target);
    }
  });

  document.addEventListener('blur', function (event) {
    if (event.target && event.target.id === 'cep') {
      buscarCEP(event.target);
    }
  }, true);
})();

// EuroCompra — envio definitivo do cadastro.
// Clonamos o formulário para remover listeners antigos que ainda possam existir no index.html.
(function () {
  const original = document.getElementById('cadastroForm');
  if (!original) return;

  const form = original.cloneNode(true);
  original.replaceWith(form);

  const message = document.getElementById('formMessage');
  const API_URL = 'https://eurocompra-api.eurocompra2.workers.dev/api/cadastro';
  let enviando = false;

  function mostrarMensagem(texto, sucesso = false) {
    if (!message) return;
    message.textContent = texto;
    message.style.display = 'block';
    message.style.background = sucesso ? '#eaf8f0' : '#fff4e5';
    message.style.color = sucesso ? '#16804b' : '#9a5b00';
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function mostrarSucesso(codigo) {
    const formBox = form.closest('.form-box');
    if (!formBox) return;

    setTimeout(() => {
      formBox.innerHTML = `
        <div style="text-align:center; padding:35px 10px;">
          <div style="font-size:52px; margin-bottom:14px;">✅</div>
          <h2 style="color:#06245c; margin-bottom:10px;">Cadastro enviado!</h2>
          <p style="color:#667085; margin-bottom:8px;">Recebemos seus dados com segurança.</p>
          <p style="color:#063b9e; font-weight:700;">Código do cadastro: ${codigo || 'recebido'}</p>
          <p style="color:#667085; margin-top:12px; font-size:14px;">Em breve entraremos em contato.</p>
        </div>
      `;
    }, 1200);
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (enviando) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    enviando = true;
    const botao = form.querySelector('button[type="submit"]');
    const textoOriginal = botao ? botao.textContent : '';

    if (botao) {
      botao.disabled = true;
      botao.textContent = 'Enviando...';
      botao.style.opacity = '0.7';
    }

    mostrarMensagem('Enviando cadastro...');

    try {
      const dados = Object.fromEntries(new FormData(form));
      const controlador = new AbortController();
      const timeout = setTimeout(() => controlador.abort(), 15000);

      let resposta;
      try {
        resposta = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados),
          signal: controlador.signal
        });
      } finally {
        clearTimeout(timeout);
      }

      const texto = await resposta.text();
      let resultado;
      try {
        resultado = JSON.parse(texto);
      } catch {
        resultado = { ok: false, message: texto || `Erro HTTP ${resposta.status}` };
      }

      if (!resposta.ok || !resultado.ok) {
        throw new Error(resultado.message || `Não foi possível enviar o cadastro (HTTP ${resposta.status}).`);
      }

      const codigo = resultado.codigo || '';
      mostrarMensagem(`Cadastro enviado com sucesso! Código: ${codigo || 'recebido'}.`, true);
      mostrarSucesso(codigo);
    } catch (erro) {
      console.error('Erro no envio do cadastro:', erro);
      const mensagem = erro.name === 'AbortError'
        ? 'O servidor demorou para responder. Tente novamente em alguns segundos.'
        : (erro.message || 'Não foi possível enviar o cadastro.');
      // Em qualquer erro, o formulário e todos os dados permanecem na tela.
      mostrarMensagem(`Não foi possível enviar o cadastro: ${mensagem}`);
    } finally {
      enviando = false;
      if (botao && document.body.contains(botao)) {
        botao.disabled = false;
        botao.textContent = textoOriginal;
        botao.style.opacity = '1';
      }
    }
  });
})();
