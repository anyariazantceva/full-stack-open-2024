interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))