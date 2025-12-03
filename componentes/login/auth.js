document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');

    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '[]');
        } catch {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = (signupEmail.value || '').trim();
            const password = (signupPassword.value || '').trim();
            if (!email || !password) {
                alert('Preencha email e senha para criar a conta.');
                return;
            }
            const users = getUsers();
            if (users.some(u => u.email === email)) {
                alert('Email já cadastrado.');
                return;
            }
            users.push({ email, password });
            saveUsers(users);
            // fechar modal (assume apenas um modal nesta página)
            const modalEl = document.querySelector('.modal.fade');
            if (modalEl) {
                const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                bsModal.hide();
            }
            // limpar campos
            signupEmail.value = '';
            signupPassword.value = '';
            alert('Conta criada com sucesso.');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (loginEmail.value || '').trim();
            const password = (loginPassword.value || '').trim();
            if (!email || !password) {
                alert('Preencha email e senha para entrar.');
                return;
            }
            const users = getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                alert('Credenciais inválidas.');
                return;
            }
            // salvar usuário logado (opcional)
            localStorage.setItem('currentUser', JSON.stringify({ email }));
            // redirecionar para a tela home
            window.location.href = '../home/home.html';
        });
    }
});
