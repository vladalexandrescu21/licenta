import {Departament} from "../repository.mjs";
const departamente = [
    {
        numeDepartament: "IT",
        nrAngajati: 3
    },
    {
        numeDepartament: "HR",
        nrAngajati: 2
    },
    {
        numeDepartament: "Marketing",
        nrAngajati: 4
    },
];

function seedDepartamente() {
    Departament.bulkCreate(departamente)
        .then(() => {
            console.log("Departamente added");
        })
        .catch((err) => {
            console.log(err);
        });
}

seedDepartamente();