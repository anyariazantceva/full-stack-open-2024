import Country from "./Country"

const Countries = ({resultCountries, showCountry, selectedCountry}) => {
    
    if (resultCountries.length > 10) {
       return <div>Too many matches, specify another filter</div>
    } else if (resultCountries.length === 1) {
        return (
            <Country country={resultCountries[0]}/>)
    } else {
        return (
        <>
         {resultCountries.map((country) => {
            return <div key={country.name.common}>{country.name.common}
            <button onClick={() => showCountry(country.name.common.toLowerCase())}>show</button>
            {selectedCountry && selectedCountry.name.common === country.name.common && (
                <Country country={selectedCountry} />
              )}
            </div>})}
        </> )}
}

export default Countries;