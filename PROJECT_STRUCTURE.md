# 📁 Estrutura do Projeto - NewGamE Hub

## 🌳 Árvore de Diretórios

```
NewGamE Hub/
├── 📄 server.js                    # Servidor principal (refatorado com segurança)
├── 📄 package.json                 # Dependências e scripts
├── 📄 package-lock.json            # Lock de versões
├── 📄 .env                         # Variáveis de ambiente (NÃO commitar!)
├── 📄 .env.example                 # Exemplo de variáveis
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
├── 📄 render.yaml                  # Configuração do Render.com
│
├── 📄 index.html                   # Frontend principal
├── 📄 style.css                    # Estilos
├── 📄 script.js                    # JavaScript do frontend
│
├── 📚 DOCUMENTAÇÃO/
│   ├── 📄 README.md                # Documentação principal
│   ├── 📄 DEPLOY_GUIDE.md          # Guia completo de deploy
│   ├── 📄 QUICK_START.md           # Checklist rápido
│   ├── 📄 SUMMARY.md               # Resumo executivo
│   ├── 📄 LANDING_PAGE_GUIDE.md    # Sugestões de UX
│   ├── 📄 COMMANDS.md              # Comandos úteis
│   └── 📄 PROJECT_STRUCTURE.md     # Este arquivo
│
├── 📁 src/                         # Código fonte do backend
│   ├── 📁 controllers/             # Controladores
│   │   ├── authController.js       # Autenticação Discord
│   │   └── guildController.js      # Lógica de tarefas/pontos
│   │
│   ├── 📁 middleware/              # Middlewares
│   │   └── auth.js                 # Autenticação e autorização ✨ NOVO
│   │
│   ├── 📁 models/                  # Modelos de dados
│   │   ├── Task.js                 # Modelo de tarefas
│   │   └── User.js                 # Modelo de usuários
│   │
│   ├── 📁 routes/                  # Rotas (se separar do server.js)
│   │   ├── authRoutes.js
│   │   └── apiRoutes.js
│   │
│   ├── 📁 services/                # Serviços
│   │   └── discordService.js       # Integração com Discord API
│   │
│   ├── 📁 utils/                   # Utilitários
│   │   └── logger.js               # Sistema de logging ✨ NOVO
│   │
│   └── 📁 config/                  # Configurações
│       └── database.js             # Config do banco (quando implementar)
│
├── 📁 public/                      # Arquivos públicos (opcional)
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── 📁 logs/                        # Logs (criado automaticamente)
│   ├── error.log
│   └── combined.log
│
└── 📁 node_modules/                # Dependências (NÃO commitar!)
```

---

## 📦 Dependências Principais

### Produção (`dependencies`)
```json
{
  "express": "^4.18.2",           // Framework web
  "express-session": "^1.17.3",   // Gerenciamento de sessões
  "dotenv": "^16.3.1",            // Variáveis de ambiente
  "axios": "^1.6.0",              // HTTP client (Discord API)
  "body-parser": "^1.20.2",       // Parse de requisições
  
  // ✨ SEGURANÇA (Novas)
  "helmet": "^7.1.0",             // Proteção de headers
  "cors": "^2.8.5",               // Controle de origem
  "express-rate-limit": "^7.1.5", // Rate limiting
  "express-validator": "^7.0.1",  // Validação de entrada
  "winston": "^3.11.0"            // Logging profissional
}
```

### Desenvolvimento (`devDependencies`)
```json
{
  "nodemon": "^3.0.1"             // Auto-reload em desenvolvimento
}
```

---

## 🔐 Arquivos de Segurança

### `.env` (Local - NÃO commitar!)
```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=dev-secret-change-in-production
CLIENT_ID=your_discord_client_id
CLIENT_SECRET=your_discord_client_secret
REDIRECT_URI=http://localhost:3000/auth/discord/callback
FRONTEND_URL=http://localhost:3000
```

### `.gitignore`
```
node_modules/
.env
.DS_Store
*.log
logs/
.vscode/
```

---

## 🛣️ Rotas da Aplicação

### Frontend (HTML)
```
GET  /                  → index.html (Landing/App)
GET  /style.css         → Estilos
GET  /script.js         → JavaScript
```

### Autenticação
```
GET  /auth/discord              → Redireciona para Discord OAuth
GET  /auth/discord/callback     → Callback do Discord
GET  /auth/logout               → Logout do usuário
GET  /api/me                    → Dados do usuário atual
```

### API Pública
```
GET  /api/leaderboard           → Classificação de jogadores
GET  /health                    → Health check
```

### API Protegida (Requer Login)
```
POST /api/redeem                → Resgatar código de tarefa
```

### API Admin (Requer Marechal/General)
```
POST /api/create-task           → Criar nova tarefa
POST /api/assign-role           → Atribuir cargo a usuário
```

---

## 🎯 Fluxo de Dados

### 1. Autenticação Discord
```
Usuário → /auth/discord 
       → Discord OAuth 
       → /auth/discord/callback 
       → Session criada 
       → Redirect para /
```

