# 📋 Lista de Pendências Prioritária

Siga esta ordem exata para finalizar o projeto.

## 1. 🔴 CRÍTICO: Configurar Banco de Dados
O servidor **não iniciará** sem isso.
1. Crie um cluster gratuito no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Crie um usuário (Database Access) e libere o IP `0.0.0.0/0` (Network Access).
3. Pegue a string de conexão (Connect -> Drivers).
4. No arquivo `.env`, preencha `MONGODB_URI`.
   - *Guia detalhado:* `MONGODB_SETUP.md`

## 2. 🟠 IMPORTANTE: Configurar Discord Login
Necessário para entrar no site.
1. Vá no [Discord Developer Portal](https://discord.com/developers/applications).
2. Crie uma aplicação -> OAuth2.
3. Adicione Redirects:
   - Local: `http://localhost:3000/auth/discord/callback`
   - Produção: `https://SEU-APP.onrender.com/auth/discord/callback`
4. No arquivo `.env`, preencha `CLIENT_ID` e `CLIENT_SECRET`.

## 3. 🟡 NECESSÁRIO: Teste Local
Garanta que funciona antes de subir.
1. Abra o terminal no VS Code.
2. Rode: `npm run dev`
3. Acesse `http://localhost:3000`.
4. Tente logar e ver se o usuário aparece no MongoDB (Collections).

## 4. 🟢 FINAL: Deploy no Render.com
Colocar o site no ar.
1. Faça commit de tudo:
   ```bash
   git add .
   git commit -m "Pronto para deploy"
   git push origin main
   ```
2. No Render.com, crie "Web Service".
3. Conecte o GitHub.
4. Adicione as Variáveis de Ambiente (copie do seu `.env`):
   - `MONGODB_URI`
   - `SESSION_SECRET`
   - `CLIENT_ID`
   - `CLIENT_SECRET`
   - `REDIRECT_URI` (Use o link https do render)
   - `FRONTEND_URL` (Use o link https do render)

## 5. 🔵 MELHORIA: Landing Page (Opcional)
Se quiser simplificar o visual como conversamos.
- Edite `index.html` para esconder seções antes do login.
- *Guia de design:* `LANDING_PAGE_GUIDE.md`
