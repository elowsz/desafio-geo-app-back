require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔥 Conectado ao MongoDB Atlas (GeoApp)!'))
  .catch(err => console.error('Erro ao conectar ao Mongo:', err));

const ReportSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  local: String,
  laboratorio: String,
  foto: String,
  dataHora: String,
  latitude: Number,
  longitude: Number,
  criadoEm: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);

app.get('/', (req, res) => {
  res.send('Servidor GeoApp Online! 🚀');
});

app.post('/api/registros', async (req, res) => {
  try {
    const novo = new Report(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/registros', async (req, res) => {
  try {
    const lista = await Report.find().sort({ criadoEm: -1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
