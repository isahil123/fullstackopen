import { useState } from "react";

// Naya Component: Sirf Buttons ke liye
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

// Naya Component: Sirf ek single stat line dikhane ke liye
const StatisticLine = ({ text, value }) => (
  <p>
    {text} {value}
  </p>
);

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad;

  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }

  const average = (props.good * 1 + props.neutral * 0 + props.bad * -1) / total;
  const positivePercentage = (props.good / total) * 100;

  return (
    <div>
      <h1>statistics</h1>
      {/* Ab <p> tag ki jagah humara naya StatisticLine component use hoga */}
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="all" value={total} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positivePercentage + " %"} />
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      {/* Ab direct button nahi, apna naya Button component */}
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
