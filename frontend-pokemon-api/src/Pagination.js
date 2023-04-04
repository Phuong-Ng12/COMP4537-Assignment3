import React from 'react'

function Pagination({pokemonsSelected, currentPage, setCurrentPage}) {
    let pageSize = 10
    if (pokemonsSelected >= 1 && pokemonsSelected <=10) {
        pageSize = pokemonsSelected
    } else {
        pageSize = 10
    }
  
    return (
    <div>
    <p> Total: {pokemonsSelected}</p>
      {
        (currentPage !== 1) &&
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
        > Prev. </button>
      }
      {
        Array.from(Array(Math.ceil(pokemonsSelected / pageSize)).keys()).map((element) => (
          <button
            key={element}
            onClick={() => setCurrentPage(element + 1)}
            className={element + 1 === currentPage ? "btnActive" : ""}
          >
            {element + 1}
          </button>
        ))
      }
      {
        (currentPage !== (Array.from(Array(Math.ceil(pokemonsSelected / pageSize)).keys()).length)) ?
        <button
        onClick={() => setCurrentPage(currentPage + 1)}
        >Next.</button>
         : <button hidden="hidden">
         </button>

        }

    </div>
  )
}

export default Pagination