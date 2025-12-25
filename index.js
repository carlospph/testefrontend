const API_URL = 'https://api-users-icyc.onrender.com/usuarios';

// 1. LISTAR (GET)
async function getUsers() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '<tr><td colspan="3">Carregando usuários...</td></tr>';

    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        
        tbody.innerHTML = ''; // Limpa a mensagem de carregando

        users.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="btn-edit" onclick="fillForm('${user._id}', '${user.nome}', '${user.email}')">Editar</button>
                        <button class="btn-delete" onclick="deleteUser('${user._id}')">Excluir</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="3" style="color:red">Erro ao carregar dados.</td></tr>';
        console.error('Erro:', error);
    }
}

// 2. PREPARAR EDIÇÃO (FRONTEND ONLY)
function fillForm(id, nome, email) {
    document.getElementById('userId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    
    document.getElementById('btnSave').innerText = "Atualizar Usuário";
    document.getElementById('btnSave').style.backgroundColor = "#007bff";
    document.getElementById('btnCancel').style.display = "inline-block";
}

// 3. SALVAR OU ATUALIZAR (POST / PUT)
async function saveUser() {
    const id = document.getElementById('userId').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    if (!nome || !email) return alert("Preencha nome e e-mail.");

    const userData = { nome, email };
    const btn = document.getElementById('btnSave');
    
    // Feedback visual de carregamento
    btn.disabled = true;
    btn.innerText = "Processando...";

    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            resetForm();
            getUsers();
        } else {
            alert("Erro na API: " + response.status);
        }
    } catch (error) {
        alert("Erro de conexão com o servidor.");
    } finally {
        btn.disabled = false;
        btn.innerText = id ? "Atualizar Usuário" : "Salvar Usuário";
    }
}

// 4. EXCLUIR (DELETE)
async function deleteUser(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                getUsers();
            } else {
                alert("Não foi possível excluir.");
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// 5. LIMPAR FORMULÁRIO
function resetForm() {
    document.getElementById('userId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    
    document.getElementById('btnSave').innerText = "Salvar Usuário";
    document.getElementById('btnSave').style.backgroundColor = "#28a745";
    document.getElementById('btnCancel').style.display = "none";
}

// Iniciar a lista ao abrir a página
getUsers();
