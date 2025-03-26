const Total = ({course}) => {
    return (
      <p>Total of {course.parts.reduce(function(accumulator, currentValue) {
        return accumulator + currentValue.exercises;
      }, 0)} exercises</p>
    )
  }

export default Total;  