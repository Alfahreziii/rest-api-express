const { user: UserModel } = require("../models");
const bcrypt = require('bcryptjs');

/**
 * GET /users
 */
const index = async (_req, res) => {
  try {
    return res.send({
      message: "Success",
      data: await UserModel.findAll({
        attributes: ["id", "name", "email"],
      }),
    });
  } catch (err) {
    return res.status(500).send({
      message: "Error retrieving users",
      error: err.message,
    });
  }
};

/**
 * PUT /users/:id
 */
const update = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    // Persiapkan objek data yang akan diupdate
    const updateData = { name, email };

    // Jika password ada, hash password terlebih dahulu
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updateData.password = passwordHash;
    }

    // Update data user di database
    const [updated] = await UserModel.update(updateData, {
      where: { id },
    });

    if (updated) {
      return res.send({ message: "User updated successfully" });
    }

    return res.status(404).send({ message: "User not found" });
  } catch (err) {
    return res.status(500).send({
      message: "Error updating user",
      error: err.message,
    });
  }
};


/**
 * DELETE /users/:id
 */
const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await UserModel.destroy({
      where: { id },
    });

    if (deleted) {
      return res.send({ message: "User deleted successfully" });
    }
    return res.status(404).send({ message: "User not found" });
  } catch (err) {
    return res.status(500).send({
      message: "Error deleting user",
      error: err.message,
    });
  }
};


module.exports = {
  index,
  update,
  destroy,
};
