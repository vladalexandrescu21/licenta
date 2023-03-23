import bcrypt from "bcryptjs";
async function checkLogin(Model, request, response) {
    try {
        let user = await Model.findOne({ where: { email: request.body.email } });
        if (user) {
            const validPassword = await bcrypt.compare(request.body.password, user.password);
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
    let angajat = modelAngajat.findOne({
      where: { id: request.body.id_angajat_sef },
    });
    if (angajat) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(request.body.password, salt);
      let user = modelUser.create({
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
    let sef = modelSef.findOne({ where: { id: request.body.id_angajat_sef } });
    if (sef) {
      let user = modelUser.create({
        email: request.body.email,
        password: request.body.password,
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

async function Dropzone(modelCerere, request, response) {
  try {
    let cerere = modelCerere.create({
      pdf: request.body.pdf,
      status: request.body.status,
      observatii: request.body.observatii,
      userId: request.body.userId
    });
    response.status(201).json(cerere);
  } catch (error) {
    response.status(500).json(error);
  }
}
export { checkLogin, registerAngajat, registerSef, Dropzone };
