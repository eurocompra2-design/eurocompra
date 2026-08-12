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
    Object.values(fields).forEach((field) => { if (field) field.value = ''; });
  }
  async function buscarCEP() {
    const valor = cep.value.replace(/\D/g, '');
    if (valor.length !== 8) return;
    cep.setCustomValidity('');
    cep.disabled = true;
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`, { headers: { Accept: 'application/json' } });
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

// Corrige a mensagem visual do cadastro para não prometer WhatsApp
// enquanto a integração Meta/WhatsApp ainda não estiver ativa.
(function () {
  const message = document.getElementById('formMessage');
  if (!message) return;

  const observer = new MutationObserver(() => {
    const texto = message.textContent || '';
    if (texto.toLowerCase().includes('whatsapp')) {
      message.textContent = 'Cadastro enviado com sucesso! Seus dados foram salvos com segurança.';
    }

    if (texto.toLowerCase().includes('cadastro enviado com sucesso')) {
      observer.disconnect();
      const formBox = message.closest('.form-box');
      if (!formBox) return;

      // Mostra a confirmação por um instante e depois fecha o formulário.
      setTimeout(() => {
        formBox.innerHTML = `
          <div style="text-align:center; padding:35px 10px;">
            <div style="font-size:52px; margin-bottom:14px;">✅</div>
            <h2 style="color:#06245c; margin-bottom:10px;">Cadastro enviado!</h2>
            <p style="color:#667085;">Recebemos seus dados com segurança. Em breve entraremos em contato.</p>
          </div>
        `;
      }, 1200);
    }
  });

  observer.observe(message, {
    childList: true,
    characterData: true,
    subtree: true
  });
})();
