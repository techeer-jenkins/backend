const { Todo } = require('../models');

const createTodo = async (req, res) => {
  console.log("Hit createTodo controller")
  console.log(req.body)
  try {
    const { title, description } = req.body;
    const userId = req.params.userId;
    const todo = await Todo.create({ title, description, ownerId: userId });
    console.log(todo)
    res.json(todo);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const getTodos = async (req, res) => {
  console.log("Hit getTodos controller")
  console.log(req.params)
  const userId = req.params.userId;
  const { skip = 0, limit = 100 } = req.query;
  const todos = await Todo.findAll({
    where: { ownerId: userId },
    offset: parseInt(skip),
    limit: parseInt(limit)
  });
  res.json(todos);
};

module.exports = {
  createTodo,
  getTodos,
};
