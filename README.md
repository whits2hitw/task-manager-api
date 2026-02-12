## 🚀 Como Executar o Projeto

### 1. Clonar o repositório e instalar dependências

\`\`\`bash
git clone https://github.com/seu-usuario/task-manager-api.git
cd task-manager-api
npm install
\`\`\`

### 2. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto seguindo o modelo:
\`\`\`bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_aqui"
PORT=3333
\`\`\`

### 2. Rodar as migrações do banco de dados
\`\`\`bash
npx prisma migrate dev
\`\`\`

### 2. Iniciar o servidor em modo de desenvolvimento
Crie um arquivo .env na raiz do projeto seguindo o modelo:
\`\`\`bash
npm run dev
\`\`\`

## 🧪 Como Rodar os Testes

Para garantir que todos os requisitos foram cumpridos e os endpoints críticos estão funcionando:

### Executar todos os testes uma única vez
\`\`\`bash
npm test
\`\`\`

### Executar testes em modo "Watch" (Desenvolvimento)
\`\`\`bash
npm run test:watch
\`\`\`

## 📑 Documentação dos Endpoints

🔐 Autenticação e Usuários
POST /sessions: Cadastro de novo usuário.

POST /sessions: Login e geração do Token JWT.

👥 Times (Teams) - Somente Admin
POST /teams: Criação de novo time.

GET /teams: Listagem de times.

📝 Tarefas (Tasks)
POST /tasks: Criar tarefa (Admin).

GET /tasks: Listar tarefas (Filtros: ?status=pending&priority=high).

PUT /tasks/:id: Atualizar dados ou status da tarefa (Admin).

DELETE /tasks/:id: Remover tarefa e histórico vinculado (Admin).

📊 Dashboard e Histórico
GET /tasks/:taskId/history: Linha do tempo de alterações da tarefa.

GET /dashboard/stats: Estatísticas gerais de tarefas.

### ☁️ Link de Deploy
O projeto pode ser acessado em: []