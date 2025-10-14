type coursePart = {
    name: string,
    exerciseCount: number
}

interface ContentProps {
    courseParts: coursePart[]
}
const Content = (props: ContentProps) => {
    return props.courseParts.map((part) => {
        return <p>
           {part.name} {part.exerciseCount}
      </p>
    })
}

export default Content