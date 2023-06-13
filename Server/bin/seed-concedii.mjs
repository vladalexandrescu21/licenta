import { Concediu } from "../repository.mjs";

const concedii = [
  {
    userId: 6,
    data_initiala: "2023-06-13",
    data_finala: "2023-06-15",
    departamenteId: 3,
  },
  {
    userId: 7,
    data_initiala: "2023-06-13",
    data_finala: "2023-06-15",
    departamenteId: 3,
  },
  {
    userId: 8,
    data_initiala: "2023-06-20",
    data_finala: "2023-06-22",
    departamenteId: 3,
  },
  {
    userId: 6,
    data_initiala: "2023-06-20",
    data_finala: "2023-06-22",
    departamenteId: 3,
  },
  {
    userId: 6,
    data_initiala: "2023-06-27",
    data_finala: "2023-06-27",
    departamenteId: 3,
  },
  {
    userId: 7,
    data_initiala: "2023-06-27",
    data_finala: "2023-06-27",
    departamenteId: 3,
  },
  {
    userId: 6,
    data_initiala: "2023-07-03",
    data_finala: "2023-07-05",
    departamenteId: 3,
  },
  {
    userId: 7,
    data_initiala: "2023-07-04",
    data_finala: "2023-07-06",
    departamenteId: 3,
  },
];

function seedConcedii() {
  Concediu.bulkCreate(concedii)
    .then(() => {
      console.log("Concedii added");
    })
    .catch((err) => {
      console.log(err);
    });
}

seedConcedii();
