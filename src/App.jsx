import { useState } from "react";

// Naya Component: Sirf Stats dikhane ke liye
const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad;
  const average =
    total === 0
      ? 0
      : (props.good * 1 + props.neutral * 0 + props.bad * -1) / total;
  const positivePercentage = total === 0 ? 0 : (props.good / total) * 100;

  return (
    <div>
      <h1>statistics</h1>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {total}</p>
      <p>average {average}</p>
      <p>positive {positivePercentage} %</p>
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
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      {/* Yahan humne apne naye component ko call kiya aur data pass kar diya */}
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
