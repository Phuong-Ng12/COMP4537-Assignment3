import React, { useEffect, useState } from 'react'
import axios from 'axios'

function FilteredPokemons({typeSelectedArray, currentPage, setPokemonsSelected, pokemonsSelected}) {
    const [pokemons, setPokemons] = useState([])
    const [open, setOpen]=useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState([])
    
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
                        <p><button id="pokemon-detail-btn" onClick={()=> {setOpen(true); setSelectedPokemon(pokemon)}}>Show Detail</button></p>
                        {
                            (open) ? <div id="myModal" className="modal" style={{display: "block"}}>
                            <div key={pokemon.id} className="modal-content">
                                <span className="close" onClick={() => {setOpen(false)}}>&times;</span>
                                    <ul id="pokemon-see-detail-modal">
                                        <li><h1 id="pokemon-heading-see-detail-modal">{selectedPokemon.name.english}</h1></li>
                                        <li>HP: {selectedPokemon.base.HP}</li>
                                        <li>Attack: {selectedPokemon.base.Attack}</li>
                                        <li>Defense: {selectedPokemon.base.Defense}</li>
                                        <li>Speed: {selectedPokemon.base.Speed}</li>
                                        <li>Speed Attack: {selectedPokemon.base['Sp. Attack']}</li>
                                        <li>Speed Defense: {selectedPokemon.base['Sp. Defense']}</li>
                                        <li>Type: {selectedPokemon.type.map(item => <>{item} | </>)}</li>
                                        <li>ID: {selectedPokemon.id}</li>
                                    </ul> 
                                </div>
                            </div>  
                            : <div id="myModal" className="modal" style={{display: "none"}}></div>
                        }
                        
                    </div>
                ))
            }
        </div>
    </>
  )
}

export default FilteredPokemons