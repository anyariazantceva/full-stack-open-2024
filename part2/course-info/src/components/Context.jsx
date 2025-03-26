import Part from "./Part";

const Content = ({course}) => {
    return (
      <div>
        {course.parts.map(function(part) {
          return <Part part={part.name} exercises={part.exercises}/>
        })}
      </div>
    )
}

export default Content