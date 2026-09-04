# Sistema Just in Time

Sistema Web Full Stack desenvolvido para gerenciamento de produtos e controle de produção de uma empresa fabricante de produtos em MDF.

## Funcionalidades

* Login e autenticação de usuários
* Exibição do usuário autenticado
* Cadastro de produtos
* Pesquisa de produtos
* Edição de produtos
* Exclusão de produtos
* Gestão de produção
* Registro de produtos fabricados
* Registro de pedidos
* Controle de estoque
* Alerta de estoque abaixo do mínimo
* Logout

## Tecnologias

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express
* Prisma 7.5.0
* MySQL/MariaDB

### Banco de dados

* MariaDB 10.4.32
* XAMPP
* phpMyAdmin

## Execução

Para executar o projeto, é necessário iniciar o banco de dados pelo XAMPP e executar o backend.

Backend:

```bash
npm install
npm start
```

O servidor será executado em:

```text
http://127.0.0.1:3000
```

O frontend pode ser executado utilizando o Live Server do VS Code.

## Banco de dados

O banco utilizado pelo sistema é:

```text
preparacao_db
```

O script de criação e população do banco está disponível em:

```text
database/script.sql
```

## Documentação

A documentação dos requisitos, testes e ambiente está disponível no arquivo:

```text
documentacao.docx
```

## Projeto

Projeto desenvolvido para as atividades do curso Técnico em Desenvolvimento de Sistemas – SENAI.
