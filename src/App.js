import React, { useState, useEffect } from 'react';
import './styles.css';
import List from './components/List';
import Detail from './components/Detail';

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [page, setPage] = useState(1);       
  const [limit, setLimit] = useState(20);    
  const [count, setCount] = useState(0);     

  useEffect(() => {
    const offset = (page - 1) * limit;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        setPokemons(data.results);
        setCount(data.count); // total available Pokémon

        if (data.results.length > 0) {
          const randomPokemon = data.results[Math.floor(Math.random() * data.results.length)];
          fetch(randomPokemon.url)
            .then(response => response.json())
            .then(pokemonData => setSelectedPokemon(pokemonData));
        }
      });
  }, [page, limit]);

  const handleSelectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const deselectPokemon = () => {
    setSelectedPokemon(null);
  };

  const totalPages = Math.ceil(count / limit);

  return (
    <div>
      <div className='heading'>
        <h1>Pokemon Gallery</h1>
      </div>

      <div className="app">
        <div>
          <List pokemons={pokemons} onSelectPokemon={handleSelectPokemon} />
        </div>

        <div>
          <Detail selectedPokemon={selectedPokemon} deselectPokemon={deselectPokemon} />
        </div>
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px" }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {/* Page Size Selector */}
      <div style={{ marginTop: "10px" }}>
        <label>Pokémon per page: </label>
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default App;
