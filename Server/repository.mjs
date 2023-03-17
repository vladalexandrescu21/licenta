import { Sequelize, DataTypes } from "sequelize";
import {faker} from "@faker-js/faker";

const sequelize = new Sequelize(
  "postgres://postgres:postgrespw@localhost:32768/app_db"
);


const Angajat = sequelize.define("angajati", {
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
      max: 30
    }
  },
  prenume: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 3,
      max: 30
    }
  },
  data_nasterii: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  zile_concediu_disponibile: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
},
{timestamps: false,
freezeTableName: true}
);

const User = sequelize.define("users", {
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
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["angajat", "sef"]]
    }
  },
},
{timestamps: false,
freezeTableName: true});

const Departament = sequelize.define("departamente", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  numeDepartament: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 3,
      max: 30
    }
  },
  nrAngajati: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  }
},
{timestamps: false,
freezeTableName: true});

const Sef = sequelize.define("sefi", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nume_sef: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 3,
      max: 30
    }
  },
  prenume_sef: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      min: 3,
      max: 30
    }
  }
},
{timestamps: false,
freezeTableName: true});

const Concediu = sequelize.define("concedii", {
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
  }
},
{timestamps: false,
freezeTableName: true});

const Cerere = sequelize.define("cereri", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["in asteptare", "aprobata", "respinsa"]]
    }
  },
  observatii: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      min: 3,
      max: 200
    }
  },
},
{timestamps: false,
  freezeTableName: true});

Angajat.hasOne(User, {foreignKey: {allowNull: true}});
User.belongsTo(Angajat);

User.hasMany(Concediu);
Concediu.belongsTo(User);

Departament.hasMany(Angajat);
Angajat.belongsTo(Departament);


Departament.hasOne(Sef);
Sef.belongsTo(Departament);

Sef.hasOne(User, {foreignKey: {allowNull: true}});
User.belongsTo(Sef);

User.hasMany(Cerere);
Cerere.belongsTo(User);

//populate

// const Angajati = [];
// const Departamente = [];
// const Sefi = [];
// const Concedii = [];
// const Users = [];
// const minDate = new Date('2022-01-01');
// const maxDate = new Date('2022-12-31');
// const firstDate = faker.date.between(minDate, maxDate);

// Adăugați diferența dorită între date (în acest caz, 7 zile)
// const diffInMs = 7 * 24 * 60 * 60 * 1000;
// const secondDate = new Date(firstDate.getTime() + diffInMs);


// for (let i = 0; i < 10; i++) {
//   Departamente.push({
//     numeDepartament: faker.name.jobArea(),
//     nrAngajati: faker.datatype.number({ min: 1, max: 30 }),
//   });
//   Angajati.push({
//     nume: faker.name.lastName(),
//     prenume: faker.name.firstName(),
//     data_nasterii: faker.date.between("1980-01-01", "2003-12-31"),
//     zile_concediu_disponibile: faker.datatype.number({ min: 0, max: 30 })
//   });
//   Sefi.push({ nume_sef: faker.name.lastName(), prenume_sef: faker.name.firstName() });
//   Concedii.push({ startDate: firstDate, endDate: secondDate });
// }

// Angajat.bulkCreate(Angajati);
// Departament.bulkCreate(Departamente);
// Sef.bulkCreate(Sefi);
// Concediu.bulkCreate(Concedii);


async function initialize() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
}


export { initialize, Angajat, User, Departament, Sef, Concediu, Cerere };