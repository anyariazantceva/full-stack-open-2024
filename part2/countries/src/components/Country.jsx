const Country = ({country}) => {
    console.log(country)
    return (<div>
    <h2>{country.name.common}</h2>
    <p>capital: {country.capital[0]}</p>
    <p>area: {country.area}</p>
    <h3>languages: </h3>
    <ul>
        {Object.values(country.languages).map((language) => {
           return <li>{language}</li>
        })}
    </ul>
    <img src={country.flags.png} alt={country.flags.alt} />
</div>)
}

export default Country;