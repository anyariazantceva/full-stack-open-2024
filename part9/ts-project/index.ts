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

app.post('/exercises', (req, res) => {
    const {daily_exercises, target} = req.body;
    if (daily_exercises === undefined || target === undefined) {
     res.status(400).json({ error: 'parameters missing' });
  }
  if (!Array.isArray(daily_exercises) ||
      daily_exercises.some(d => typeof d !== 'number' && isNaN(Number(d))) ||
      typeof target !== 'number' && isNaN(Number(target))
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const dailyHours = daily_exercises.map(d => Number(d));
  const dailyTarget = Number(target);

  const result: Result = calculateExercises(dailyHours, dailyTarget);

  return res.json(result);
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});