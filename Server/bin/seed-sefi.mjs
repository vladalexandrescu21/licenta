import { Sef } from "../repository.mjs";

const sefi = [
    {
        nume_sef: "Achim",
        prenume_sef: "Andrei",
        departamenteId: 1
    },
    {
        nume_sef: "Nistor",
        prenume_sef: "Mihai",
        departamenteId: 2
    },
    {
        nume_sef: "Oprea",
        prenume_sef: "Ioana",
        departamenteId: 3
    },
];

function seedSefi() {
    Sef.bulkCreate(sefi)
        .then(() => {
            console.log("Sefi added");
        })
        .catch((err) => {
            console.log(err);
        });
}

seedSefi();
