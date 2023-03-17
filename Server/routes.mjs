import {
  Angajat,
  User,
  Departament,
  Sef,
  Concediu,
  Cerere,
} from "./repository.mjs";
import { checkLogin, registerAngajat, registerSef } from "./service.mjs";
import express from "express";

const router = express.Router();

router.route("/login").post((req, res) => checkLogin(User, req, res));
router
  .route("/registerAngajat")
  .post((req, res) =>
    registerAngajat(User, Angajat, req, res)
  );
router
  .route("/registerSef")
  .post((req, res) => registerSef(User, Sef, req, res));

export default router;
