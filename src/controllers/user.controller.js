const { user: UserModel } = require("../models");
const bcrypt = require('bcryptjs');
const multer = require("multer");
const path = require("path");

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

// Setup storage engine untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Tentukan direktori penyimpanan file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Ambil ekstensi file
    cb(null, `${Date.now()}${ext}`); // Generate nama file unik
  },
});

// Filter file yang diizinkan (misalnya hanya gambar)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan"));
  }
};

// Setup multer dengan storage dan filter
const upload = multer({ storage, fileFilter });

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

    // Jika ada file gambar (profile_picture)
    if (req.file) {
      updateData.profile_picture = req.file.path; // Simpan path file gambar
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
  upload,
};
