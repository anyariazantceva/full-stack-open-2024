import express, { Request, Response, NextFunction } from "express";
import patientService from "../services/patientService";
import { toNewPatient, newPatientSchema } from "../utils";
import z from "zod";
import { NewPatient, Patient } from "../types";

const router = express.Router();

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues });
  } else {
    next(error);
  }
};

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.get("/", (_req, res) => {
  res.send(patientService.getModifiedPatients());
});

router.post("/", newPatientParser, (req: Request, res: Response<Patient | { error: unknown }>) => {
  try {
    const newPatient = toNewPatient(req.body);
    const returnedPatient = patientService.addPatient(newPatient);
    res.json(returnedPatient);
  } catch (e: unknown) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.issues });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
});


router.use(errorMiddleware);

export default router;
