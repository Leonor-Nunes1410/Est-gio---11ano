CREATE DATABASE rebortec_db;
USE rebortec_db;

CREATE TABLE clientes (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
nif VARCHAR(9) NOT NULL UNIQUE,
);

INSERT INTO clientes (nome,nif) VALUES ('Empresa Exemplo', '50123456');
SELECT * FROM clientes;
