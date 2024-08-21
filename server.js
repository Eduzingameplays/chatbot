const { MongoClient, ServerApiVersion } = require('mongodb');

// Substitua pela sua URI de conexão
const uri = "mongodb+srv://eduardojosedesouzaoliveira:lZKN7J1z3WhWfKi2@cluster0.2cf3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Cria uma instância do MongoClient com as opções de API estável
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Função para conectar ao MongoDB
async function connectToMongoDB() {
    try {
        // Conecta o cliente ao servidor (opcional a partir da versão 4.7)
        await client.connect();
        // Envia um ping para confirmar uma conexão bem-sucedida
        await client.db("admin").command({ ping: 1 });
        console.log("Conexão estabelecida com sucesso ao MongoDB!");

        // Retorna o cliente para uso em outras partes do projeto
        return client;
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
        // Se a conexão falhar, encerra o processo com um código de erro
        process.exit(1);
    }
}

// Executa a conexão
connectToMongoDB().then(client => {
    // Aqui você pode começar a usar o cliente para interagir com o banco de dados
    console.log("MongoDB pronto para uso.");

    // Exemplo de operação com o banco de dados
    // const db = client.db('nome_do_seu_banco_de_dados');
    // Faça operações com o db aqui, como db.collection('sua_colecao').find({});

}).catch(console.error);

// Certifique-se de fechar a conexão ao finalizar o uso
process.on('SIGINT', async () => {
    await client.close();
    console.log("Conexão com o MongoDB encerrada.");
    process.exit(0);
});