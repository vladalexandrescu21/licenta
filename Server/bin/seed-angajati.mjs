import { Angajat } from "../repository.mjs";

const angajati = [
    {
        nume: "Popescu",
        prenume: "Ion",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 1
    },
    {
        nume: "Ionescu",
        prenume: "Maria",
        data_nasterii: "1995-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 1
    },
    {
        nume: "Georgescu",
        prenume: "Andrei",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 1
    },
    {
        nume: "Popa",
        prenume: "Mihai",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 2
    },
    {
        nume: "Pop",
        prenume: "Andreea",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 2
    },
    {
        nume: "Lupescu",
        prenume: "Ioana",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 3
    },
    {
        nume: "Andreescu",
        prenume: "Andrei",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 3
    },
    {
        nume: "Radulescu",
        prenume: "Mihai",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 3
    },
    {
        nume: "Constantinescu",
        prenume: "Maria",
        data_nasterii: "1990-01-01",
        zile_concediu_disponibile: 20,
        departamenteId: 3
    },
];

function seedAngajati() {
    Angajat.bulkCreate(angajati)
        .then(() => {
            console.log("Angajati added");
        })
        .catch((err) => {
            console.log(err);
        });
}

seedAngajati();