import bcrypt from "bcryptjs";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { UUID } from "sequelize";

const accessKeyIdRoot = "";
const secretAccessKeyRoot = ""; //root user
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
      // Check if an account with the employee ID already exists
      let existingUser = await modelUser.findOne({
        where: { angajatiId: request.body.id_angajat_sef },
      });

      if (existingUser) {
        response.status(409).json({ message: "Contul există deja" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        let user = await modelUser.create({
          email: request.body.email,
          password: hashedPassword,
          rol: request.body.rol,
          angajatiId: request.body.id_angajat_sef,
        });
        response.status(201).json(user);
      }
    } else {
      response.status(404).json({ message: "Angajatul nu există" });
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
      // Check if an account with the employee ID already exists
      let existingUser = await modelUser.findOne({
        where: { sefiId: request.body.id_angajat_sef },
      });

      if (existingUser) {
        response.status(409).json({ message: "Contul există deja" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
        let user = await modelUser.create({
          email: request.body.email,
          password: hashedPassword,
          rol: request.body.rol,
          sefiId: request.body.id_angajat_sef,
        });
        response.status(201).json(user);
      }
    } else {
      response.status(404).json({ message: "Seful nu există" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
}

async function DropzoneAprobare(
  modelCerere,
  modelConcediu,
  modelAngajat,
  modelUser,
  modelSef,
  request,
  response
) {
  try {
    const uniqueFilename = request.body.pdfName;
    const uploadResult = await client.send(
      new PutObjectCommand({
        Bucket: "bucketlicenta",
        Key: `pdf/${uniqueFilename}`, // Use the generated unique filename
        Body: request.body.base64Pdf,
        ACL: "public-read",
        ContentType: "application/pdf",
      })
    );
    let cerere = await modelCerere.findOne({
      where: { id: request.body.id_cerere },
    });
    if (cerere) {
      await cerere.update({
        status: "aprobata",
      });
      let concediu = await modelConcediu.create({
        data_initiala: request.body.data_initiala,
        data_finala: request.body.data_finala,
        userId: request.body.userId,
        departamenteId: request.body.departamenteId,
      });
      const user = await modelUser.findOne({
        where: { id: request.body.userId },
      });
      if (user) {
        const angajat = await modelAngajat.findOne({
          where: { id: user.angajatiId },
        });
        if (angajat) {
          const sef = await modelSef.findOne({
            where: { id: request.body.sefiId },
          });
          if (concediu) {
            const responseBody = {
              nume_angajat: angajat.nume,
              prenume_angajat: angajat.prenume,
              email_angajat: user.email,
              nume_sef: sef.nume_sef,
              prenume_sef: sef.prenume_sef,
            };
            response.status(201).json(responseBody);
          } else {
            response.status(404).json({ message: "Concediul nu a fost creat" });
          }
        }
      }
    } else {
      response.status(404).json({ message: "Cererea nu există" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
}

async function DropzoneRespingere(
  modelCerere,
  modelConcediu,
  modelAngajat,
  modelUser,
  modelSef,
  request,
  response
) {
  try {
    const uniqueFilename = request.body.pdfName;
    const uploadResult = await client.send(
      new PutObjectCommand({
        Bucket: "bucketlicenta",
        Key: `pdf/${uniqueFilename}`, // Use the generated unique filename
        Body: request.body.base64Pdf,
        ACL: "public-read",
        ContentType: "application/pdf",
      })
    );
    let cerere = await modelCerere.findOne({
      where: { id: request.body.id_cerere },
    });
    let user = await modelUser.findOne({
      where: { id: request.body.userId },
    });
    if (user) {
      let angajat = await modelAngajat.findOne({
        where: { id: user.angajatiId },
      });
      await cerere.update({
        status: "respinsa",
        observatii: request.body.observatii,
      });
      await angajat.update({
        zile_concediu_disponibile:
          angajat.zile_concediu_disponibile + request.body.nrZile,
      });
      const sef = await modelSef.findOne({
        where: { id: request.body.sefiId },
      });
      const responseBody = {
        nume_angajat: angajat.nume,
        prenume_angajat: angajat.prenume,
        email_angajat: user.email,
        nume_sef: sef.nume_sef,
        prenume_sef: sef.prenume_sef,
      };
      response.status(201).json(responseBody);
    } else {
      response.status(404).json({ message: "Cererea nu există" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
}

async function Dropzone(modelCerere, modelAngajat, request, response) {
  try {
    try {
      const uniqueFilename = Date.now() + "-" + request.body.pdf;
      const uploadResult = await client.send(
        new PutObjectCommand({
          Bucket: "bucketlicenta",
          Key: `pdf/${uniqueFilename}`, // Use the generated unique filename
          Body: request.body.base64Pdf,
          ACL: "public-read",
          ContentType: "application/pdf",
        })
      );

      const pdfUrl = `https://bucketlicenta.s3.amazonaws.com/pdf/${uniqueFilename}`;

      let cerere = await modelCerere.create({
        pdf: pdfUrl,
        pdfName: uniqueFilename,
        status: request.body.status,
        observatii: request.body.observatii,
        userId: request.body.userId,
        data_initiala: request.body.data_initiala,
        data_finala: request.body.data_finala,
        departamenteId: request.body.departamenteId,
        nrZile: request.body.nrZile,
      });

      if (cerere) {
        let angajat = await modelAngajat.findOne({
          where: { id: request.body.angajatiId },
        });

        if (angajat) {
          await angajat.update({
            zile_concediu_disponibile:
              angajat.zile_concediu_disponibile - request.body.nrZile,
          });

          await angajat.save();
        }

        response.status(201).json(cerere);
      } else {
        response.status(404).json({ message: "Cererea nu a fost creata" });
      }
    } catch (error) {
      console.log("Eroare în timpul încărcării PDF-ului în AWS S3:", error);
      response.status(500).json(error);
    }
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
  DropzoneAprobare,
  DropzoneRespingere,
};
