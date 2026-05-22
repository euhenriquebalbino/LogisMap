# LogisMap — Dashboard de Gestão Logística

Evolução do LogisMap para uma aplicação full stack completa contendo back-end em Node.js (Express), banco de dados local SQLite (`better-sqlite3`), mapa interativo dinâmico (Leaflet) e interfaces administrativas completas (CRUD) de equipes e obras.

---

## 🚀 Tecnologias Utilizadas

- **Back-end**: Node.js + Express.js
- **Banco de Dados**: SQLite (gerenciado com a biblioteca de alta performance `better-sqlite3`)
- **Front-end**: HTML5, CSS3 (com design dark premium customizado) e JavaScript Vanilla (nativo) integrado à Fetch API
- **Mapas**: Leaflet + OpenStreetMap
- **Estilo**: Sem frameworks externos (Bootstrap/Tailwind) para preservar o design original.

---

## 📂 Estrutura do Projeto

```
logismap/
├── server.js              # Servidor Express principal
├── database.js            # Setup do SQLite + semente de dados (Seed)
├── routes/
│   ├── equipes.js         # Endpoints CRUD de Equipes
│   ├── obras.js           # Endpoints CRUD de Obras
│   └── marcadores.js      # Endpoints CRUD de Marcadores no Mapa
├── public/
│   └── index.html         # Front-end dinâmico principal
├── package.json           # Definição de dependências e scripts do projeto
└── README.md              # Documentação do sistema (este arquivo)
```

---

## 🔧 Instalação e Execução

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 16 ou superior) instalado em sua máquina.

### 1. Clonar ou Acessar o Diretório do Projeto
Entre na pasta onde o projeto está localizado:
```bash
cd "LogisMap - INOVA"
```

### 2. Instalar as Dependências
Instale todos os pacotes definidos no `package.json`:
```bash
npm install
```

### 3. Executar o Servidor em Modo de Desenvolvimento
Inicie a aplicação utilizando o script de desenvolvimento (executa com `nodemon` para reiniciar automaticamente em alterações de arquivo):
```bash
npm run dev
```

### 4. Executar em Produção
Para iniciar o servidor normalmente:
```bash
npm start
```

O servidor iniciará por padrão na porta **3000** e poderá ser acessado via navegador em:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📡 Endpoints da API REST

A API responde no formato JSON padrão sob o prefixo `/api/v1/`.

### Formato Geral das Respostas
Em caso de sucesso:
```json
{ "success": true, "data": [...] }
```
Em caso de falha:
```json
{ "success": false, "error": "Mensagem descritiva do erro" }
```

### 👥 Equipes (`/api/v1/equipes`)

- **GET `/api/v1/equipes`**
  Lista todas as equipes cadastradas no sistema.
- **POST `/api/v1/equipes`**
  Cria uma nova equipe.
  - *Payload esperado*: `{ "nome": "Equipe Delta", "responsavel": "Douglas Lima", "status": "ativo" }`
- **PUT `/api/v1/equipes/:id`**
  Atualiza os dados de uma equipe existente.
  - *Payload esperado*: `{ "nome": "Equipe Delta Modificada", "responsavel": "Douglas Lima", "status": "inativo" }`
- **DELETE `/api/v1/equipes/:id`**
  Exclui uma equipe e desvincula quaisquer obras associadas a ela.

### 🔨 Obras (`/api/v1/obras`)

- **GET `/api/v1/obras`**
  Lista todas as obras com o nome da equipe associada.
- **POST `/api/v1/obras`**
  Cria uma nova obra.
  - *Payload esperado*: `{ "nome": "Obra Alphaville", "endereco": "Rod. do Sol, Vila Velha", "equipe_id": 1, "status": "em_andamento" }`
- **PUT `/api/v1/obras/:id`**
  Atualiza uma obra existente.
  - *Payload esperado*: `{ "nome": "Obra Alphaville", "endereco": "Rod. do Sol, Vila Velha", "equipe_id": null, "status": "concluida" }`
- **DELETE `/api/v1/obras/:id`**
  Remove uma obra cadastrada.

### 📍 Marcadores de Mapa (`/api/v1/marcadores`)

- **GET `/api/v1/marcadores`**
  Lista todos os marcadores cadastrados para plotar no mapa.
- **POST `/api/v1/marcadores`**
  Insere um marcador de mapa a partir de coordenadas exatas.
  - *Payload esperado*: `{ "lat": -20.335, "lng": -40.295, "tipo": "obra", "label": "Canteiro Principal" }`
  - *Tipos permitidos*: `"obra"` (vermelho), `"hospedagem"` (azul), `"deposito"` (amarelo), `"veiculo"` (verde).
- **DELETE `/api/v1/marcadores/:id`**
  Remove um marcador do mapa.

### 📊 Dashboard Estatísticas (`/api/v1/dashboard/stats`)

- **GET `/api/v1/dashboard/stats`**
  Retorna um resumo quantitativo de dados do sistema em tempo real:
  ```json
  {
    "success": true,
    "data": {
      "totalEquipes": 3,
      "totalObras": 5,
      "marcadoresAtivos": 2,
      "equipesCampo": 3
    }
  }
  ```

---

## 🎨 Funcionalidades da Interface

1. **Dashboard Dinâmico**: Os KPIs no topo do painel principal e contadores da barra lateral são preenchidos dinamicamente ao consultar a API.
2. **Mapa Operacional Interativo**:
   - Desenha dinamicamente ícones customizados coloridos baseados no tipo do marcador.
   - O botão **"+ Adicionar Ponto"** permite entrar no modo de marcação e, ao clicar em qualquer ponto do mapa, abre um formulário em modal para salvar o local.
   - Apresenta rotas de conexões dinâmicas conectando as obras e hospedagens.
3. **Painéis Administrativos (CRUD)**:
   - Gerenciamento completo de Equipes com tabela interativa, edição de status e exclusão rápida.
   - Gerenciamento completo de Obras com vínculos relacionais (alocação de equipes).
4. **Notificações Toast**: Feedback em tempo real exibido no canto superior direito do navegador para cada sucesso ou falha nas operações.
