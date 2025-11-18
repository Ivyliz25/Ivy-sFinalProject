import express from 'express';

const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send("Hello from test server!");
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server listening on port ${PORT} on all interfaces`);
  console.log("Server is ready to accept requests");
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

setTimeout(() => {
  console.log("Server has been running for 30 seconds");
}, 30000);
