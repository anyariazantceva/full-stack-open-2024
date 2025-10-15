interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
interface CoursePartDescription extends CoursePartBase {
  description: string,
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface PartProps {
  part: CoursePart;
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
];

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: PartProps) => {
  switch(part.kind) {
    case "basic": 
      return <div>
        <h2>{part.name} {part.exerciseCount}</h2>
        <i>{part.description}</i>
        </div>;
    case "background":
          return <div>
        <h2>{part.name} {part.exerciseCount}</h2>
        <i>{part.description}</i>
        <p>submit to {part.backgroundMaterial}</p>
        </div>;
    case "group":
           return <div>
        <h2>{part.name} {part.exerciseCount}</h2>
        <i>{part.groupProjectCount}</i>
        </div>;
    default:
      return assertNever(part);   
  }
}

const Content = () => {
    return courseParts.map((part) => {
        return <Part key={part.name} part={part}/>
    })
}

export default Content