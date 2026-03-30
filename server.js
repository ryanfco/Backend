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
        res.status(200).json({ Message: 'Usuario criado com sucesso' });
    }); 
});




app.put('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    const {nome , cnpj , email , telefone} = req.body;
    const hash = bcrypt.hashSync("techsolution", 10);

    if (!nome || !cnpj || !email || !telefone ) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }


    const query = `update cliente set nome = '${nome}' , cnpj = '${cnpj}' , email = '${email}', telefone = '${telefone}' where id_cliente = '${id}'`;
    connection.query(query, [ nome , cnpj , email , telefone], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o Usuario.' });
        }
        res.status(200).json({ Message: 'Usuario atualizado com sucesso' });
    }); 
});


app.delete('/api/clientes/:id', (req, res) => {
    const { id } = req.params;
    


    if ( !id ) {
        return res.status(400).json({ error: 'O campo e obrigatório.' });
    }


    const query = `delete from cliente where id_cliente = '${id}'`;
    connection.query(query, [id], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao deletar o Usuario.' });
        }
        res.status(200).json({ Message: 'Usuario deletado com sucesso' });
    }); 
});

app.get('/api/softwares', (req, res) => {
    const query = 'select * from software';
    connection.query(query, [], (err, results) => {
        if (err) {
            console.error('Erro ao consultar software:', err);
            return res.status(500).json({ error: 'Erro ao consultar software.' });
        }
        res.status(200).json({ results });
    }); 
});


app.post('/api/softwares', (req, res) => {
    const { nome, versao, tipo_licenca, fabricante} = req.body;
    console.log('666');
    if (!nome || !versao || !tipo_licenca || !fabricante ) {
        return res.status(400).json({ error: 'bota dados ai.' });
    }


     const query = 'INSERT INTO software (nome, versao, tipo_licenca, fabricante) VALUES (?,?,?,?)';
    connection.query(query, [ nome, versao, tipo_licenca, fabricante], (err, results) => {        
        if (err) {
            console.error('Erro ao criar software:', err);
            return res.status(500).json({ error: 'Erro ao criar software' });
        }
        res.status(201).json({ Message: 'Software adicionado com sucesso' });
    }); 
});

app.post('/api/ativos', (req, res) => {
    const { nome, tipo, id_cliente, descricao } = req.body;
    const hash = bcrypt.hashSync("techsolution", 10);

    if (!nome || !tipo || !id_cliente || !descricao ) {
        return res.status(400).json({ error: 'Todos os campos devem ser informados.' });
    }

    const query = 'INSERT INTO ativo (nome, tipo, id_cliente, descricao) VALUES (?, ?, ?, ?)';
    connection.query(query, [nome, tipo, id_cliente, descricao], (err, results) => {
        if (err) {
            console.error('Erro ao criar ativo:', err);
            return res.status(500).json({ error: 'Erro ao criar ativo.' });
        }
        res.status(201).json({ message: 'Ativo criado com sucesso' });
    }); 
});

app.get('/api/ativos', (req, res) => {
    const query = 'select * from ativo';
    connection.query(query, [], (err, results) => {
        if (err) {
            console.error('Erro ao consultar ativos:', err);
            return res.status(500).json({ error: 'Erro ao consultar ativos.' });
        }
        res.status(200).json({ ativos: results });
    }); 
});

app.get('/api/ativos/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (id == null) {
        return res.status(400).json({ error: 'Para realizar a consulta é necessário o id.' });
    }
    const query = `select * from ativo where id_ativo = '${id}'`;
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
});app.put('/api/ativos/:id', (req, res) => {
    const { id } = req.params;
    const {nome , cnpj , email , telefone} = req.body;
    const hash = bcrypt.hashSync("techsolution", 10);

    if (!nome || !cnpj || !email || !telefone ) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }


    const query = `update ativo set nome = '${nome}' , tipo = '${tipo}' , id_cliente = '${id_cliente}' , descricao = '${descricao}' where id_ativo = '${id}'`;
    connection.query(query, [ nome , cnpj , email , telefone], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o Usuario.' });
        }
        res.status(200).json({ Message: 'Usuario atualizado com sucesso' });
    }); 
});
app.delete('/api/ativos/:id', (req, res) => {
    const { id } = req.params;
    


    if ( !id ) {
        return res.status(400).json({ error: 'O campo e obrigatório.' });
    }


    const query = `delete from ativo where id_ativo = '${id}'`;
    connection.query(query, [id], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao deletar o Usuario.' });
        }
        res.status(200).json({ Message: 'Usuario deletado com sucesso' });
    }); 
});

