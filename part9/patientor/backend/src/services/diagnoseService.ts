import diagnosesData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const diagnoses: Diagnosis[] = diagnosesData;

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
}

const addDiagnose = () => {
    return null;
}

export default {
    getDiagnoses,
    addDiagnose
}