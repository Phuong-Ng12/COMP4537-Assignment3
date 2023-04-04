import React, { useEffect, useState } from 'react'
import axios from 'axios'

function FilteredPokemons({typeSelectedArray, currentPage, setPokemonsSelected, pokemonsSelected}) {
    const [pokemons, setPokemons] = useState([])
    
    useEffect(() => {
        async function fetchPokemons(){
            const res = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
            setPokemons(res.data)
        }
        fetchPokemons()
    }, [])
    let currentPokemons = [];
    let pokeArr = [];
    function updatePokemonsSelected() {
        pokemons.map(pokemon => {
            if (typeSelectedArray.every(type => pokemon.type.includes(type))) {
                pokeArr.push(pokemon)
            }
        })
        setPokemonsSelected(pokeArr.length)
    }
    updatePokemonsSelected()
    let pageSize = 10
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    currentPokemons = pokeArr.slice(startIndex, endIndex);
    console.log(pokeArr)
    console.log(currentPokemons)


  return (
    <>
        <h2>Page number {currentPage}</h2>
        <div id="pokemon-list">
            {
                currentPokemons.map(pokemon => (
                    <div key={pokemon.id}>
                        {
                            (pokemon.id >= 0 && pokemon.id <=9)
                            ? <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/00${pokemon.id}.png`} alt={pokemon.name.english}/>
                            : (pokemon.id >= 10 && pokemon.id <=99)
                            ? <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/0${pokemon.id}.png`} alt={pokemon.name.english}/>
                            : <img src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pokemon.id}.png`} alt={pokemon.name.english}/>
                        }
                    </div>
                ))
            }
        </div>
    </>
  )
}

export default FilteredPokemons