import 'dotenv/config';
import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const port = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await connectDatabase();
    const server = app.listen(port, () => {
      console.log(`PaperTrail API listening on port ${port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received; shutting down`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Unable to start PaperTrail API:', error.message);
    process.exit(1);
  }
}

startServer();
