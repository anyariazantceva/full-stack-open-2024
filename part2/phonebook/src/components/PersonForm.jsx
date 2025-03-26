const PersonForm = ({addPerson, newName, handleInputChange, newNumber, handleNumberChange}) => {
   return (<form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleInputChange} />
        </div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}  /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>) 
}

export default PersonForm
