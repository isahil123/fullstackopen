import { useState, useEffect } from "react";
import personService from "./services/persons";

// --- Naya Component: Notification ---
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }
  // 'type' ya toh "success" hoga ya "error" (CSS classes)
  return <div className={type}>{message}</div>;
};

// --- Purane Components ---
const Filter = ({ value, onChange }) => (
  <div>
    filter shown with: <input value={value} onChange={onChange} />
  </div>
);

const PersonForm = ({
  onSubmit,
  nameValue,
  nameChange,
  numberValue,
  numberChange,
}) => (
  <form onSubmit={onSubmit}>
    <div>
      name: <input value={nameValue} onChange={nameChange} />
    </div>
    <div>
      number: <input value={numberValue} onChange={numberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map((person) => (
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>
          delete
        </button>
      </p>
    ))}
  </div>
);

// --- Main App ---
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  // Nayi States Notifications ke liye
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // 'success' ya 'error'

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  // Notification dikhane ka helper function (5 second baad gaayab)
  const showNotification = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const addName = (e) => {
    e.preventDefault();
    const existingPerson = persons.find((p) => p.name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const changedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson,
              ),
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${returnedPerson.name}'s number`); // Success message
          })
          .catch((error) => {
            // ERROR CATCH KAR LIYA! (Exercise 2.18)
            showNotification(
              `Information of ${existingPerson.name} has already been removed from server`,
              "error",
            );
            // UI se gaayab kar do jo server par nahi hai
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }
      return;
    }

    const personObject = { name: newName, number: newNumber };

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
      showNotification(`Added ${returnedPerson.name}`); // Success message
    });
  };

  const deleteName = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
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

      {/* Notification Component yahan render hoga */}
      <Notification message={message} type={messageType} />

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
      <Persons persons={personsToShow} handleDelete={deleteName} />
    </div>
  );
};

export default App;
