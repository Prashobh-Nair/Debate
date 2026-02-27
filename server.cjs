const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

app.post('/api/generate', async (req, res) => {
    console.log(`--- API Request Received on Port ${PORT} ---`);
    const handlerPath = path.resolve(__dirname, 'api', 'generate.js');
    console.log('Handler Path:', handlerPath);

    try {
        const { default: handler } = await import(`file://${handlerPath.replace(/\\/g, '/')}`);
        console.log('Handler imported successfully');
        await handler(req, res);
    } catch (err) {
        console.error('Server Import/Execution Error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
    console.error('SERVER ERROR DURING STARTUP:', err);
    process.exit(1);
});
