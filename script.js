// Global state
let currentUser = null;

// Navigation System
document.addEventListener('DOMContentLoaded', async () => {
    setupNavigation();
    await loadUser();
});

function setupNavigation() {
    // Handle nav link clicks
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            switchSection(sectionId);

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Handle nav triggers (like buttons that navigate)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-trigger')) {
            e.preventDefault();
            const sectionId = e.target.getAttribute('data-section');
            switchSection(sectionId);

            // Update nav link
            navLinks.forEach(l => l.classList.remove('active'));
            const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (targetLink) targetLink.classList.add('active');
        }
    });
}

function switchSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// User Management
async function loadUser() {
    const userArea = document.getElementById('userArea');
    const heroLoginBtn = document.getElementById('heroLoginBtn');
    const dashboard = document.getElementById('dashboard');
    const userPoints = document.getElementById('userPoints');
    const userRole = document.getElementById('userRole');
    const adminPanel = document.getElementById('adminPanel');
    const roleManagement = document.getElementById('roleManagement');

    try {
        const res = await fetch('/api/me');
        if (res.ok) {
            currentUser = await res.json();

            // Update UI for logged in user
            userArea.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${currentUser.avatar}" alt="Avatar" 
                         style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--primary);">
                    <span style="font-weight: 600;">${currentUser.username}</span>
                    <button onclick="logout()" class="btn-small" 
                            style="padding: 8px 16px; font-size: 0.9rem;">
                        Sair
                    </button>
                </div>
            `;

            heroLoginBtn.textContent = "Ir para o Painel";
            heroLoginBtn.href = "#home";
            heroLoginBtn.classList.add('nav-trigger');
            heroLoginBtn.setAttribute('data-section', 'home');

            // Show Dashboard
            dashboard.classList.remove('hidden');
            userPoints.textContent = currentUser.points || 0;
            userRole.textContent = currentUser.role || 'Membro';

            // Show Admin Panel for high-rank users
            const adminRoles = ['Marechal', 'General'];
            if (currentUser.role && adminRoles.includes(currentUser.role)) {
                adminPanel.classList.remove('hidden');
                roleManagement.classList.remove('hidden');
            }

        } else {
            console.log('User not logged in');
        }
    } catch (err) {
        console.error('Error fetching user:', err);
    }
}

async function logout() {
    try {
        await fetch('/auth/logout');
        window.location.reload();
    } catch (err) {
        console.error('Logout failed', err);
        alert('Falha ao sair. Tente novamente.');
    }
}

// Task Management
async function redeemCode() {
    const codeInput = document.getElementById('redeemCodeInput');
    const code = codeInput.value.trim();

    if (!code) {
        alert('Por favor, digite um código');
        return;
    }

    try {
        const res = await fetch('/api/redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await res.json();

        if (res.ok) {
            alert(`✅ Sucesso! Você ganhou ${data.newPoints || 'pontos'}!`);
            codeInput.value = '';
            await loadUser(); // Refresh user data
        } else {
            alert(`❌ ${data.error || 'Falha ao resgatar código'}`);
        }
    } catch (err) {
        console.error('Error redeeming code:', err);
        alert('❌ Erro ao resgatar código. Tente novamente.');
    }
}

async function createTask() {
    const code = document.getElementById('taskCode').value.trim();
    const points = document.getElementById('taskPoints').value;
    const time = document.getElementById('taskTime').value;

    if (!code || !points || !time) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    try {
        const res = await fetch('/api/create-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, points: parseInt(points), time: parseInt(time) })
        });
        const data = await res.json();

        if (res.ok) {
            alert(`✅ Tarefa criada com sucesso!\nCódigo: ${code}\nPontos: ${points}\nExpira em: ${time}s`);
            // Clear inputs
            document.getElementById('taskCode').value = '';
            document.getElementById('taskPoints').value = '';
            document.getElementById('taskTime').value = '';
        } else {
            alert(`❌ ${data.error || 'Falha ao criar tarefa'}`);
        }
    } catch (err) {
        console.error('Error creating task:', err);
        alert('❌ Erro ao criar tarefa. Tente novamente.');
    }
}

// Role Management
async function assignRole() {
    const userId = document.getElementById('targetUserId').value.trim();
    const role = document.getElementById('roleSelect').value;

    if (!userId || !role) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    try {
        const res = await fetch('/api/assign-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role })
        });
        const data = await res.json();

        if (res.ok) {
            alert(`✅ Cargo "${role}" atribuído ao usuário ${userId}!`);
            document.getElementById('targetUserId').value = '';
            document.getElementById('roleSelect').value = '';
        } else {
            alert(`❌ ${data.error || 'Falha ao atribuir cargo'}`);
        }
    } catch (err) {
        console.error('Error assigning role:', err);
        alert('❌ Erro ao atribuir cargo. Tente novamente.');
    }
}

// Community Features
function showLeaderboard() {
    const leaderboardSection = document.getElementById('leaderboardSection');
    const leaderboardList = document.getElementById('leaderboardList');

    // Toggle visibility
    if (leaderboardSection.classList.contains('hidden')) {
        leaderboardSection.classList.remove('hidden');

        // Fetch leaderboard data
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => {
                if (data.leaderboard && data.leaderboard.length > 0) {
                    leaderboardList.innerHTML = data.leaderboard.map((user, index) => `
                        <div class="leaderboard-item">
                            <div class="leaderboard-rank">#${index + 1}</div>
                            <div class="leaderboard-user">
                                <strong>${user.username}</strong>
                                <div style="color: var(--text-muted); font-size: 0.9rem;">${user.role || 'Membro'}</div>
                            </div>
                            <div class="leaderboard-points">${user.points || 0} pts</div>
                        </div>
                    `).join('');
                } else {
                    leaderboardList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Nenhum jogador ainda. Seja o primeiro!</p>';
                }
            })
            .catch(err => {
                console.error('Error fetching leaderboard:', err);
                leaderboardList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Erro ao carregar classificação</p>';
            });
    } else {
        leaderboardSection.classList.add('hidden');
    }
}

function showAnnouncements() {
    alert('📢 Anúncios:\n\n• Bem-vindo ao NewGamE Hub!\n• Complete tarefas diárias para ganhar pontos\n• Junte-se à nossa comunidade Discord\n• Mais recursos em breve!');
}

// Expose functions to window for onclick events
window.logout = logout;
window.redeemCode = redeemCode;
window.createTask = createTask;
window.assignRole = assignRole;
window.showLeaderboard = showLeaderboard;
window.showAnnouncements = showAnnouncements;
