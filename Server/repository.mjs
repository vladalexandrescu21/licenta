import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(
  "postgres://postgres:postgrespw@localhost:32768/app_db"
);

//TRUNCATE users RESTART IDENTITY CASCADE; cod pentru pgadmin4

const Angajat = sequelize.define(
  "angajati",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nume: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 30,
      },
    },
    prenume: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 30,
      },
    },
    data_nasterii: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    zile_concediu_disponibile: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);

const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["angajat", "sef"]],
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Departament = sequelize.define(
  "departamente",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    numeDepartament: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 30,
      },
    },
    nrAngajati: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Sef = sequelize.define(
  "sefi",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nume_sef: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 30,
      },
    },
    prenume_sef: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        min: 3,
        max: 30,
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Concediu = sequelize.define(
  "concedii",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    data_initiala: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    data_finala: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    departamenteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

const Cerere = sequelize.define(
  "cereri",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pdf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["in asteptare", "aprobata", "respinsa"]],
      },
    },
    observatii: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        min: 3,
        max: 200,
      },
    },
    data_initiala: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    data_finala: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    departamenteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: false, freezeTableName: true }
);

Angajat.hasOne(User, { foreignKey: { allowNull: true } });
User.belongsTo(Angajat);

User.hasMany(Concediu);
Concediu.belongsTo(User);

Departament.hasMany(Angajat);
Angajat.belongsTo(Departament);

Departament.hasOne(Sef);
Sef.belongsTo(Departament);

Sef.hasOne(User, { foreignKey: { allowNull: true } });
User.belongsTo(Sef);

User.hasMany(Cerere);
Cerere.belongsTo(User);

async function initialize() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
}

export { initialize, Angajat, User, Departament, Sef, Concediu, Cerere };
