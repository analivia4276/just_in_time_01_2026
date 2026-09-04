sql
CREATE DATABASE IF NOT EXISTS preparacao_db;

USE preparacao_db;

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Produto (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    custo DECIMAL(10,2) NOT NULL,
    quantidade_estoque INT NOT NULL,
    estoque_minimo INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Producao (
    id_producao INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES Produto(id_produto),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

INSERT INTO Usuario (nome, email, senha) VALUES
('Ana Luiza', 'ana@email.com', '123456'),
('Carlos Silva', 'carlos@email.com', '123456'),
('Mariana Souza', 'mariana@email.com', '123456');

INSERT INTO Produto (nome, descricao, custo, quantidade_estoque, estoque_minimo) VALUES
('Painel MDF Branco', 'Painel de MDF branco para fabricação de móveis', 85.50, 20, 5),
('Chapa MDF Carvalho', 'Chapa de MDF com acabamento carvalho', 120.00, 15, 5),
('Prateleira MDF', 'Prateleira produzida em MDF', 45.90, 10, 3);

INSERT INTO Producao (id_produto, id_usuario, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'fabricado', 10, '2026-09-02'),
(2, 2, 'fabricado', 8, '2026-09-02'),
(3, 3, 'pedido', 2, '2026-09-02');
