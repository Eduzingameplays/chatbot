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

// Definir o Schema para o histórico de ações do Chatbot
const historySchema = new mongoose.Schema({
    userMessage: String,
    botResponse: String,
    timestamp: { type: Date, default: Date.now }
});

const History = mongoose.model('History', historySchema);

// Endpoint para salvar o histórico no MongoDB
app.post('/save-history', async (req, res) => {
    const { userMessage, botResponse } = req.body;

    try {
        const newHistory = new History({ userMessage, botResponse });
        await newHistory.save();
        res.status(200).send("Histórico salvo com sucesso!");
    } catch (error) {
        res.status(500).send("Erro ao salvar histórico: " + error);
    }
});

// Inicializar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});