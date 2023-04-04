import React from 'react'

function Pagination({pokemonsSelected, currentPage, setCurrentPage}) {
    let pageSize = 81
    if (pokemonsSelected >= 1 && pokemonsSelected <=10) {
        pageSize = pokemonsSelected
    } else if (pokemonsSelected >= 11 && pokemonsSelected <=200){
        pageSize = 10
    } else {
        pageSize = 81
    }
  
    return (
    <div id="pagination">
        <p> Total: {pokemonsSelected}</p>
        {
            (pageSize === 81) ?
            <div id="page-total-pokemons">
                {
                    (currentPage !== 1) &&
                    <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    >Prev.</button>
                }
                
                {
                    Array.from(Array(Math.ceil(pokemonsSelected / pageSize)).keys()).map((page) => (
                        (currentPage !== 81) ?
                        <button 
                            key={page}
                            onClick={() => setCurrentPage((currentPage !== 81) 
                                ? (currentPage%10 === 0) ? page + 1 + 10*Math.floor(currentPage/11) : page + 1 + 10*Math.floor(currentPage/10)
                                : 81)}
                            className={
                                ((currentPage !== 81) 
                                ? (currentPage%10 === 0) ? page + 1 + 10*Math.floor(currentPage/11) : page + 1 + 10*Math.floor(currentPage/10)
                                : 81) 
                                === currentPage ? "btnActive" : ""}
                        >
                            {
                                (currentPage !== 81) 
                                ? (currentPage%10 === 0) ? page + 1 + 10*Math.floor(currentPage/11) : page + 1 + 10*Math.floor(currentPage/10)
                                : 81
                            }
                        </button>
                        : (page === 0) ?
                        <button 
                            key={page}
                            onClick={() => setCurrentPage(currentPage === 81)}
                            className="btnActive"
                            >
                            {
                                currentPage
                            }
                            </button>
                        : <button hidden="hidden">
                        </button>
                    ))
                }

                {
                    (currentPage !== 81 && (pokemonsSelected !==0)) ?
                    <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    >Next.</button> : <button hidden="hidden"></button>
                }
            
            </div>
            :   <div id="page-filtered-pokemons">
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
                    
                        (currentPage !== (Array.from(Array(Math.ceil(pokemonsSelected / pageSize)).keys()).length) && pokemonsSelected !==0) ?
                        <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        >Next.</button>
                        : <button hidden="hidden"></button>

                    }
                </div>
        }
      
    </div>
  )
}

export default Pagination