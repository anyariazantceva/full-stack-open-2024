const parseArguments = (args: string[]): { height: number, weight: number } => {
  if (args.length < 4) {
    throw new Error('Not enough arguments. Usage: height weight');
  }
  if (args.length > 4) {
    throw new Error('Too many arguments given. Usage: height weight');
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Provided values were not numbers!');
  }
  if (height <= 0 || weight <= 0) {
    throw new Error('Height and weight must be positive numbers!');
  }

  return { height, weight };
};

export const calculateBmi = (height: number, weight: number) : string => {
    let heightInMetres = height / 100;
    const bmi = weight / (heightInMetres * heightInMetres);
    if(bmi < 18.5) {
        return "Underweight";
    } else if(bmi >= 18.5 && bmi <= 24.9) {
        return "Normal weight";
    } else if(bmi >= 25 && bmi <= 29.9) {
        return "Overweight";
    } else {
        return "Obese";
    }
    
}

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (e: unknown) {
    let errorMessage = 'Error: ';
    if (e instanceof Error) {
      errorMessage += e.message;
    }
    console.log(errorMessage);
  }
}