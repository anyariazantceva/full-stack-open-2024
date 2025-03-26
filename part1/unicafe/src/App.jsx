import { useState } from 'react';

const StatisticLine = ({text, value}) => {
  return (
  <tr>
      <td>{text}:</td>
      <td>{value}</td>
  </tr>)}

const Statistics = ({good, neutral, bad, total, calculateAverage}) => {
  if(total === 0) {
    return <p>No feedback given</p>
  } else {
    return (
      <table>
        <thead>
          <tr>
            <th><h2>Statistics</h2></th>
          </tr>
        </thead>
        <tbody>
          <StatisticLine text="Good" value={good}/>
          <StatisticLine text="Neutral" value={neutral}/>
          <StatisticLine text="Bad" value={bad}/>
          <StatisticLine text="All" value={total}/>
          <StatisticLine text="Average" value={calculateAverage() || 0}/>
          <StatisticLine text="Positive" value={good == 0 ? 0 : `${(good / total) * 100} %`}/> 
        </tbody>
      </table>
    )
  }
}

const Button = ({addStatistics, statsType, buttonText}) => {
  return  <button onClick={() => addStatistics(statsType)}>{buttonText}</button>
}

const App = () => {
  // save clicks of each button to its own state
  let [good, setGood] = useState(0)
  let [neutral, setNeutral] = useState(0)
  let [bad, setBad] = useState(0)
  let total = good + bad + neutral;

  const addStatistics = (statsType) => {
    switch (statsType) {
      case "good":
        setGood(good + 1);
        break;
      case "neutral":
        setNeutral(neutral + 1);
        break;
      case "bad":
        setBad(bad + 1);
        break;  
      default:
        break;
    }
  }

  const calculateAverage = () => {
    return (good - bad) / total;
  }

  return (
    <div>
      <h2>Give feedback</h2>
      <Button addStatistics={addStatistics} statsType="good" buttonText="good"/>
      <Button addStatistics={addStatistics} statsType="neutral" buttonText="neutral"/>
      <Button addStatistics={addStatistics} statsType="bad" buttonText="bad"/>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} calculateAverage={calculateAverage}/>
      
    </div>
  )
}

export default App