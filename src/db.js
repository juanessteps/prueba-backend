import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
mongoose.set('strictQuery', true);

mongoose.connect(uri)
  .then(() => console.log(' Conectado a MongoDB'))
  .catch(err => console.error(' Error de conexión a MongoDB:', err));
