import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hash });
  res.status(201).json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: process.env.JWT_EXPIRES || '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}
  