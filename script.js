document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // ===== 1. CONFIGURAÇÃO E INICIALIZAÇÃO DO FIREBASE =====
    // =================================================================
    const firebaseConfig = {
      apiKey: "AIzaSyAlvRBErv2pG8BObnX8Ew0CqOQKypTM39c",
      authDomain: "controle-612f2.firebaseapp.com",
      projectId: "controle-612f2",
      storageBucket: "controle-612f2.appspot.com",
      messagingSenderId: "39791655795",
      appId: "1:39791655795:web:1b6ad76afa568af3b86306",
      measurementId: "G-7X9S01NMWX"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    [cite_start]const db = firebase.firestore(); [cite: 62]

    // =================================================================
    // ===== 2. SELETORES DE ELEMENTOS DO DOM =====
    // =================================================================
    [cite_start]const appContainer = document.getElementById('app'); [cite: 62]
    [cite_start]const authOverlay = document.getElementById('auth-overlay'); [cite: 63]
    [cite_start]const authForm = document.getElementById('auth-form'); [cite: 63]
    [cite_start]const authTitle = document.getElementById('auth-title'); [cite: 63]
    [cite_start]const authEmailInput = document.getElementById('auth-email'); [cite: 63]
    [cite_start]const authPasswordInput = document.getElementById('auth-password'); [cite: 63]
    [cite_start]const authSubmitBtn = document.getElementById('auth-submit-btn'); [cite: 64]
    [cite_start]const toggleAuthModeBtn = document.getElementById('toggle-auth-mode-btn'); [cite: 64]
    [cite_start]const authPromptText = document.getElementById('auth-prompt-text'); [cite: 64]
    [cite_start]const authError = document.getElementById('auth-error'); [cite: 64]
    [cite_start]const logoutBtn = document.getElementById('logout-btn'); [cite: 64]
    [cite_start]const addTransactionBtn = document.getElementById('add-transaction-btn'); [cite: 65]
    
    // Seletores do Modal de Transação
    [cite_start]const transactionModal = document.getElementById('transaction-modal'); [cite: 65]
    [cite_start]const closeModalBtn = document.getElementById('close-modal-btn'); [cite: 65]
    [cite_start]const transactionForm = document.getElementById('transaction-form'); [cite: 65]
    [cite_start]const transactionTypeBtns = document.querySelectorAll('.transaction-type-btn'); [cite: 65]
    [cite_start]const isFixedCheckbox = document.getElementById('is-fixed'); [cite: 66]
    [cite_start]const isVariableContainer = document.getElementById('is-variable-container'); [cite: 66]
    [cite_start]const amountInput = document.getElementById('amount'); [cite: 66]
    [cite_start]const dateInput = document.getElementById('date'); [cite: 66]
    [cite_start]const categorySelect = document.getElementById('category'); [cite: 66]
    [cite_start]const subcategorySelect = document.getElementById('subcategory'); [cite: 67]
    [cite_start]const paymentMethodContainer = document.getElementById('payment-method-container'); [cite: 67]
    [cite_start]const paymentMethodSelect = document.getElementById('payment-method'); [cite: 67]
    [cite_start]const descriptionInput = document.getElementById('description'); [cite: 67]
    [cite_start]const formErrorMessage = document.getElementById('form-error-message'); [cite: 67]

    // Seletores do Dashboard
    [cite_start]const balanceValueEl = document.getElementById('balance-value'); [cite: 68]
    [cite_start]const debtsValueEl = document.getElementById('debts-value'); [cite: 68]
    [cite_start]const investmentsValueEl = document.getElementById('investments-value'); [cite: 68]
    [cite_start]const invoiceValueEl = document.getElementById('invoice-value'); [cite: 68]
    
    // Seletores dos Modais do Cabeçalho
    [cite_start]const settingsBtn = document.getElementById('settings-btn'); [cite: 71]
    [cite_start]const settingsModal = document.getElementById('settings-modal'); [cite: 71]
    [cite_start]const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn'); [cite: 72]
    [cite_start]const forecastBtn = document.getElementById('forecast-btn'); [cite: 73]
    [cite_start]const forecastModal = document.getElementById('forecast-modal'); [cite: 74]
    [cite_start]const closeForecastModalBtn = document.getElementById('close-forecast-modal-btn'); [cite: 74]
    [cite_start]const aiBtn = document.getElementById('ai-btn'); [cite: 74]
    [cite_start]const aiModal = document.getElementById('ai-modal'); [cite: 75]
    [cite_start]const closeAiModalBtn = document.getElementById('close-ai-modal-btn'); [cite: 75]

    // =================================================================
    // ===== 3. ESTADO DA APLICAÇÃO =====
    // =================================================================
    [cite_start]let currentUser = null; [cite: 82]
    [cite_start]let transactions = []; [cite: 83]
    [cite_start]let selectedTransactionType = null; [cite: 84]
    [cite_start]let editingTransactionId = null; [cite: 86]
    [cite_start]let settings = {}; [cite: 87]
    [cite_start]let categoryData = {}; [cite: 87]
    
    // =================================================================
    // ===== 4. LÓGICA DE AUTENTICAÇÃO =====
    // =================================================================
    [cite_start]let isLoginMode = true; [cite: 88]
    [cite_start]toggleAuthModeBtn.addEventListener('click', () => { [cite: 89]
        [cite_start]isLoginMode = !isLoginMode; [cite: 89]
        authTitle.textContent = isLoginMode ? [cite_start]'Login' : 'Cadastre-se'; [cite: 89]
        authSubmitBtn.textContent = isLoginMode ? [cite_start]'Entrar' : 'Criar Conta'; [cite: 89]
        authPromptText.textContent = isLoginMode ? 'Não tem uma conta?' [cite_start]: 'Já tem uma conta?'; [cite: 89]
        toggleAuthModeBtn.textContent = isLoginMode ? [cite_start]'Cadastre-se' : 'Entrar'; [cite: 89]
        [cite_start]authError.textContent = ''; [cite: 89]
        [cite_start]authForm.reset(); [cite: 89]
    });
    [cite_start]authForm.addEventListener('submit', (e) => { [cite: 90]
        [cite_start]e.preventDefault(); [cite: 90]
        [cite_start]const email = authEmailInput.value; [cite: 90]
        [cite_start]const password = authPasswordInput.value; [cite: 90]
        [cite_start]authError.textContent = ''; [cite: 90]
        [cite_start]authSubmitBtn.disabled = true; [cite: 90]

        if (isLoginMode) {
            [cite_start]auth.signInWithEmailAndPassword(email, password) [cite: 90]
                [cite_start].catch(error => { authError.textContent = "Email ou senha inválidos."; }) [cite: 90, 91]
                [cite_start].finally(() => { authSubmitBtn.disabled = false; }); [cite: 91]
        } else {
            [cite_start]auth.createUserWithEmailAndPassword(email, password) [cite: 91]
                [cite_start].catch(error => { [cite: 91]
                    authError.textContent = error.code === 'auth/email-already-in-use' ? "Este email já está em uso." [cite_start]: "Erro ao criar conta. Verifique os dados."; [cite: 91, 92]
                })
                [cite_start].finally(() => { authSubmitBtn.disabled = false; }); [cite: 92]
        }
    });
    [cite_start]logoutBtn.addEventListener('click', () => { [cite: 93]
        [cite_start]auth.signOut(); [cite: 93]
    });

    // =================================================================
    // ===== 5. OBSERVADOR DE ESTADO DE AUTENTICAÇÃO =====
    // =================================================================
    [cite_start]auth.onAuthStateChanged(user => { [cite: 94]
        if (user) {
            [cite_start]currentUser = user; [cite: 94]
            [cite_start]authOverlay.classList.add('hidden'); [cite: 94]
            [cite_start]appContainer.classList.remove('opacity-0'); [cite: 94]
            //initializeApp(); // Implemente essa função
        } else {
            [cite_start]currentUser = null; [cite: 95]
            [cite_start]authOverlay.classList.remove('hidden'); [cite: 95]
            [cite_start]appContainer.classList.add('opacity-0'); [cite: 95]
            //resetAppState(); // Implemente essa função
        }
    });

    // =================================================================
    // ===== 8. LÓGICA DA APLICAÇÃO (Funções Principais) =====
    // =================================================================
    
    // --- FUNÇÕES DE MODAL (ADICIONADAS!) ---
    const openModal = (modalElement) => {
        if(modalElement) modalElement.classList.remove('hidden');
    };

    const closeModal = (modalElement) => {
        if(modalElement) modalElement.classList.add('hidden');
    };
    
    const openTransactionModal = () => {
        transactionForm.reset();
        document.querySelectorAll('.transaction-type-btn.active').forEach(b => b.classList.remove('active'));
        paymentMethodContainer.classList.add('hidden');
        isVariableContainer.classList.add('hidden');
        selectedTransactionType = null;
        editingTransactionId = null;
        dateInput.value = new Date().toISOString().split('T')[0];
        openModal(transactionModal);
    };

    const closeTransactionModal = () => {
        closeModal(transactionModal);
    };
    
    // =================================================================
    // ===== 9. EVENT LISTENERS (SEÇÃO COMPLETA E CORRIGIDA!) =====
    // =================================================================
    
    // Botão principal para adicionar transação
    [cite_start]addTransactionBtn.addEventListener('click', openTransactionModal); [cite: 128]
    [cite_start]closeModalBtn.addEventListener('click', closeTransactionModal); [cite: 129]
    [cite_start]transactionModal.addEventListener('click', (e) => { if (e.target === transactionModal) closeTransactionModal(); }); [cite: 129]

    // Listeners para os Modais do Cabeçalho
    settingsBtn.addEventListener('click', () => openModal(settingsModal));
    closeSettingsModalBtn.addEventListener('click', () => closeModal(settingsModal));
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(settingsModal); });

    aiBtn.addEventListener('click', () => openModal(aiModal));
    closeAiModalBtn.addEventListener('click', () => closeModal(aiModal));
    aiModal.addEventListener('click', (e) => { if (e.target === aiModal) closeModal(aiModal); });

    forecastBtn.addEventListener('click', () => openModal(forecastModal));
    closeForecastModalBtn.addEventListener('click', () => closeModal(forecastModal));
    forecastModal.addEventListener('click', (e) => { if (e.target === forecastModal) closeModal(forecastModal); });
    
    // Listeners para os botões de tipo de transação
    transactionTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            transactionTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTransactionType = btn.dataset.type;

            paymentMethodContainer.classList.toggle('hidden', selectedTransactionType !== 'saida');
            isVariableContainer.classList.toggle('hidden', selectedTransactionType !== 'entrada');
            
            if (selectedTransactionType !== 'entrada') {
                isFixedCheckbox.checked = false;
            }
            // updateCategories(); // Descomente quando a função existir
        });
    });

}); // Fim do 'DOMContentLoaded'
