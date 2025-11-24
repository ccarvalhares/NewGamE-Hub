# 🚀 Guia de Deploy Seguro no Render.com - NewGamE Hub

## 📋 Índice
1. [Preparação do Projeto](#preparação-do-projeto)
2. [Segurança - Configurações Essenciais](#segurança---configurações-essenciais)
3. [Deploy no Render.com](#deploy-no-rendercom)
4. [Configuração do Discord OAuth](#configuração-do-discord-oauth)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Melhorias de Segurança Pós-Deploy](#melhorias-de-segurança-pós-deploy)
7. [Monitoramento e Manutenção](#monitoramento-e-manutenção)

---

## 🔧 Preparação do Projeto

### 1. Estrutura de Arquivos Necessária

Certifique-se de que seu projeto tenha:
- ✅ `package.json` com script de start
- ✅ `.gitignore` configurado (não commitar `.env`)
- ✅ `server.js` como entry point
- ✅ Todas as dependências listadas em `package.json`

### 2. Criar arquivo `render.yaml` (Opcional mas Recomendado)

Este arquivo automatiza o deploy:

```yaml
services:
  - type: web
    name: newgame-hub
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

---

## 🔒 Segurança - Configurações Essenciais

### 1. Proteção de Sessões

**Problema Atual:** Seu `SESSION_SECRET` está hardcoded como 'secret'

**Solução:** Usar variável de ambiente forte

```javascript
// No server.js, linha 15
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Mudado para false por segurança
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only em produção
        httpOnly: true, // Previne XSS
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
        sameSite: 'lax' // Proteção CSRF
    }
}));
```

### 2. Helmet.js - Proteção de Headers HTTP

Instalar:
```bash
npm install helmet
```

Adicionar ao `server.js`:
```javascript
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "https://cdn.discordapp.com", "data:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"]
        }
    }
}));
```

### 3. Rate Limiting - Prevenir Abuso

Instalar:
```bash
npm install express-rate-limit
```

Adicionar ao `server.js`:
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiter geral
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// Rate limiter para APIs sensíveis
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Limite de requisições excedido.'
});

app.use('/api/', apiLimiter);
app.use(generalLimiter);
```

### 4. CORS - Controle de Origem

Instalar:
```bash
npm install cors
```

Adicionar ao `server.js`:
```javascript
const cors = require('cors');

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'https://seu-app.onrender.com',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 5. Validação de Entrada

Instalar:
```bash
npm install express-validator
```

Exemplo de uso em rotas:
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/redeem',
    body('code').trim().isLength({ min: 3, max: 50 }).escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // ... resto do código
    }
);
```

---

## 🌐 Deploy no Render.com

### Passo 1: Preparar o Repositório GitHub

1. **Commit todas as mudanças:**
```bash
git add .
git commit -m "Preparação para deploy no Render"
git push origin main
```

2. **Verificar `.gitignore`:**
```
node_modules/
.env
.DS_Store
*.log
.vscode/
```

### Passo 2: Criar Web Service no Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** `newgame-hub`
   - **Environment:** `Node`
   - **Region:** Escolha o mais próximo (US East geralmente)
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (ou Starter para melhor performance)

### Passo 3: Configurar Variáveis de Ambiente

No painel do Render, vá em **Environment** e adicione:

```
NODE_ENV=production
PORT=10000
SESSION_SECRET=<gerar-string-aleatoria-forte-64-caracteres>
CLIENT_ID=<seu-discord-client-id>
CLIENT_SECRET=<seu-discord-client-secret>
REDIRECT_URI=https://seu-app.onrender.com/auth/discord/callback
FRONTEND_URL=https://seu-app.onrender.com
```

**⚠️ IMPORTANTE:** Gerar `SESSION_SECRET` forte:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🎮 Configuração do Discord OAuth

### 1. Criar/Configurar Discord Application

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecione sua aplicação ou crie uma nova
3. Vá em **OAuth2** → **General**

### 2. Configurar Redirects

Adicione as seguintes URLs em **Redirects:**

```
https://seu-app.onrender.com/auth/discord/callback
http://localhost:3000/auth/discord/callback (para desenvolvimento)
```

### 3. Copiar Credenciais

- **Client ID:** Copie e adicione nas variáveis de ambiente
- **Client Secret:** Clique em "Reset Secret", copie e adicione nas variáveis

### 4. Configurar Scopes

No OAuth2 URL Generator, selecione:
- ✅ `identify`
- ✅ `email`
- ✅ `guilds` (se precisar verificar servidor)

---

## 🔐 Variáveis de Ambiente

### Desenvolvimento (`.env` local)

```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=dev-secret-change-in-production
CLIENT_ID=seu_discord_client_id
CLIENT_SECRET=seu_discord_client_secret
REDIRECT_URI=http://localhost:3000/auth/discord/callback
FRONTEND_URL=http://localhost:3000
```

### Produção (Render.com)

