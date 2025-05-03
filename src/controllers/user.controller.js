const {
  getAll: getAllUsers,
  create: createUser,
  updateById,
  deleteById,
} = require("../models/user");

/**
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

/**
 * GET /users
 */
const index = async (_req, res) => {
  const users = await getAllUsers();
  return res.send({
    message: "Success",
    data: users,
  });
};

/**
 * POST /users
 */
const store = async (req, res) => {
  const { name, email, password } = req.body;
  await createUser({ name, email, password });
  return res.status(201).send({ message: "User created" });
};

/**
 * PUT /users/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  await updateById(id, { name, email });
  return res.send({ message: "User updated" });
};

/**
 * DELETE /users/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;
  await deleteById(id);
  return res.send({ message: "User deleted" });
};

module.exports = {
  index,
  store,
  update,
  destroy,
};