import {
  NewPatient,
  Gender,
 
} from "./types";


const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isEmptyString = (text: string): boolean => {
  return text.trim().length === 0;
};

const parseData = (data: unknown, name: string): string => {
  if (!isString(data)) {
    throw new Error(`Incorrect data in field: '${name}'`);
  }

  if (isEmptyString(data)) {
    throw new Error(`Missing value in field: '${name}'`);
  }

  return data;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender)) {
    throw new Error("Incorrect data in field: 'gender'");
  }

  if (isEmptyString(gender)) {
    throw new Error("Missing value in field: 'gender'");
  }

  switch (gender) {
    case "male":
      return Gender.Male;
    case "female":
      return Gender.Female;
    case "other":
      return Gender.Other;
    default:
      throw new Error(`Unknown gender: '${gender}'`);
  }
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object) {
    throw new Error("Missing patient data");
  }
  if (typeof object !== "object"){
    throw new Error("Patient data is in incorrect format. Patient data must be an object");
  }

  if (!("name" in object))
    throw new Error("Incorrect data: a 'name' field missing");
  if (!("ssn" in object))
    throw new Error("Incorrect data: a 'ssn' field missing");
  if (!("occupation" in object))
    throw new Error("Incorrect data: a 'occupation' field missing");
  if (!("dateOfBirth" in object))
    throw new Error("Incorrect data: a 'date of birth' field missing");
  if (!("gender" in object))
    throw new Error("Incorrect data: a 'gender' field missing");

  const newPatient: NewPatient = {
    name: parseData(object.name, "name"),
    ssn: parseData(object.ssn, "ssn"),
    occupation: parseData(object.occupation, "occupation"),
    dateOfBirth: parseData(object.dateOfBirth, "dateOfBirth"),
    gender: parseGender(object.gender),
    entries: [],
  };

  return newPatient;
};