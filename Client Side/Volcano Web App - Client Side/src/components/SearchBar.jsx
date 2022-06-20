import { useEffect, useState } from "react";
import { headUrl } from "../URL";

export default function SearchBar(props){
    //prop to remember inputs from select components
    const [innerSearch, setInnerSearch] = useState({
        countryName: 'Algeria',
        distanceOption: '5km',
    }
    );
    const [countryNames, setCountryNames] = useState([]);
    //get country options
    useEffect(() => {
        fetch(`${headUrl}/countries`)
        .then(res => res.json())
        .then(res => setCountryNames(res))
    }, []);  
    //Handle to get value from input components 
    function handleChange (e)  {
        setInnerSearch({
            ...innerSearch,
            [e.target.name]: e.target.value,
        });
    };
    //method to cancel event (wait for full input)
    function handleSubmit(event) {
        event.preventDefault();
      }

    return (
    //contents for search bar
    <form 
    className="searchForm"
    onSubmit={handleSubmit}> 
        <label>Country</label>
        <select 
            name="countryName"
            type="text"
            value={innerSearch.countryName} 
            onChange={handleChange}>
            {countryNames.map(countryName =>{
                return(
                    <option value={countryName}> {countryName} </option>
                );
            })}
        </select>   
        <label>Populated within</label>
        <select 
            name="distanceOption"
            type="text"
            value={innerSearch.distanceOption} 
            onChange={handleChange}>
            <option value=''>None</option> 
            <option value="5km">5 km</option>
            <option value="10km">10 km</option>
            <option value="30km">30 km</option>
            <option value="100km">100 km</option>
        </select>
        <button
         className="submit_button"
         type="button"
         onClick={()=> props.onSubmit(innerSearch)}>
            Search
        </button>
    </form>
 );
}