```env
NODE_ENV=production
PORT=10000
SESSION_SECRET=<64-char-random-hex>
CLIENT_ID=<discord-client-id>
CLIENT_SECRET=<discord-client-secret>
REDIRECT_URI=https://seu-app.onrender.com/auth/discord/callback
FRONTEND_URL=https://seu-app.onrender.com
```

---

## 🛡️ Melhorias de Segurança Pós-Deploy

### 1. Banco de Dados Persistente

**Problema:** Dados em memória são perdidos ao reiniciar

**Solução:** Usar MongoDB Atlas (Free Tier)

1. Criar conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Criar cluster gratuito
3. Obter connection string
4. Adicionar ao Render:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/newgame-hub
   ```

5. Instalar Mongoose:
   ```bash
   npm install mongoose
   ```

### 2. Middleware de Autenticação

Criar `src/middleware/auth.js`:

```javascript
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Não autorizado' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Não autorizado' });
    }
    
    const adminRoles = ['Marechal', 'General'];
    if (!adminRoles.includes(req.session.user.role)) {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
}

module.exports = { requireAuth, requireAdmin };
```

Usar nas rotas:
```javascript
const { requireAuth, requireAdmin } = require('./src/middleware/auth');

app.post('/api/redeem', requireAuth, guildController.redeemCode);
app.post('/api/create-task', requireAdmin, guildController.createTask);
app.post('/api/assign-role', requireAdmin, guildController.assignRole);
```

### 3. Logging e Monitoramento

Instalar Winston:
```bash
npm install winston
```

Criar `src/utils/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

module.exports = logger;
```

### 4. Health Check Endpoint

Adicionar ao `server.js`:
```javascript
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
```

---

## 📊 Monitoramento e Manutenção

### 1. Render Dashboard

- **Logs:** Acesse em tempo real no painel do Render
- **Metrics:** Monitore CPU, memória e requisições
- **Auto-deploy:** Configure para deploy automático no push

### 2. Uptime Monitoring

Use serviços gratuitos:
- [UptimeRobot](https://uptimerobot.com) - Ping a cada 5 minutos
- [Freshping](https://www.freshworks.com/website-monitoring/)

Configure para monitorar:
```
https://seu-app.onrender.com/health
```

### 3. Error Tracking (Opcional)

Para produção séria, considere:
- [Sentry](https://sentry.io) - Free tier disponível
- Captura erros automaticamente
- Notificações em tempo real

---

## 🎨 Landing Page Simples

Sua landing page atual já está boa! Mas aqui estão sugestões para simplificar:

### Elementos Essenciais:
1. **Hero Section:**
   - Logo + Slogan
   - Botão "Entrar com Discord" (destaque)
   - Imagem/animação simples

2. **Features (3-4 cards):**
   - 🎮 Jogos
   - 🏆 Recompensas
   - 👥 Comunidade
   - 📊 Rankings

3. **Call-to-Action:**
   - Botão Discord novamente
   - Link para servidor Discord

### Remover/Simplificar:
- ❌ Explicações longas
- ❌ Múltiplas seções antes do login
- ✅ Foco em "entrar e descobrir"

---

## ✅ Checklist Final de Deploy

Antes de fazer deploy, verifique:

- [ ] `.env` não está no Git
- [ ] `SESSION_SECRET` é forte e único
- [ ] Discord OAuth configurado com URL de produção
- [ ] Helmet.js instalado e configurado
- [ ] Rate limiting implementado
- [ ] CORS configurado corretamente
- [ ] Middleware de autenticação em rotas sensíveis
- [ ] Health check endpoint criado
- [ ] Logs configurados
- [ ] MongoDB Atlas configurado (se usando)
- [ ] Variáveis de ambiente no Render configuradas
- [ ] Teste local funcionando
- [ ] README atualizado com instruções

---

## 🚨 Troubleshooting Comum

### Erro: "Application error" no Render
- Verifique logs no dashboard
- Confirme que `PORT` está usando `process.env.PORT`
- Verifique se todas as dependências estão em `package.json`

### Discord OAuth não funciona
- Confirme REDIRECT_URI exato no Discord Developer Portal
- Verifique CLIENT_ID e CLIENT_SECRET
- Certifique-se de que a URL está em HTTPS

### Sessões não persistem
- Verifique se cookies estão habilitados
- Confirme `cookie.secure` está correto para ambiente
- Use store de sessão (Redis/MongoDB) para produção séria

---

## 📞 Próximos Passos

1. **Implementar as melhorias de segurança**
2. **Fazer deploy no Render**
3. **Testar autenticação Discord**
4. **Configurar monitoramento**
5. **Adicionar banco de dados persistente**
6. **Implementar features de jogos**

---

**Dúvidas?** Consulte:
- [Render Docs](https://render.com/docs)
- [Discord OAuth2 Docs](https://discord.com/developers/docs/topics/oauth2)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
