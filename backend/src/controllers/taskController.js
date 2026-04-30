import Task from '../models/Task.js';
import { generateResponses } from '../utils/gemini.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, prompt, deadline, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      prompt,
      responseA: '',
      responseB: '',
      deadline,
      assignedTo,
      status: 'pending'
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const generateTaskResponses = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned
    const assignedId = task.assignedTo?._id || task.assignedTo;
    if (assignedId?.toString() !== req.user._id.toString() && assignedId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Only the assigned user can generate responses' });
    }

    if (task.responseA && task.responseB) {
      return res.status(400).json({ message: 'Responses are already generated' });
    }

    const { responseA, responseB } = await generateResponses(task.prompt);
    
    task.responseA = responseA;
    task.responseB = responseB;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Generate responses error:', error);
    res.status(500).json({ message: 'Error generating responses' });
  }
};

export const updateTaskResponses = async (req, res) => {
  try {
    const { responseA, responseB } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned
    const assignedId = task.assignedTo?._id || task.assignedTo;
    if (assignedId?.toString() !== req.user._id.toString() && assignedId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Only the assigned user can update responses' });
    }

    if (task.responseA && task.responseB) {
      return res.status(400).json({ message: 'Responses are already provided' });
    }

    if (!responseA || !responseB) {
      return res.status(400).json({ message: 'Both Response A and Response B are required' });
    }

    task.responseA = responseA;
    task.responseB = responseB;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Update responses error:', error);
    res.status(500).json({ message: 'Error updating responses manually' });
  }
};

export const getTasks = async (req, res) => {
  try {
    console.log('getTasks - user:', req.user?.role, req.user?._id);
    const { status, search } = req.query;
    let query = {};

    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('getTasks - query:', query);
    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('getTasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks', details: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access
    if (req.user.role !== 'admin' && task.assignedTo?._id?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned or admin
    if (req.user.role !== 'admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const evaluateTask = async (req, res) => {
  try {
    const { ratingA, ratingB, preferredResponse, userSummary } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned
    const assignedId = task.assignedTo?._id || task.assignedTo;
    if (assignedId?.toString() !== req.user._id.toString() && assignedId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: Only the assigned user can evaluate this task' });
    }

    // Calculate scores for each response
    const scoreA =
      ratingA.instructionFollowing * 0.3 +
      ratingA.truthfulness * 0.3 +
      ratingA.writingStyle * 0.2 +
      ratingA.verbosity * 0.2;

    const scoreB =
      ratingB.instructionFollowing * 0.3 +
      ratingB.truthfulness * 0.3 +
      ratingB.writingStyle * 0.2 +
      ratingB.verbosity * 0.2;

    // Generate summary using Groq
    let summary = '';
    try {
      const { default: Groq } = await import('groq-sdk');
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const analysisPrompt = `Compare these two AI responses and explain which is better and why.

Prompt: "${task.prompt}"

Response A (More Accurate):
"${task.responseA}"
Ratings: Instruction Following: ${ratingA.instructionFollowing}/5, Truthfulness: ${ratingA.truthfulness}/5, Writing Style: ${ratingA.writingStyle}/5, Verbosity: ${ratingA.verbosity}/5, Score: ${scoreA.toFixed(1)}/5

Response B (More Creative):
"${task.responseB}"
Ratings: Instruction Following: ${ratingB.instructionFollowing}/5, Truthfulness: ${ratingB.truthfulness}/5, Writing Style: ${ratingB.writingStyle}/5, Verbosity: ${ratingB.verbosity}/5, Score: ${scoreB.toFixed(1)}/5

Provide a brief comparison summary (3-5 sentences) explaining which response is better overall and why, considering all the evaluation criteria.`;

      if (userSummary && userSummary.trim()) {
        analysisPrompt += `\n\nNote from the evaluator: "${userSummary}"`;
      }

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: analysisPrompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 500
      });

      summary = completion.choices[0]?.message?.content || '';
    } catch (aiError) {
      console.error('AI summary generation failed:', aiError.message);
      // Fallback summary
      if (scoreA > scoreB) {
        summary = `Response A scored higher (${scoreA.toFixed(1)} vs ${scoreB.toFixed(1)}) and is the better choice.`;
      } else if (scoreB > scoreA) {
        summary = `Response B scored higher (${scoreB.toFixed(1)} vs ${scoreA.toFixed(1)}) and is the better choice.`;
      } else {
        summary = `Both responses scored equally (${scoreA.toFixed(1)}). The choice depends on whether you prioritize accuracy (A) or creativity (B).`;
      }
    }

    task.ratingA = ratingA;
    task.ratingB = ratingB;
    task.preferredResponse = preferredResponse;
    task.finalScore = Math.max(scoreA, scoreB);
    task.summary = summary;
    task.userSummary = userSummary || null;
    task.status = 'completed';

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Evaluate task error:', error);
    res.status(500).json({ message: 'Error evaluating task' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const now = new Date();
    let query = {};

    if (req.user.role !== 'admin') {
      query.assignedTo = req.user._id;
    }

    const totalTasks = await Task.countDocuments(query);
    const completedTasks = await Task.countDocuments({ ...query, status: 'completed' });
    const overdueTasks = await Task.countDocuments({
      ...query,
      status: 'pending',
      deadline: { $lt: now }
    });

    res.json({ totalTasks, completedTasks, overdueTasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};