app.get('/api/softwares/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (id == null) {
        return res.status(400).json({ error: 'Para realizar a consulta é necessário o id.' });
    }
    const query = `select * from software where id_software = '${id}'`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao pesquisar software:', err);
            return res.status(500).json({ error: 'Erro ao pesquisar software:' });
        }
        res.status(200).json({ results });
    }); 
});

app.put('/api/softwares/:id', (req, res) => {
    const { id } = req.params;
    const {nome, versao, tipo_licenca, fabricante} = req.body;
 

    if (!nome || !versao || !tipo_licenca || !fabricante) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }


    const query = `update software set nome = '${nome}' , versao = '${versao}' , tipo_licenca = '${tipo_licenca}', fabricante = '${fabricante}' where id_software = '${id}'`;
    connection.query(query, [ nome, versao, tipo_licenca, fabricante], (err, results) => {        
        if (err) {
            console.error('Erro ao atualizar software', err);
            return res.status(500).json({ error: 'Erro ao atualizar software' });
        }
        res.status(200).json({ Message: 'Software atualizado com sucesso' });
    }); 
});

app.delete('/api/softwares/:id', (req, res) => {
    const { id } = req.params;
    


    if ( !id ) {
        return res.status(400).json({ error: 'O campo ID é obrigatório.' });
    }


    const query = `delete from software where id_software = '${id}'`;
    connection.query(query, [id], (err, results) => {        
        if (err) {
            console.error('Erro ao deletar software', err);
            return res.status(500).json({ error: 'Erro ao deletar software' });
        }
        res.status(200).json({ Message: 'Software deletado com sucesso!' });
    }); 
});

app.get('/api/instalacoes', (req, res) => {
    const query = 'select * from instalacao_software';
    connection.query(query, [], (err, results) => {
        if (err) {
            console.error('Erro ao consultar instalação:', err);
            return res.status(500).json({ error: 'Erro ao consultar instalação.' });
        }
        res.status(200).json({ results });
    }); 
});

app.post('/api/instalacoes', (req, res) => {
    const { id_instalacao, id_ativo, id_software, chave_licenca, data_instalacao, data_expiracao} = req.body;
    console.log('666');
    if ( !id_ativo || !id_software || !chave_licenca || !data_instalacao || !data_expiracao ) {
        return res.status(400).json({ error: 'Precisa dos dados.' });
    }

    console.log(data_expiracao);

     const query = 'INSERT INTO instalacao_software (id_ativo, id_software, chave_licenca, data_instalacao, data_expiracao) VALUES (?,?,?,?,?)';
    connection.query(query, [ id_ativo, id_software, chave_licenca, data_instalacao, data_expiracao], (err, results) => {        
        if (err) {
            console.error('Erro ao fazer instalação:', err);
            return res.status(500).json({ error: 'Erro ao fazer instalação' });
        }
        res.status(201).json({ Message: 'Software instalado com sucesso' });
    }); 
});

app.get('/api/instalacoes/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (id == null) {
        return res.status(400).json({ error: 'Para realizar a consulta é necessário o id.' });
    }
    const query = `select * from instalacao_software where id_instalacao = '${id}'`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao pesquisar instalacao:', err);
            return res.status(500).json({ error: 'Erro ao pesquisar instalacao:' });
        }
        res.status(200).json({ results });
    }); 
});

