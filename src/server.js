import { createServer } from 'http';
import app from './app.js';
import './db.js';

const port = process.env.PORT || 4000;
const server = createServer(app);

server.listen(port, () => {
  console.log(`el server esta en http://localhost:${port}`);
});
