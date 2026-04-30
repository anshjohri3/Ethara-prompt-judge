import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  prompt: {
    type: String,
    required: true
  },
  responseA: {
    type: String,
    default: null
  },
  responseB: {
    type: String,
    default: null
  },
  ratings: {
    instructionFollowing: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    truthfulness: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    writingStyle: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    verbosity: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  ratingA: {
    instructionFollowing: { type: Number, min: 1, max: 5, default: null },
    truthfulness: { type: Number, min: 1, max: 5, default: null },
    writingStyle: { type: Number, min: 1, max: 5, default: null },
    verbosity: { type: Number, min: 1, max: 5, default: null }
  },
  ratingB: {
    instructionFollowing: { type: Number, min: 1, max: 5, default: null },
    truthfulness: { type: Number, min: 1, max: 5, default: null },
    writingStyle: { type: Number, min: 1, max: 5, default: null },
    verbosity: { type: Number, min: 1, max: 5, default: null }
  },
  summary: {
    type: String,
    default: null
  },
  userSummary: {
    type: String,
    default: null
  },
  preferredResponse: {
    type: String,
    enum: ['A', 'B', null],
    default: null
  },
  finalScore: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deadline: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;