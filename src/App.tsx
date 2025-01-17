import './App.css'
import Character from './components/Character/Character'
import { useState } from 'react'

function App() {
  const [characters, setCharacters] = useState([])

  function addCharacter() {
    const newCharacter = { id: Date.now() }
    setCharacters((prevCharacters) => [
      ...prevCharacters,
      newCharacter
    ])
  }

  function removeCharacter(id: number) {
    setCharacters((prevCharacters) => 
      prevCharacters.filter((char) => char.id !== id)
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>RPG Character Builder</h1>
      </header>
      <section className="App-section">
        <button onClick={addCharacter}>Add Character</button>
        {characters.map((char, index) => (
          <div key={char.id} className="character-wrapper">
            <h2>Character {index + 1}</h2>
            <Character />
            <button onClick={() => removeCharacter(char.id)}>Remove Character</button>
          </div>
        ))}
      </section>
    </div>
  )
}

export default App
