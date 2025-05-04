const { user: UserModel } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = await UserModel.create({
      name,
      email,
      password: passwordHash,
      verification_token: verificationToken,
      is_verified: false,
    });

    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    const htmlContent = `
      <h3>Verifikasi Email</h3>
      <p>Silakan klik link berikut untuk memverifikasi akun kamu:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `;

    await sendEmail(email, "Verifikasi Email - Movie App", htmlContent);

    return res.send({
      message: "Registrasi berhasil. Silakan cek email untuk verifikasi.",
    });
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await UserModel.findOne({ where: { verification_token: token } });

    if (!user) {
      return res.status(400).send({ message: "Invalid Verification Token" });
    }

    await UserModel.update(
      { is_verified: true, verification_token: null },
      { where: { id: user.id } }
    );

    return res.send({ message: "Email Verified Successfully" });
  } catch (err) {
    return res.status(500).send({ message: "Verification failed", error: err.message });
  }
};



/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await UserModel.findOne({
      attributes: ["id", "name", "email", "password", "is_verified"],
      where: { email },
    });

    if (!user) {
      return res.status(401).send({
        message: "Invalid email / password",
        data: null,
      });
    }

    // Cek apakah email sudah terverifikasi
    if (!user.is_verified) {
      return res.status(403).send({
        message: "Akun belum diverifikasi. Silakan cek email untuk verifikasi.",
        data: null,
      });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Invalid email / password",
        data: null,
      });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET
    );

    return res.send({
      message: "User successfully logged in",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};


module.exports = { register, login, verifyEmail };
