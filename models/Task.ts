import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Done'],
    default: 'Pending',
  },
  addDate: {
    type: String,
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Task || mongoose.model('Task', taskSchema); 