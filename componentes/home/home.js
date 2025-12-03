document.addEventListener('DOMContentLoaded', () => {
	const currentUser = localStorage.getItem('currentUser');
	if (!currentUser) {
		window.location.href = '../login/index.html';
		return;
	}
	const user = JSON.parse(currentUser);
	const storageKey = `transactions_${user.email}`;

	const logoutLink = document.getElementById('logout-link');
	if (logoutLink) {
		logoutLink.addEventListener('click', (e) => {
			e.preventDefault();
			localStorage.removeItem('currentUser');
			window.location.href = '../login/index.html';
		});
	}

	// referências aos TDs onde vamos "pushar" os blocos
	const tdEntradas = document.querySelector('td.entradas');
	const tdSaidas = document.querySelector('td.saidas');

	function getTransactions() {
		try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
		catch { return []; }
	}
	function saveTransactions(list) {
		localStorage.setItem(storageKey, JSON.stringify(list));
	}
	function formatCurrency(v) {
		const cleaned = String(v).replace(/[^\d,.-]/g, '').replace(',', '.');
		const n = Number(cleaned);
		return Number.isFinite(n) ? 'R$ ' + n.toFixed(2) : 'R$ ' + v;
	}

	// cria o bloco DOM conforme estrutura pedida
	function createTxElement(tx) {
		const container = document.createElement('div');
		container.className = tx.tipo === 'entrada' ? 'entrada-data' : 'saida-data';

		const pVal = document.createElement('p');
		pVal.className = 'valor-dado';
		pVal.textContent = formatCurrency(tx.valor);

		const infoDiv = document.createElement('div');
		infoDiv.className = 'd-flex justify-content-between w-100';
		const pDesc = document.createElement('p');
		pDesc.textContent = tx.descricao || '';
		const pData = document.createElement('p');
		pData.textContent = tx.data || '';

		infoDiv.appendChild(pDesc);
		infoDiv.appendChild(pData);

		container.appendChild(pVal);
		container.appendChild(infoDiv);
		return container;
	}

	// render inicial: limpa tds e append de cada transação
	function renderTransactions() {
		if (tdEntradas) tdEntradas.innerHTML = '';
		if (tdSaidas) tdSaidas.innerHTML = '';

		const txs = getTransactions();
		if (!txs || txs.length === 0) {
			// opcional: mensagem vazia dentro de entradas (ou deixe em branco)
			return;
		}
		txs.forEach(tx => {
			const el = createTxElement(tx);
			if (tx.tipo === 'entrada' && tdEntradas) tdEntradas.appendChild(el);
			if (tx.tipo === 'saida' && tdSaidas) tdSaidas.appendChild(el);
		});
	}

	// handler do botão Adicionar
	const addBtn = document.getElementById('add-transaction-btn');
	if (addBtn) {
		addBtn.addEventListener('click', (e) => {
			e.preventDefault();
			const inputValor = document.getElementById('valor');
			const inputDescricao = document.getElementById('descricao');
			const inputData = document.getElementById('data');
			const inputTipo = document.getElementById('tipo');

			if (!inputValor || !inputDescricao || !inputData || !inputTipo) {
				alert('Campos do formulário não encontrados.');
				return;
			}

			const valor = inputValor.value.trim();
			const descricao = inputDescricao.value.trim();
			const data = inputData.value;
			const tipo = inputTipo.value;

			if (!valor || !data || !tipo) {
				alert('Preencha valor, data e tipo.');
				return;
			}

			const txs = getTransactions();
			const tx = { valor, descricao, data, tipo };
			txs.push(tx); // push conforme solicitado
			saveTransactions(txs);

			// adicionar ao DOM (push no TD)
			const el = createTxElement(tx);
			if (tipo === 'entrada' && tdEntradas) tdEntradas.appendChild(el);
			if (tipo === 'saida' && tdSaidas) tdSaidas.appendChild(el);

			// limpar campos
			inputValor.value = '';
			inputDescricao.value = '';
			inputData.value = '';
			inputTipo.value = 'entrada';

			// fechar modal
			const modalEl = document.querySelector('.modal.fade');
			if (modalEl) {
				const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
				bsModal.hide();
			}
		});
	}

	// render inicial
	renderTransactions();
});