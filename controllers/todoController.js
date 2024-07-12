const { Todo } = require('../models');

const createTodo = async (req, res) => {
  console.log("Hit createTodo controller")
  try {
    const { title, description } = req.body;
    const userId = req.params.userId;
    const todo = await Todo.create({ title, description, ownerId: userId });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTodos = async (req, res) => {
  console.log("Hit getTodos controller")
  const { skip = 0, limit = 100 } = req.query;
  const todos = await Todo.findAll({
    where: { ownerId: req.params.userId },
    offset: parseInt(skip),
    limit: parseInt(limit)
  });
  res.json(todos);
};

module.exports = {
  createTodo,
  getTodos,
};
