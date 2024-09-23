const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicializar o Express
const app = express();
app.use(bodyParser.json());

// Conectar ao MongoDB (use sua URI do MongoDB Atlas)
mongoose.connect('mongodb+srv://eduardojosedesouzaoliveira:lZKN7J1z3WhWfKi2@cluster0.2cf3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("Conectado ao MongoDB"))
    .catch(err => console.error("Erro ao conectar ao MongoDB", err));

// Função para obter o IP do usuário
function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

// Definir o Schema para o histórico de ações do Chatbot
const historySchema = new mongoose.Schema({
    userMessage: String,
    botResponse: String,
    ip: String, // Adicionado para armazenar o IP
    timestamp: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

// Definir o Schema para o login de usuários
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Endpoint para registrar novos usuários
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send("Usuário já existe!");
    }

    try {
        // Salva o novo usuário no MongoDB
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(200).send("Usuário registrado com sucesso!");
    } catch (error) {
        res.status(500).send("Erro ao registrar usuário: " + error);
    }
});

// Endpoint para login de usuários
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verifica se o usuário existe e se a senha está correta
        const user = await User.findOne({ username, password });
        if (!user) {
            return res.status(401).send("Credenciais inválidas");
        }

        // Se a autenticação for bem-sucedida
        res.status(200).send("Login bem-sucedido");
    } catch (error) {
        res.status(500).send("Erro ao fazer login: " + error);
    }
});

// Endpoint para salvar o histórico no MongoDB, incluindo o IP do usuário
app.post('/save-history', async (req, res) => {
    const { userMessage, botResponse } = req.body;
    const ip = getClientIp(req); // Obtém o IP do usuário

    try {
        const newHistory = new History({ userMessage, botResponse, ip }); // Salva o IP no banco
        await newHistory.save();
        res.status(200).send("Histórico salvo com sucesso, IP incluído!");
    } catch (error) {
        res.status(500).send("Erro ao salvar histórico: " + error);
    }
});

// Endpoint para listar todos os históricos salvos no MongoDB
app.get('/get-history', async (req, res) => {
    try {
        const histories = await History.find(); // Retorna todos os registros da coleção
        res.status(200).json(histories);
    } catch (error) {
        res.status(500).send("Erro ao buscar históricos: " + error);
    }
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
