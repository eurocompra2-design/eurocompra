// EuroCompra — preenchimento automático do endereço pelo CEP brasileiro.
(function () {
  const cep = document.getElementById('cep');
  if (!cep) return;

  const fields = {
    endereco: document.getElementById('endereco'),
    bairro: document.getElementById('bairro'),
    cidade: document.getElementById('cidade'),
    estado: document.getElementById('estado')
  };

  function limparEndereco() {
    Object.values(fields).forEach((field) => {
      if (field) field.value = '';
    });
  }

  async function buscarCEP() {
    const valor = cep.value.replace(/\D/g, '');
    if (valor.length !== 8) return;

    cep.setCustomValidity('');
    cep.disabled = true;

    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`, {
        headers: { Accept: 'application/json' }
      });

      if (!resposta.ok) throw new Error('Falha na consulta do CEP');

      const dados = await resposta.json();

      if (dados.erro) {
        limparEndereco();
        cep.setCustomValidity('CEP não encontrado. Confira o número informado.');
        cep.reportValidity();
        return;
      }

      if (fields.endereco) fields.endereco.value = dados.logradouro || '';
      if (fields.bairro) fields.bairro.value = dados.bairro || '';
      if (fields.cidade) fields.cidade.value = dados.localidade || '';
      if (fields.estado) fields.estado.value = dados.uf || '';

      cep.setCustomValidity('');

      const numero = document.getElementById('numero');
      if (numero) numero.focus();
    } catch (erro) {
      console.error('Erro ao consultar CEP:', erro);
      cep.setCustomValidity('Não foi possível consultar o CEP agora. Tente novamente.');
    } finally {
      cep.disabled = false;
    }
  }

  cep.addEventListener('blur', buscarCEP);
  cep.addEventListener('input', function () {
    const valor = this.value.replace(/\D/g, '');
    if (valor.length === 8) buscarCEP();
  });
})();

// EuroCompra — envio robusto do cadastro.
// O listener fica no DOCUMENTO, em captura, para executar antes de qualquer
// listener antigo do index.html. Assim o formulário não pode ser interceptado
// pelo código antigo nem mostrar uma mensagem genérica.
(function () {
  const form = document.getElementById('cadastroForm');
  const message = document.getElementById('formMessage');
  if (!form || !message) return;

  const API_URL = 'https://eurocompra-api.eurocompra2.workers.dev/api/cadastro';
  let enviando = false;

  function mostrarMensagem(texto, sucesso = false) {
    message.textContent = texto;
    message.style.display = 'block';
    message.style.background = sucesso ? '#eaf8f0' : '#fff4e5';
    message.style.color = sucesso ? '#16804b' : '#9a5b00';
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function fecharFormulario(codigo) {
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

  // Document + capture executa antes do listener do formulário registrado
  // diretamente no index.html.
  document.addEventListener('submit', async function (event) {
    if (event.target !== form) return;

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

      // Só limpamos e fechamos depois que a API confirmou ok:true.
      form.reset();
      fecharFormulario(codigo);
    } catch (erro) {
      console.error('Erro no envio do cadastro:', erro);

      const mensagem = erro.name === 'AbortError'
        ? 'O servidor demorou para responder. Tente novamente em alguns segundos.'
        : (erro.message || 'Não foi possível enviar o cadastro.');

      mostrarMensagem(`Não foi possível enviar o cadastro: ${mensagem}`);
    } finally {
      enviando = false;
      if (botao && document.body.contains(botao)) {
        botao.disabled = false;
        botao.textContent = textoOriginal;
        botao.style.opacity = '1';
      }
    }
  }, true);
})();
