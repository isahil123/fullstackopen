import { useState, useEffect } from "react"; // 1. useEffect import karo
import axios from "axios"; // 2. axios import karo
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]); // Shuru mein empty array
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  // 3. Data fetch karne ke liye Effect Hook
  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []); // Khali array ka matlab hai: sirf pehli baar load hone par chalega

  const addName = (e) => {
    e.preventDefault();
    if (persons.some((p) => p.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }
    // Abhi ke liye hum sirf local state update kar rahe hain
    setPersons(
      persons.concat({
        name: newName,
        number: newNumber,
        id: persons.length + 1,
      }),
    );
    setNewName("");
    setNewNumber("");
  };

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase()),
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addName}
        nameValue={newName}
        nameChange={(e) => setNewName(e.target.value)}
        numberValue={newNumber}
        numberChange={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
