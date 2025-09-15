interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

const parseExerciseArguments = (args: string[]): { target: number, dailyExerciseHours: number[] } => {
  if (args.length < 4) {
    throw new Error('Not enough arguments. Usage: height weight');
  }

  const target = Number(args[2])
  const dailyExerciseHours = args.slice(3).map(a => {
    if (isNaN(Number(a))) {
      throw new Error(`Provided value "${a}" is not a number!`);
    }
    return Number(a);
  })

   if (isNaN(target)) {
    throw new Error('Target must be a number');
  }

  return { target, dailyExerciseHours };
};

const calculateExercises = (dailyExerciseHours: number[], target: number) : Result => {
    let trainingDays = 0;
    let periodLength = dailyExerciseHours.length;
    let totalHours = 0;
     dailyExerciseHours.forEach((day) => {
        if(day > 0) {
            trainingDays++;
        }
        totalHours += day;
    })
    let average = totalHours / periodLength;
    let success = average >= target;
    let rating = 0;
    let ratingDescription = "";
    if(average <= 1) {
        rating = 1;
        ratingDescription = "The daily exercise hours is too small, could be better"
    } else if (average > 1 && average < 3) {
        rating = 2;
        ratingDescription = "The daily exercise hours is not too bad, but could be better"
    } else {
        rating = 3;
        ratingDescription = "The daily exercise hours is excellent, good job!"
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    }
}

try {
  const { target, dailyExerciseHours } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(dailyExerciseHours, target));
} catch (e: unknown) {
  let errorMessage = 'Something went wrong.';
  if (e instanceof Error) {
    errorMessage += ' Error: ' + e.message;
  }
  console.log(errorMessage);
}