app.put('/api/instalacoes/:id', (req, res) => {
    const { id } = req.params;
    const { id_instalacao, id_ativo, id_software, chave_licenca, data_instalacao, data_expiracao} = req.body;
 

    if ( !id_ativo || !id_software || !chave_licenca || !data_instalacao || !data_expiracao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }


    const query = `update instalacao_software set id_ativo = '${id_ativo}' , id_software = '${id_software}' , chave_licenca = '${chave_licenca}', data_instalacao = '${data_instalacao}', data_expiracao = '${data_expiracao}'where id_software = '${id}'`;
    connection.query(query, [ id_instalacao, id_ativo, id_software, chave_licenca, data_instalacao, data_expiracao], (err, results) => {        
        if (err) {
            console.error('Erro ao atualizar instalação!', err);
            return res.status(500).json({ error: 'Erro ao atualizar instalação!' });
        }
        res.status(200).json({ Message: 'instalação atualizado com sucesso!' });
    }); 
});

app.delete('/api/instalacoes/:id', (req, res) => {
    const { id } = req.params;
    


    if ( !id ) {
        return res.status(400).json({ error: 'O campo ID é obrigatório.' });
    }


    const query = `delete from instalacao_software where id_instalacao = '${id}'`;
    connection.query(query, [id], (err, results) => {        
        if (err) {
            console.error('Erro ao deletar Instalação', err);
            return res.status(500).json({ error: 'Erro ao deletar Instalação' });
        }
        res.status(200).json({ Message: 'Instalação deletada com sucesso!' });
    }); 
});
app.get('/api/chamados/:id/historico', (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (id == null) {
        return res.status(400).json({ error: 'Para realizar a consulta é necessário o id.' });
    }
    const query = `select * from historico_chamado where id_historico = '${id}'`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao salvar pontuação:', err);
            return res.status(500).json({ error: 'Erro ao salvar pontuação.' });
        }
        res.status(200).json({ results });
    }); 
});

app.post('/api/chamados/:id/historico', (req, res) => {
    const { id_chamado, id_usuario, descricao, data_evento } = req.body;

    if (!id_chamado || !id_usuario || !descricao || !data_evento ) {
        return res.status(400).json({ error: 'Todos os campos devem ser informados.' });
    }

    const query = 'INSERT INTO historico_chamado (id_chamado, id_usuario, descricao, data_evento) VALUES (?, ?, ?, ?)';
    connection.query(query, [id_chamado, id_usuario, descricao, data_evento], (err, results) => {
        if (err) {
            console.error('Erro ao criar historico:', err);
            return res.status(500).json({ error: 'Erro ao criar historico.' });
        }
        res.status(201).json({ message: 'Historico criado com sucesso' });
    }); 
});

app.get('/api/usuarios', (req, res) => {
    const query = 'select * from usuario';
    connection.query(query, [], (err, results) => {
        if (err) {
            console.error('Erro ao consultar clientes:', err);
            return res.status(500).json({ error: 'Erro ao consultar clientes.' });
        }
        res.status(200).json({ usuario: results });
    }); 
});

app.post('/api/usuarios', (req, res) => {
    const { nome , email , senha , perfil} = req.body;

    if (!nome || !email || !senha || !perfil ) {
        return res.status(400).json({ error: 'bota dados ai.' });
    }

    console.log(nome , email , senha , perfil)

     const query = 'INSERT INTO usuario (nome , email, senha , perfil) VALUES (?,?,?,?)';
    connection.query(query, [ nome , email , senha , perfil], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao efetuar login.' });
        }
        res.status(200).json({ Message: 'Usuario criado com sucesso' });
    }); 
});


app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (id == null) {
        return res.status(400).json({ error: 'Para realizar a consulta é necessário o id.' });
    }
    const query = `select * from usuario where id_usuario = '${id}'`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao salvar pontuação:', err);
            return res.status(500).json({ error: 'Erro ao salvar pontuação.' });
        }
        res.status(200).json({ results });
    }); 
});


