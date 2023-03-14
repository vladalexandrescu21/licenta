import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:postgrespw@localhost:32768"
);

const Angajat = sequelize.define("angajat", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenume: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data_nasterii: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  zile_concediu_disponibile: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamps: false,
});

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM("angajat", "sef", "hr"),
    allowNull: false,
  },
});

const Concediu = sequelize.define("concediu", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  angajatId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "angajat",
      key: "id",
    },
  },
});

async function initialize() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
}

export default initialize;
