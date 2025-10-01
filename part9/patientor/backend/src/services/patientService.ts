import patientData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { NewPatient, NonSensitivePatient, Patient } from '../types';

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
}

const getModifiedPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id,name,dateOfBirth,gender,occupation}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
}

const addPatient = (newPatient : NewPatient): Patient=> {
    const patient : Patient = {
    id: uuid(),
    ...newPatient
  };
  patientData.push(patient);
  return patient;
}

export default {
    getPatients,
    addPatient,
    getModifiedPatients
}