app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const {nome , email , senha , perfil} = req.body;


    if (!nome || !email || !senha || !perfil ) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }


    const query = `update usuario set nome = '${nome}' , email = '${email}' , senha = '${senha}', perfil = '${perfil}' where id_usuario = '${id}'`;
    connection.query(query, [ nome , email , senha , perfil], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o Usuario.' });
        }
        res.status(200).json({ Message: 'Usuario atualizado com sucesso' });
    }); 
});

app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    


    if ( !id ) {
        return res.status(400).json({ error: 'O campo e obrigatório.' });
    }


    const query = `delete from usuario where id_usuario = '${id}'`;
    connection.query(query, [id], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao deletar o Usuario.' });
        }
        res.status(200).json({ Message: 'Usuario deletado com sucesso' });
    }); 
});



// chamado

app.get('/api/chamados', (req, res) => {
    const query = 'select * from chamado';
    connection.query(query, [], (err, results) => {
        if (err) {
            console.error('Erro ao consultar chamados:', err);
            return res.status(500).json({ error: 'Erro ao consultar chamados.' });
        }
        res.status(200).json({ chamados: results });
    }); 
});

app.post('/api/chamados', (req, res) => {
    const { id_ativo, id_usuario, codigo, titulo, descricao, status_chamado, data_abertura, data_fechamento} = req.body;

    if (!id_ativo || !id_usuario || !codigo || !titulo ||!descricao || !status_chamado || !data_abertura || !data_fechamento ) {
        return res.status(400).json({ error: 'bota dados ai.' });
    }

    console.log(id_ativo, id_usuario, codigo, titulo, descricao, status_chamado, data_abertura, data_fechamento)

   

     const query = 'INSERT INTO chamado (id_ativo, id_usuario, codigo, titulo, descricao, status_chamado, data_abertura, data_fechamento) VALUES (?,?,?,?,?,?,?,?)';
    connection.query(query, [ id_ativo, id_usuario, codigo, titulo, descricao, status_chamado, data_abertura, data_fechamento], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao efetuar login.' });
        }
        res.status(200).json({ Message: 'Criado com sucesso' });
    }); 
});

app.get('/api/chamados/:id', (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    if (id == null) {
        return res.status(400).json({ error: 'Para realizar a consulta é necessário o id.' });
    }
    const query = `select * from chamado where id_chamado = '${id}'`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao salvar pontuação:', err);
            return res.status(500).json({ error: 'Erro ao salvar pontuação.' });
        }
        res.status(200).json({ results });
    }); 
});

app.put('/api/chamados/:id', (req, res) => {
    const { id } = req.params;
    const {id_ativo, id_usuario, codigo, titulo, descricao, status_chamado, data_abertura, data_fechamento} = req.body;


    if (!id_ativo || !id_usuario || !codigo || !titulo ||!descricao || !status_chamado || !data_abertura || !data_fechamento ) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }


    const query = `update chamado set id_ativo = '${id_ativo}' , id_usuario = '${id_usuario}' , codigo = '${codigo}', titulo = '${titulo}', descricao = '${descricao}', status_chamado = '${status_chamado}', data_abertura = '${data_abertura}', data_fechamento = '${data_fechamento}' where id_chamado = '${id}'`;
    connection.query(query, [ id_ativo, id_usuario, codigo, titulo, descricao, status_chamado, data_abertura, data_fechamento], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o chamado.' });
        }
        res.status(200).json({ Message: 'Atualizado com sucesso' });
    }); 
});

app.delete('/api/chamados/:id', (req, res) => {
    const { id } = req.params;
    


    if ( !id ) {
        return res.status(400).json({ error: 'O campo e obrigatório.' });
    }


    const query = `delete from chamado where id_chamado = '${id}'`;
    connection.query(query, [id], (err, results) => {        
        if (err) {
            console.error('Erro ao efetuar login:', err);
            return res.status(500).json({ error: 'Erro ao deletar o chamado.' });
        }
        res.status(200).json({ Message: 'chamado deletado com sucesso' });
    }); 
});