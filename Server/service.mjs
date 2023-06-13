import bcrypt from "bcryptjs";
import fs from "fs";
import multiparty from "multiparty";
import {
  S3Client,
  AbortMultipartUploadCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const accessKeyId = "AKIA2OO7MGJMPYDKLBNG";
const secretAccessKey = "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"; //IAM user

const accessKeyIdRoot = "AKIA2OO7MGJMFTH2FMI2";
const secretAccessKeyRoot = "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"; //root user
const client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: accessKeyIdRoot,
    secretAccessKey: secretAccessKeyRoot,
  },
});
async function checkLogin(Model, request, response) {
  try {
    let user = await Model.findOne({ where: { email: request.body.email } });
    if (user) {
      const validPassword = await bcrypt.compare(
        request.body.password,
        user.password
      );
      if (validPassword) {
        response.status(201).send(user);
      } else {
        response.status(404).send({ message: "Password is incorrect" });
      }
    } else {
      response.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
}

async function registerAngajat(modelUser, modelAngajat, request, response) {
  try {
    let angajat = await modelAngajat.findOne({
      where: { id: request.body.id_angajat_sef },
    });
    if (angajat) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(request.body.password, salt);
      let user = await modelUser.create({
        email: request.body.email,
        password: hashedPassword,
        rol: request.body.rol,
        angajatiId: request.body.id_angajat_sef,
      });
      response.status(201).json(user);
    } else {
      response.status(404).json({ message: "Angajatul nu exista" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
}

async function registerSef(modelUser, modelSef, request, response) {
  try {
    let sef = await modelSef.findOne({
      where: { id: request.body.id_angajat_sef },
    });
    if (sef) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(request.body.password, salt);
      let user = await modelUser.create({
        email: request.body.email,
        password: hashedPassword,
        rol: request.body.rol,
        sefiId: request.body.id_angajat_sef,
      });
      response.status(201).json(user);
    } else {
      response.status(404).json({ message: "Seful nu exista" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
}

async function Dropzone(modelCerere, modelAngajat, request, response) {
  try {
    const form = new multiparty.Form();

    // console.log(JSON.parse(request.body));
    console.log(request.body);

    console.log("form multiparty");

    form.on("part", (part) => {
      console.log("inside on part");
      if (!part.filename) {
        // Omită câmpurile non-file (dacă există)
        part.resume();
        return;
      }

      // Generează un nume de fișier unic pentru a evita suprascrierea
      const filename = Date.now() + "_" + part.filename;

      console.log("filename", filename);

      // Salvează fișierul într-o locație temporară pe server
      const uploadPath = "./uploads/" + filename;
      const writeStream = fs.createWriteStream(uploadPath);
      part.pipe(writeStream);
      // Manipulează evenimentul de finalizare a încărcării
      part.on("end", async () => {
        console.log(
          "Fișierul a fost încărcat cu succes pe server:",
          uploadPath
        );

        // În acest punct, poți să accesezi calea absolută a fișierului prin `uploadPath`
        // și să faci orice altă operație necesară cu fișierul încărcat

        // Poți continua cu codul existent pentru a salva fișierul în AWS sau alte operații

        // De exemplu, poți utiliza `fs.readFileSync` pentru a citi conținutul fișierului
        // în memorie și apoi să îl trimiți la AWS S3:

        const fileContent = fs.readFileSync(uploadPath);

        // Aici poți continua cu codul pentru a încărca fișierul în AWS S3
        // și a obține link-ul de acces către fișierul încărcat
        console.log("DROPZONE");
        await client.send(
          new PutObjectCommand({
            Bucket: "bucketlicenta",
            Key: `pdf/${request.body.pdf}`,
            Body: fileContent,
            ACL: "public-read",
            ContentType: "application/pdf",
          })
        );
        console.log("PDF URL DECI A MERS SEND CLIENT");
        const pdfUrl = `https://bucketlicenta.s3.amazonaws.com/pdf/${request.body.item.pdf}`;

        let cerere = await modelCerere.create({
          pdf: pdfUrl,
          status: request.body.item.status,
          observatii: request.body.item.observatii,
          userId: request.body.item.userId,
          data_initiala: request.body.item.data_initiala,
          data_finala: request.body.item.data_finala,
          departamenteId: request.body.item.departamenteId,
        });
        if (cerere) {
          console.log("CERERE A FOST CREATA");
          let angajat = await modelAngajat.findOne({
            where: { id: request.body.item.angajatiId },
          });
          if (angajat) {
            await angajat.update({
              zile_concediu_disponibile:
                angajat.zile_concediu_disponibile - request.body.item.nrZile,
            });
            await angajat.save();
          }
          response.status(201).json(cerere);
        } else {
          response.status(404).json({ message: "Cererea nu a fost creata" });
        }
      });
      form.on("error", (err) => {
        console.log("error from form", err);
      });
    });

    form.parse(request);
  } catch (error) {
    console.log("error", error);
    response.status(500).json(error);
  }
}

async function getIstoricCereri(modelCerere, request, response) {
  try {
    let cereri = await modelCerere.findAll({
      where: { userId: request.body.userId },
    });
    if (cereri) {
      response.status(201).send(cereri);
    } else {
      response.status(404).send({ message: "Nu exista cereri" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
}

async function getAngajatInfo(
  modelAngajat,
  modelDepartament,
  request,
  response
) {
  try {
    let angajat = await modelAngajat.findOne({
      where: { id: request.body.angajatId },
    });
    if (angajat) {
      let departament = await modelDepartament.findOne({
        where: { id: angajat.departamenteId },
      });
      if (departament) {
        response.status(201).send({ angajat, departament });
      } else {
        response.status(404).send({ message: "Nu exista departament" });
      }
    } else {
      response.status(404).send({ message: "Nu exista angajat" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
}
async function getCereriDepartament(
  modelSef,
  modelCerere,
  modelDepartament,
  request,
  response
) {
  let sef = await modelSef.findOne({
    where: { id: request.body.id },
  });
  if (sef) {
    let departament = await modelDepartament.findOne({
      where: { id: sef.departamenteId },
    });
    if (departament) {
      let cereri = await modelCerere.findAll({
        where: { departamenteId: departament.id },
      });
      if (cereri) {
        response.status(201).send(cereri);
      } else {
        response.status(404).send({ message: "Nu exista cereri" });
      }
    } else {
      response.status(404).send({ message: "Nu exista departament" });
    }
  }
}

async function getConcediiDepartament(modelConcediu, request, response) {
  try {
    let concediu = await modelConcediu.findAll({
      where: { departamenteId: request.body.departamenteId },
    });
    if (concediu) {
      response.status(201).send(concediu);
    } else {
      response.status(404).send({ message: "Nu exista concediu" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
}

export {
  checkLogin,
  registerAngajat,
  registerSef,
  Dropzone,
  getIstoricCereri,
  getAngajatInfo,
  getCereriDepartament,
  getConcediiDepartament,
};
