import patientData from '../../data/patients';

import { ModifiedPatient, Patient } from '../types';

const patients: Patient[] = patientData;

const getPatients = (): Patient[] => {
  return patients;
}

const getModifiedPatients = (): ModifiedPatient[] => {
  return patients.map(({ id,name,dateOfBirth,gender,occupation,entries}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
}

const addPatient = () => {
    return null;
}

export default {
    getPatients,
    addPatient,
    getModifiedPatients
}