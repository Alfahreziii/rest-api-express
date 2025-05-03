const knex = require("./knex");

const TABLE_NAME = "users";

const getAll = () => {
  return knex(TABLE_NAME).select("id", "name", "email");
};

const create = (data) => {
  const { name, email, password } = data;
  return knex(TABLE_NAME).insert({ name, email, password });
};

const updateById = (id, data) => {
  return knex(TABLE_NAME).where({ id }).update(data);
};

const deleteById = (id) => {
  return knex(TABLE_NAME).where({ id }).del();
};

module.exports = {
  getAll,
  create,
  updateById,
  deleteById,
  tableName: TABLE_NAME,
};