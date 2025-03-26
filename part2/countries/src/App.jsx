import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css'
import Countries from './components/Countries';

function App() {
  const [countries, setCountries] = useState([]);
  const [value, setValue] = useState("");
  const [resultCountries, setResultCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          setCountries(response.data)
        })
  }, [])

  const handleChange = (event) => {
    const query = event.target.value.toLowerCase();
    setValue(query);
    if (query === "") {
      setResultCountries([]);
      setSelectedCountry(null);
    } else {
      filterCountries(query);
    }
  }
  
  const filterCountries = (query) => {
    let filteredCountries = countries.filter((country) => {
      return country.name.common.toLowerCase().includes(query);
  })
    setResultCountries(filteredCountries)}

  const showCountry = (country) => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${country}`)
    .then(response => {
      console.log("selected country fetched ", response.data)
      setSelectedCountry(response.data)
    })
  }


  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
      <Countries resultCountries={resultCountries} showCountry={showCountry} selectedCountry={selectedCountry}/>
    </div>
  )
}

export default App
