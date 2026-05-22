// Servidor principal do LogisMap
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

// Importação das rotas
const equipesRoutes = require('./routes/equipes');
const obrasRoutes = require('./routes/obras');
const marcadoresRoutes = require('./routes/marcadores');
const configuracoesRoutes = require('./routes/configuracoes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servindo a pasta public de forma estática
app.use(express.static(path.join(__dirname, 'public')));

// Registrando rotas da API REST v1
app.use('/api/v1/equipes', equipesRoutes);
app.use('/api/v1/obras', obrasRoutes);
app.use('/api/v1/marcadores', marcadoresRoutes);
app.use('/api/v1/configuracoes', configuracoesRoutes);

// GET /api/v1/dashboard/stats - Retorna as estatísticas do Dashboard
app.get('/api/v1/dashboard/stats', (req, res) => {
  try {
    const totalEquipes = db.prepare('SELECT COUNT(*) as count FROM equipes').get().count;
    const totalObras = db.prepare('SELECT COUNT(*) as count FROM obras').get().count;
    const marcadoresAtivos = db.prepare('SELECT COUNT(*) as count FROM marcadores').get().count;
    
    // Equipes em campo são as equipes com status 'ativo'
    const equipesCampo = db.prepare("SELECT COUNT(*) as count FROM equipes WHERE status = 'ativo'").get().count;

    res.json({
      success: true,
      data: {
        totalEquipes,
        totalObras,
        marcadoresAtivos,
        equipesCampo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erro ao calcular estatísticas: ' + error.message });
  }
});

// Rota coringa para direcionar qualquer outra rota para o frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  LogisMap rodando com sucesso!`);
  console.log(`  Local: http://localhost:${PORT}`);
  console.log(`==================================================`);
});