### 2. Resgatar Código
```
Frontend → POST /api/redeem {code}
        → requireAuth middleware
        → guildController.redeemCode
        → Validar código
        → Adicionar pontos
        → Retornar sucesso
```

### 3. Criar Tarefa (Admin)
```
Frontend → POST /api/create-task {code, points, time}
        → requireAdmin middleware
        → guildController.createTask
        → Criar tarefa em memória
        → Retornar sucesso
```

---

## 🔒 Camadas de Segurança

### Nível 1: Headers HTTP (Helmet)
- Content Security Policy
- XSS Protection
- Clickjacking Prevention
- MIME Sniffing Prevention

### Nível 2: Rate Limiting
- Geral: 100 req/15min
- API: 50 req/15min
- Auth: 10 req/hora

### Nível 3: CORS
- Apenas domínio autorizado
- Credentials habilitados

### Nível 4: Sessões
- HttpOnly cookies
- Secure em produção
- SameSite protection

### Nível 5: Autenticação
- requireAuth: Verifica login
- requireAdmin: Verifica role
- requireModerator: Verifica permissões

### Nível 6: Logging
- Todas as requisições logadas
- Erros rastreados
- Ações de admin registradas

---

## 📊 Armazenamento de Dados

### Atual (Em Memória)
```javascript
// Em guildController.js
const tasks = new Map();      // Tarefas temporárias
const users = new Map();      // Dados de usuários
```

**Limitação:** Dados são perdidos ao reiniciar servidor

### Futuro (MongoDB)
```javascript
// Models
User: { discordId, username, avatar, points, role }
Task: { code, points, expiresAt, createdBy }
Redemption: { userId, taskId, redeemedAt }
```

---

## 🎨 Frontend - Estrutura

### Seções
1. **Home** (`#home`)
   - Hero (visitantes)
   - Dashboard (usuários logados)

2. **Games** (`#games`)
   - Lista de jogos disponíveis
   - Visível apenas após login (sugestão)

3. **Community** (`#community`)
   - Link Discord
   - Leaderboard
   - Anúncios

### Componentes Principais
```javascript
// script.js
- setupNavigation()      // Sistema de navegação
- loadUser()             // Carregar dados do usuário
- redeemCode()           // Resgatar código
- createTask()           // Criar tarefa (admin)
- assignRole()           // Atribuir cargo (admin)
- showLeaderboard()      // Mostrar classificação
```

---

## 🚀 Scripts NPM

```json
{
  "start": "node server.js",        // Produção
  "dev": "nodemon server.js"        // Desenvolvimento
}
```

### Adicionar (Sugestão)
```json
{
  "test": "jest",
  "lint": "eslint .",
  "format": "prettier --write .",
  "generate-secret": "node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
}
```

---

## 🌍 Ambientes

### Desenvolvimento (Local)
- `NODE_ENV=development`
- Logs detalhados
- Auto-reload (nodemon)
- Cookies não-secure

### Produção (Render.com)
- `NODE_ENV=production`
- Logs otimizados
- Cookies secure (HTTPS)
- Rate limiting ativo

---

## 📝 Convenções de Código

### Nomenclatura
- **Arquivos:** camelCase.js
- **Componentes:** PascalCase
- **Variáveis:** camelCase
- **Constantes:** UPPER_CASE

### Estrutura de Funções
```javascript
/**
 * Descrição da função
 * @param {Type} param - Descrição
 * @returns {Type} Descrição
 */
async function functionName(param) {
    // Código
}
```

### Tratamento de Erros
```javascript
try {
    // Código
} catch (err) {
    logger.error('Mensagem', { error: err.message });
    res.status(500).json({ error: 'Mensagem amigável' });
}
```

---

## 🔄 Workflow de Desenvolvimento

1. **Criar feature branch**
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. **Desenvolver e testar**
   ```bash
   npm run dev
   ```

3. **Commit**
   ```bash
   git add .
   git commit -m "feat: descrição da feature"
   ```

4. **Merge para main**
   ```bash
   git checkout main
   git merge feature/nome-da-feature
   ```

5. **Deploy automático** (Render detecta push)

---

## 📚 Documentação Relacionada

- **DEPLOY_GUIDE.md** - Como fazer deploy
- **QUICK_START.md** - Checklist rápido
- **SUMMARY.md** - Resumo das implementações
- **COMMANDS.md** - Comandos úteis
- **LANDING_PAGE_GUIDE.md** - Melhorias de UX

---

## ✅ Checklist de Manutenção

### Semanal
- [ ] Verificar logs de erro
- [ ] Monitorar uptime
- [ ] Revisar rate limiting

### Mensal
- [ ] Atualizar dependências (`npm update`)
- [ ] Verificar vulnerabilidades (`npm audit`)
- [ ] Backup de dados (quando tiver DB)

### Trimestral
- [ ] Revisar políticas de segurança
- [ ] Atualizar documentação
- [ ] Análise de performance

---

**Última atualização:** 2024-11-24
**Versão:** 1.0.0
