# 🚀 Quick Start - Deploy Checklist

## ✅ Pré-Deploy (Faça isso ANTES de fazer deploy)

### 1. Instalar Novas Dependências
```bash
npm install
```

### 2. Gerar SESSION_SECRET Forte
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
**Copie o resultado e guarde em local seguro!**

### 3. Configurar Discord Application

1. Acesse: https://discord.com/developers/applications
2. Selecione ou crie sua aplicação
3. Vá em **OAuth2** → **General**
4. Adicione em **Redirects**:
   ```
   https://SEU-APP.onrender.com/auth/discord/callback
   ```
5. Copie **Client ID** e **Client Secret**

### 4. Testar Localmente

```bash
# Copiar .env.example para .env
cp .env.example .env

# Editar .env com suas credenciais
# Depois rodar:
npm run dev
```

Acesse: http://localhost:3000/health
Deve retornar: `{"status":"ok",...}`

---

## 🌐 Deploy no Render.com

### 1. Push para GitHub

```bash
git add .
git commit -m "Preparação para deploy com segurança"
git push origin main
```

### 2. Criar Web Service no Render

1. Acesse: https://render.com
2. **New +** → **Web Service**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** `newgame-hub` (ou seu nome preferido)
   - **Environment:** `Node`
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (ou Starter)

### 3. Configurar Environment Variables

No Render Dashboard, vá em **Environment** e adicione:

```
NODE_ENV=production
PORT=10000
SESSION_SECRET=<cole-o-secret-gerado-no-passo-2>
CLIENT_ID=<seu-discord-client-id>
CLIENT_SECRET=<seu-discord-client-secret>
REDIRECT_URI=https://SEU-APP.onrender.com/auth/discord/callback
FRONTEND_URL=https://SEU-APP.onrender.com
```

**⚠️ IMPORTANTE:** Substitua `SEU-APP` pelo nome real da sua aplicação no Render!

### 4. Deploy!

Clique em **Create Web Service** e aguarde o deploy.

---

## ✅ Pós-Deploy (Verifique se tudo está funcionando)

### 1. Health Check
```
https://SEU-APP.onrender.com/health
```
Deve retornar: `{"status":"ok",...}`

### 2. Testar Login Discord
1. Acesse: `https://SEU-APP.onrender.com`
2. Clique em "Entrar com Discord"
3. Autorize a aplicação
4. Verifique se você foi redirecionado e está logado

### 3. Verificar Logs
No Render Dashboard:
- Vá em **Logs**
- Procure por erros (linhas em vermelho)
- Deve ver: `🚀 Server running on port 10000`

---

## 🔧 Troubleshooting

### Erro: "Application error"
- Verifique logs no Render Dashboard
- Confirme que todas as variáveis de ambiente estão configuradas
- Verifique se `PORT` está usando `process.env.PORT`

### Discord OAuth não funciona
- Confirme que `REDIRECT_URI` no Render é EXATAMENTE igual ao configurado no Discord
- Verifique `CLIENT_ID` e `CLIENT_SECRET`
- URL deve ser HTTPS (Render fornece automaticamente)

### Sessões não persistem
- Verifique se `SESSION_SECRET` está configurado
- Em produção, considere usar Redis ou MongoDB para sessões

### Rate Limit muito restritivo
Edite em `server.js`:
```javascript
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // Aumente este número
    // ...
});
```

---

## 📊 Monitoramento

### Configurar Uptime Monitor (Recomendado)

1. Acesse: https://uptimerobot.com
2. Crie conta gratuita
3. Adicione monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://SEU-APP.onrender.com/health`
   - **Interval:** 5 minutes

Isso mantém sua aplicação "acordada" no plano free do Render.

---

## 🎯 Próximos Passos

- [ ] Configurar banco de dados MongoDB Atlas
- [ ] Adicionar mais features de jogos
- [ ] Implementar sistema de notificações
- [ ] Criar dashboard de admin mais completo
- [ ] Adicionar analytics

---

## 📞 Recursos Úteis

- [Render Docs](https://render.com/docs)
- [Discord OAuth2 Guide](https://discord.com/developers/docs/topics/oauth2)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Atlas Free Tier](https://www.mongodb.com/cloud/atlas/register)

---

**Dúvidas?** Consulte o arquivo `DEPLOY_GUIDE.md` para informações detalhadas.
