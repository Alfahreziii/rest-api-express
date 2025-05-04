'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.post, {
        foreignKey: "user_id",
        as: "posts",
      });
    }
  }
  user.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      verification_token: DataTypes.STRING,
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      profile_picture: {  // Menambahkan kolom profile_picture
        type: DataTypes.STRING,
        allowNull: true,  // Kolom ini opsional
      },
    },
    {
      sequelize,
      modelName: "user",
      tableName: "users",  // Pastikan nama tabel sesuai
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  
  return user;
};
