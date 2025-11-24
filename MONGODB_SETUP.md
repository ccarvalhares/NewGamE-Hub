# 🍃 Guia de Configuração MongoDB Atlas

Para que o sistema funcione com banco de dados, você precisa criar um cluster gratuito no MongoDB Atlas.

## Passo 1: Criar Conta e Cluster

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Crie uma conta gratuita.
3. Escolha o plano **M0 (Free)**.
4. Selecione um provedor (AWS, Google Cloud, Azure) e região (recomendado: us-east-1).
5. Clique em **Create**.

## Passo 2: Configurar Acesso

1. **Database Access:**
   - Crie um usuário e senha (ex: `admin` / `senhaForte123`).
   - **Guarde a senha!** Você vai precisar dela.

2. **Network Access:**
   - Clique em **Add IP Address**.
   - Selecione **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Isso é necessário para o Render.com conectar.

## Passo 3: Obter Connection String

1. No dashboard do cluster, clique em **Connect**.
2. Selecione **Drivers**.
3. Copie a string de conexão. Ela se parece com isso:
   ```
   mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```

## Passo 4: Configurar no Projeto

### Localmente
1. Abra o arquivo `.env`.
2. Adicione ou edite a linha `MONGODB_URI`:
   ```env
   MONGODB_URI=mongodb+srv://admin:SUA_SENHA_AQUI@cluster0.abcde.mongodb.net/newgame-hub?retryWrites=true&w=majority
   ```
   *(Substitua `<password>` pela sua senha real)*

### No Render.com
1. Vá no Dashboard do seu serviço.
2. Clique em **Environment**.
3. Adicione uma nova variável:
   - **Key:** `MONGODB_URI`
   - **Value:** (Sua string de conexão completa)

## Passo 5: Verificar

1. Rode `npm run dev` localmente.
2. Você deve ver no terminal:
   ```
   [info]: MongoDB Connected: cluster0.abcde.mongodb.net
   ```

---

**Problemas Comuns:**
- **Erro de autenticação:** Verifique se a senha está correta (sem caracteres especiais que quebrem a URL, ou use URL encoding).
- **Erro de conexão:** Verifique se o IP `0.0.0.0/0` foi adicionado no Network Access.
