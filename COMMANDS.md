# 🛠️ Comandos Úteis - NewGamE Hub

## 📦 NPM Commands

### Desenvolvimento
```bash
# Instalar todas as dependências
npm install

# Rodar em modo desenvolvimento (com auto-reload)
npm run dev

# Rodar em modo produção
npm start
```

### Manutenção
```bash
# Verificar pacotes desatualizados
npm outdated

# Atualizar pacotes
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades automáticas
npm audit fix
```

---

## 🔐 Segurança

### Gerar SESSION_SECRET
```bash
# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Linux/Mac
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Gerar UUID (para IDs únicos)
```bash
node -e "console.log(require('crypto').randomUUID())"
```

---

## 🐙 Git Commands

### Preparar para Deploy
```bash
# Ver status
git status

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Preparação para deploy com segurança"

# Push para GitHub
git push origin main
```

### Criar Branch de Desenvolvimento
```bash
# Criar e mudar para branch dev
git checkout -b dev

# Push da branch dev
git push -u origin dev

# Voltar para main
git checkout main
```

### Desfazer Mudanças
```bash
# Descartar mudanças não commitadas
git checkout -- .

# Voltar último commit (mantém mudanças)
git reset --soft HEAD~1

# Voltar último commit (descarta mudanças)
git reset --hard HEAD~1
```

---

## 🌐 Render.com CLI (Opcional)

### Instalar Render CLI
```bash
npm install -g @render/cli
```

### Comandos Render
```bash
# Login
render login

# Listar serviços
render services list

# Ver logs em tempo real
render logs <service-id>

# Deploy manual
render deploy <service-id>
```

---

## 🔍 Debug e Testes

### Testar Endpoints Localmente

#### Health Check
```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri http://localhost:3000/health

# Linux/Mac
curl http://localhost:3000/health
```

#### Testar API com dados
```bash
# Resgatar código (precisa estar logado)
curl -X POST http://localhost:3000/api/redeem \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST123"}' \
  --cookie "sessionId=..."
```

### Ver Logs
```bash
# Logs do servidor (se usando PM2)
pm2 logs

# Logs do Render (via dashboard)
# Acesse: https://dashboard.render.com
```

---

## 📊 Monitoramento

### Verificar Uso de Memória
```bash
node -e "console.log(process.memoryUsage())"
```

### Verificar Uptime
```bash
# No servidor rodando
node -e "console.log('Uptime:', process.uptime(), 'seconds')"
```

### Testar Rate Limiting
```bash
# Fazer múltiplas requisições rápidas
for i in {1..20}; do curl http://localhost:3000/health; done
```

---

## 🗄️ MongoDB (Quando implementar)

### Conectar ao MongoDB Atlas
```bash
# Instalar MongoDB Compass (GUI)
# Download: https://www.mongodb.com/try/download/compass

# Ou usar CLI
mongosh "mongodb+srv://cluster.mongodb.net/newgame-hub" --username <user>
```

### Backup do Banco
```bash
# Exportar dados
mongodump --uri="mongodb+srv://..." --out=./backup

# Importar dados
mongorestore --uri="mongodb+srv://..." ./backup
```

---

## 🧪 Testes (Para implementar)

### Instalar Jest
```bash
npm install --save-dev jest supertest
```

### Rodar Testes
```bash
# Rodar todos os testes
npm test

# Rodar com coverage
npm test -- --coverage

# Rodar em watch mode
npm test -- --watch
```

---

## 🐳 Docker (Opcional - Para deploy avançado)

### Criar Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Comandos Docker
```bash
# Build
docker build -t newgame-hub .

# Run
docker run -p 3000:3000 --env-file .env newgame-hub

# Docker Compose
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Limpar Cache do NPM
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Verificar Porta em Uso
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

### Matar Processo na Porta
```bash
# Windows (PowerShell como Admin)
Stop-Process -Id <PID> -Force

# Linux/Mac
kill -9 <PID>
```

---

## 📝 Logs e Debug

### Ativar Debug Mode
```bash
# Windows
$env:DEBUG="*"
npm run dev

# Linux/Mac
DEBUG=* npm run dev
```

### Ver Variáveis de Ambiente
```bash
# Windows (PowerShell)
Get-ChildItem Env:

# Linux/Mac
printenv
```

---

## 🚀 Deploy Rápido

### One-liner para Deploy
```bash
git add . && git commit -m "Update" && git push origin main
```

### Verificar Deploy no Render
```bash
# Health check
curl https://seu-app.onrender.com/health

# Ver headers de segurança
curl -I https://seu-app.onrender.com
```

---

## 🎯 Comandos Personalizados (Adicionar ao package.json)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write .",
    "logs": "tail -f logs/combined.log",
    "generate-secret": "node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
  }
}
```

Depois pode usar:
```bash
npm run generate-secret
npm run logs
npm run format
```

---

## 📚 Recursos Úteis

### Documentação
- [Express.js](https://expressjs.com/)
- [Discord.js](https://discord.js.org/)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)

### Ferramentas Online
- [JWT Debugger](https://jwt.io/)
- [JSON Formatter](https://jsonformatter.org/)
- [Regex Tester](https://regex101.com/)
- [Base64 Encode/Decode](https://www.base64encode.org/)

---

**Dica:** Salve este arquivo como referência rápida! 📌
