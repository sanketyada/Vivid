require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { connectDB } = require('./config/db');
const factcheckRoutes = require('./routes/factcheck');
const claimRoutes = require('./routes/claims');
const detectionAgent = require('./agents/detectionAgent');


const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/factcheck', factcheckRoutes);
app.use('/api/claims', claimRoutes);

app.get('/', (req, res) => res.send('TruthGuard.AI backend'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // start simple agent
  detectionAgent.start(); // basic poller
});
