// Configuração e inicialização do banco de dados SQLite usando o módulo nativo node:sqlite
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// Cria ou abre o arquivo de banco de dados
const dbPath = path.join(__dirname, 'logismap.db');
const db = new DatabaseSync(dbPath);

// Habilita chaves estrangeiras
db.exec('PRAGMA foreign_keys = ON;');

// Inicializa a estrutura das tabelas se elas não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS equipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    status TEXT CHECK(status IN ('ativo', 'inativo')) DEFAULT 'ativo' NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS obras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    endereco TEXT NOT NULL,
    equipe_id INTEGER,
    status TEXT CHECK(status IN ('em_andamento', 'concluida', 'pausada')) DEFAULT 'em_andamento' NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(equipe_id) REFERENCES equipes(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS marcadores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    tipo TEXT CHECK(tipo IN ('obra', 'hospedagem', 'deposito', 'veiculo')) NOT NULL,
    label TEXT NOT NULL,
    cor TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS configuracoes (
    chave TEXT PRIMARY KEY,
    valor TEXT
  );
`);


// Função para sementar dados iniciais (Seed)
function seedDatabase() {
  // Verifica se a tabela de equipes está vazia
  const countEquipes = db.prepare('SELECT COUNT(*) as count FROM equipes').get();
  if (!countEquipes || countEquipes.count === 0) {
    console.log('Semeando banco de dados com dados iniciais...');

    // Inserindo equipes
    const insertEquipe = db.prepare('INSERT INTO equipes (nome, responsavel, status) VALUES (?, ?, ?)');
    
    // Na API nativa node:sqlite, o run recebe os valores como argumentos individuais ou como um array de parâmetros:
    // Ex: insertEquipe.run('Equipe Carlos', 'Carlos', 'ativo')
    const resultCarlos = insertEquipe.run('Equipe Carlos', 'Carlos', 'ativo');
    const carlosId = resultCarlos.lastInsertRowid;
    
    const resultAna = insertEquipe.run('Equipe Ana', 'Ana', 'ativo');
    const anaId = resultAna.lastInsertRowid;
    
    const resultJoao = insertEquipe.run('Equipe João', 'João', 'ativo');
    const joaoId = resultJoao.lastInsertRowid;

    // Inserindo obras
    const insertObra = db.prepare('INSERT INTO obras (nome, endereco, equipe_id, status) VALUES (?, ?, ?, ?)');
    insertObra.run('Obra Centro', 'Vila Velha - Centro', carlosId, 'em_andamento');
    insertObra.run('Obra Praia da Costa', 'Vila Velha - Praia da Costa', anaId, 'em_andamento');
    insertObra.run('Obra Itapuã', 'Vila Velha - Itapuã', joaoId, 'em_andamento');
    insertObra.run('Obra Glória', 'Vila Velha - Glória', null, 'pausada');
    insertObra.run('Obra Bento Ferreira', 'Vitória - Bento Ferreira', null, 'concluida');

    // Inserindo marcadores
    const insertMarcador = db.prepare('INSERT INTO marcadores (lat, lng, tipo, label, cor) VALUES (?, ?, ?, ?, ?)');
    insertMarcador.run(-20.3350, -40.2950, 'obra', 'Equipe Carlos - Obra Centro', '#ff4757');
    insertMarcador.run(-20.3450, -40.3000, 'hospedagem', 'Hotel Litoral', '#00d4ff');

    console.log('Seed do banco de dados concluído com sucesso.');
  } else {
    console.log('O banco de dados já possui dados. Pulando seed.');
  }
}

seedDatabase();

// Garante que o valor padrão de google_maps_api_key existe
db.prepare("INSERT OR IGNORE INTO configuracoes (chave, valor) VALUES ('google_maps_api_key', '')").run();

module.exports = db;

