const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const bcrypt = require('bcryptjs');

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'gestao_ti'
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});

app.post('/api/auth/login', (req, res) => {
    const { email, senha } = req.body;
    const hash = bcrypt.hashSync("techsolution", 10);

    if (!email || !senha) {
        return res.status(400).json({ error: 'Usuário e senha devem ser informados.' });
    }

    const query = `select * from usuario where email = '${email}' and senha = '${senha}'`;
    connection.query(query, [email, senha], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao efetuar login.' });
        }
        res.status(200).json({ token: hash, user: {
         id_usuario: results[0].id_usuario, nome: results[0].nome, email: results[0].email
        } });
    }); 
});

app.get('/api/clientes', (req, res) => {
    const query = 'select * from cliente';
    connection.query(query, [], (err, results) => {
        if (err) {
            console.error('Erro ao consultar clientes:', err);
            return res.status(500).json({ error: 'Erro ao consultar clientes.' });
        }
        res.status(200).json({ clientes: results });
    }); 
});

app.get('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (id == null) {
        return res.status(400).json({ error: 'Para realizar a consulta é necessário o id.' });
    }
    const query = `select * from cliente where id_cliente = '${id}'`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao salvar pontuação:', err);
            return res.status(500).json({ error: 'Erro ao salvar pontuação.' });
        }
        res.status(200).json({ results });
    }); 
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


app.post('/api/clientes', (req, res) => {
    const { nome , cnpj , email , telefone} = req.body;
    const hash = bcrypt.hashSync("techsolution", 10);

    if (!nome || !cnpj || !email || !telefone ) {
        return res.status(400).json({ error: 'bota dados ai.' });
    }


     const query = 'INSERT INTO cliente (nome , cnpj , email , telefone) VALUES (?,?,?,?)';
    connection.query(query, [ nome , cnpj , email , telefone], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao efetuar login.' });
        }
        res.status(201).json({ Message: 'Usuario criado com sucesso' });
    }); 
});