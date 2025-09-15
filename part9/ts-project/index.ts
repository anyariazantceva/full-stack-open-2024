import express from 'express';
const app = express();
import qs from 'qs';
import { calculateBmi } from './bmiCalculator';

app.set('query parser',
  (str: string) => qs.parse(str, { /* custom options */ }))

app.get('/bmi', (req, res): void => {
    const { height, weight } = req.query;
if (!height || !weight) {
    res.status(400).json({ error: "parameters missing" });
    return;
  }

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }
  
  res.json({...req.query, bmi: calculateBmi(Number(height), Number(weight))});

});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});