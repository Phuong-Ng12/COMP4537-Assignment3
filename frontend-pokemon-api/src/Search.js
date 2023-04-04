import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Search({typeSelectedArray, setTypeSelectedArray}) {
    const [types, setTypes] = useState([])
    useEffect(() => {
     async function fetchTypes() {
        const res = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json")
        setTypes(res.data.map(type => type.english))
     }
     fetchTypes()   
    }, [])

    const handleClickFunc = (e) => {
        const { value, checked } = e.target
        if (checked) {
          setTypeSelectedArray(typeSelectedArray => [...typeSelectedArray, value])
        } else {
          setTypeSelectedArray(typeSelectedArray => typeSelectedArray.filter(type => type !== value))
        }
      }

  return (
    <div id="search-pokemons">
        {
            types.map(type => <div key={type}>
                <input type='checkbox'
                value={type}
                id={type}
                onChange={handleClickFunc}
                />
                <label htmlFor={type}>{type}</label>
                </div>)
        }
    </div>
  )
}

export default Search