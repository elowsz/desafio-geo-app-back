require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());

app.use(express.json({ limit: '50mb' }));


const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('🔥 Conectado ao MongoDB Atlas (SisManutenção)!'))
  .catch(err => console.error('Erro ao conectar no Mongo:', err));


const DefeitoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  local: String,      
  laboratorio: String, 
  foto: String,        
  data: { type: Date, default: Date.now }
});

const Defeito = mongoose.model('Defeito', DefeitoSchema);

app.get('/', (req, res) => {
  res.send('Servidor SisManutenção Online! 🚒');
});

app.post('/api/defeitos', async (req, res) => {
  try {
    const novoDefeito = new Defeito(req.body);
    await novoDefeito.save();
    
    console.log(`[NOVO REGISTRO] ${req.body.titulo} - ${req.body.laboratorio}`);
    res.status(201).json(novoDefeito);
  } catch (error) {
    console.error("Erro ao salvar:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/defeitos', async (req, res) => {
  try {
    
    const lista = await Defeito.find().sort({ data: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});