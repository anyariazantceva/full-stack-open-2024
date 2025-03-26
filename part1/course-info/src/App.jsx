const Header = ({course}) => {
  return (
    <h1>{course.name}</h1>
  )
}

const Part = ({part, exercises}) => {
  return (
    <p>
      {part} {exercises}
    </p>
  )
}

const Content = ({course}) => {
  return (
    <div>
      {course.parts.map(function(part) {
        return <Part part={part.name} exercises={part.exercises}/>
      })}
    </div>
  )
}

const Total = ({course}) => {
  return (
    <p>Number of exercises {course.parts.reduce(function(accumulator, currentValue) {
      console.log(accumulator, currentValue);
      return accumulator + currentValue.exercises;
    }, 0)}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
      
    </div>
  )
}

export default App