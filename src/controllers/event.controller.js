import mongoose from 'mongoose';
import Event from '../models/Event.js';

export async function createEvent(req, res) {
  const data = { ...req.body, createdBy: req.user.id };
  const event = await Event.create(data);
  res.status(201).json(event);
}

export async function listEvents(req, res) {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;
  const filters = {};
  if (req.query.fromDate === 'today') filters.date = { $gte: new Date() };
  if (req.query.dateGte) filters.date = { ...(filters.date || {}), $gte: new Date(req.query.dateGte) };
  if (req.query.createdBy && mongoose.isValidObjectId(req.query.createdBy)) filters.createdBy = req.query.createdBy;
  if (req.query.search) filters.title = { $regex: req.query.search, $options: 'i' };

  const [items, total] = await Promise.all([
    Event.find(filters).sort({ date: 1, _id: 1 }).skip(skip).limit(limit),
    Event.countDocuments(filters)
  ]);

  res.json({ page, limit, total, pages: Math.ceil(total / limit), items });
}

export async function registerToEvent(req, res) {
  const userId = req.user.id;
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.date < new Date()) return res.status(400).json({ error: 'Event already occurred' });
  if (event.attendees.some(a => String(a) === userId)) return res.status(400).json({ error: 'Already registered' });
  if (event.attendees.length >= event.capacity) return res.status(400).json({ error: 'Event full' });
  event.attendees.push(userId);
  await event.save();
  res.json({ ok: true, eventId: event.id, attendees: event.attendees.length });
}
