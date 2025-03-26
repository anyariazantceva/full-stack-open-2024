import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personsService from "./services/persons";
import Notification from './components/Notification';
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personsService
    .getAll()
    .then(persons => {
      setPersons(persons)
    })
  }, [])

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value.toLowerCase());
    setPersons(persons.filter((person) => {
      return person.name.toLowerCase().includes(newFilter);
    }))    
  }
  const personExists = () => {
    return persons.some(person => person.name === newName)
  }

  const updatePersonNumber = () => {
    if(confirm(`${newName} ia already added to the phonebook, replace the old number with a new one?`)) {
      const existingPerson = persons.find(p => p.name === newName)
      const changedPerson = { ...existingPerson, number: newNumber}
      personsService
      .update(existingPerson.id, changedPerson)
      .then(response => {
        setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data))
    })
    .catch(error => {
      setErrorMessage(`Information of ${newName} has already been removed from server`);
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      alert('An error occurred while updating the contact.');
    });
    }
  }

  const addPerson = (event) => {
    event.preventDefault();
    if (personExists()) {
      updatePersonNumber();
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      personsService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setSuccessMessage(
          `Added ${returnedPerson.name}`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        setNewName("");
        setNewNumber("");
      })
      .catch(error => {
        setErrorMessage(
          `${error.response.data.error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        
      })
    }
    
    setNewName('');
    setNewNumber('');
  }

  const removePerson = (personId, personName) => {
    if(confirm(`Delete ${personName}?`)) {
      personsService
        .remove(personId)
        .then(returnedData => {
          console.log("Person deleted!")
        })
    }

  }

  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage}/>
      <Notification message={errorMessage}/>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>
      <PersonForm addPerson={addPerson} newName={newName} handleInputChange={handleInputChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} removePerson={removePerson}/>
    </div>
  )
}

export default App