import { NewPatient, Gender } from "./types";
import z from "zod";

export const newPatientSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  occupation: z.string(),
  dateOfBirth: z.string(),
  gender: z.nativeEnum(Gender),
  entries: z.array(z.any()).default([]),
});

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Patient data must be a non-null object");
  }

  return newPatientSchema.parse(object);
};
