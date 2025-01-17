import './App.css'
import Character from './components/Character/Character'
import { useState, useEffect, Attributes } from 'react'
import { ATTRIBUTE_LIST, SKILL_LIST } from './consts'
import { DndCharacterData, Skill } from './types'

const GITHUB_USERNAME = 'migvill'
const API_URL = `https://recruiting.verylongdomaintotestwith.ca/api/${GITHUB_USERNAME}/character`

function App() {
  const [characters, setCharacters] = useState<DndCharacterData[]>([])
  const [isSaved, setIsSaved] = useState(false)

  function initializeAttributes(): Attributes {
    return ATTRIBUTE_LIST.reduce((acc, curr) => {
      acc[curr] = 10
      return acc
    }, {} as Attributes)
  }

  // Function to initialize skills to default value of 0
  function initializeSkills(): Skill {
    return SKILL_LIST.reduce((acc, { name }) => {
      acc[name] = 0
      return acc
    }, {} as Skill)
  }

  function addCharacter() {
    const newCharacter = {
      id: Date.now(),
      attributes: initializeAttributes(),
      skills: initializeSkills()
    } as DndCharacterData
    setCharacters((prevCharacters) => [
      ...prevCharacters,
      newCharacter
    ])
    setIsSaved(false)
  }

  function removeCharacter(id: number) {
    setCharacters((prevCharacters) => 
      prevCharacters.filter((char) => char.id !== id)
    )
    setIsSaved(false)
  }

  function saveCharacters() {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characters }),
    })
      .then(response => {
        if (response.ok) {
          setIsSaved(true)
        } else {
          throw new Error(`Unable to save character: ${response.status}`)
        }
      })
      .catch(error => {
        console.error('Fatal error saving characters:', error)
      })
  }

  function handleUpdateCharacter(updatedCharacter: DndCharacterData) {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === updatedCharacter.id ? updatedCharacter : char
      )
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>RPG Character Builder</h1>
      </header>
      <section className="App-section">
        <button onClick={addCharacter}>Add Character</button>
        <button onClick={saveCharacters} disabled={isSaved}>Save Characters</button>
        {characters.map((char, index) => (
          <div key={char.id} className="character-wrapper">
            <h2>Character {index + 1}</h2>
            <Character data={char} onUpdate={() => handleUpdateCharacter} />
            <button onClick={() => removeCharacter(char.id)}>Remove Character</button>
          </div>
        ))}
      </section>
    </div>
  )
}

export default App
