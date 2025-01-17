import './App.css';
import Character from './components/Character/Character';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>RPG Character Builder</h1>
      </header>
      <section className="App-section">
        <Character />
      </section>
    </div>
  );
}

export default App;
