document.addEventListener('DOMContentLoaded', () => {
	// Verifica sessão
	const currentUser = localStorage.getItem('currentUser');
	if (!currentUser) {
		window.location.href = '../login/index.html';
		return;
	}
	const user = JSON.parse(currentUser);
	const storageKey = `transactions_${user.email}`;

	// Logout (remove sessão)
	const logoutLink = document.getElementById('logout-link');
	if (logoutLink) {
		logoutLink.addEventListener('click', (e) => {
			e.preventDefault();
			localStorage.removeItem('currentUser');
			window.location.href = '../login/index.html';
		});
	}

	// Helpers localStorage
	function getTransactions() {
		try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
		catch { return []; }
	}
	function saveTransactions(list) {
		localStorage.setItem(storageKey, JSON.stringify(list));
	}

	// Formatação
	function formatDate(iso) {
		if (!iso) return '';
		const parts = iso.split('-'); // YYYY-MM-DD
		if (parts.length !== 3) return iso;
		return `${parts[2]}/${parts[1]}/${parts[0]}`;
	}
	function formatCurrency(value) {
		const cleaned = String(value).replace(/[^\d,.-]/g, '').replace(',', '.');
		const n = Number(cleaned);
		if (!Number.isFinite(n)) return value;
		return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	}
	function capitalizeTipo(t) {
		if (!t) return '';
		return t.charAt(0).toUpperCase() + t.slice(1);
	}

	// Renderização na tbody como <tr><td>data</td><td>valor</td><td>Tipo</td><td>descrição</td></tr>
	const tbody = document.getElementById('transactions-tbody');
	function renderTransactions() {
		if (!tbody) return;
		const txs = getTransactions();
		tbody.innerHTML = '';
		if (!txs.length) {
			const tr = document.createElement('tr');
			const td = document.createElement('td');
			td.colSpan = 4;
			td.className = 'text-center text-muted';
			td.textContent = 'Nenhuma transação registrada.';
			tr.appendChild(td);
			tbody.appendChild(tr);
			return;
		}
		txs.forEach(tx => {
			const tr = document.createElement('tr');

			const tdData = document.createElement('td');
			tdData.textContent = tx.data ? (tx.data.includes('-') ? formatDate(tx.data) : tx.data) : '';

			const tdValor = document.createElement('td');
			tdValor.textContent = formatCurrency(tx.valor);

			const tdTipo = document.createElement('td');
			tdTipo.textContent = capitalizeTipo(tx.tipo);

			const tdDesc = document.createElement('td');
			tdDesc.textContent = tx.descricao || '';

			tr.appendChild(tdData);
			tr.appendChild(tdValor);
			tr.appendChild(tdTipo);
			tr.appendChild(tdDesc);

			tbody.appendChild(tr);
		});
	}

	// Handler do botão Adicionar: valida, salva e re-renderiza
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
			const data = inputData.value; // YYYY-MM-DD
			const tipo = inputTipo.value;

			if (!valor || !data || !tipo) {
				alert('Preencha valor, data e tipo.');
				return;
			}

			const txs = getTransactions();
			// push no final (aparece na tabela como última linha)
			txs.push({ data: data.includes('-') ? data : data, valor, tipo, descricao });
			saveTransactions(txs);
			renderTransactions();

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