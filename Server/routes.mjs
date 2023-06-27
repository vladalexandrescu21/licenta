import {
  Angajat,
  User,
  Departament,
  Sef,
  Concediu,
  Cerere,
} from "./repository.mjs";
import {
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
  getAllConcedii,
  getAllDepartamente,
} from "./service.mjs";
import express from "express";

const router = express.Router();

router.route("/login").post((req, res) => checkLogin(User, req, res));
router
  .route("/registerAngajat")
  .post((req, res) => registerAngajat(User, Angajat, req, res));
router
  .route("/registerSef")
  .post((req, res) => registerSef(User, Sef, req, res));
router
  .route("/dropZone")
  .post((req, res) => Dropzone(Cerere, Angajat, req, res));
router.route("/istoricCereri").post((req, res) => {
  getIstoricCereri(Cerere, req, res);
});
router.route("/getAngajatInfo").post((req, res) => {
  getAngajatInfo(Angajat, Departament, req, res);
});
router.route("/getCereriDepartament").post((req, res) => {
  getCereriDepartament(Sef, Cerere, Departament, req, res);
});
router.route("/getConcediiDepartament").post((req, res) => {
  getConcediiDepartament(Concediu, req, res);
});
router.route("/aprobaCerere").post((req, res) => {
  DropzoneAprobare(Cerere, Concediu, Angajat, User, Sef, req, res);
});
router.route("/respingeCerere").post((req, res) => {
  DropzoneRespingere(Cerere, Concediu, Angajat, User, Sef, req, res);
});
router.route("/getAllConcedii").get((req, res) => {
  getAllConcedii(Concediu, req, res);
});
router.route("/getAllDepartamente").get((req, res) => {
  getAllDepartamente(Departament, req, res);
});
export default router;
