import TeamList from './teamList';
import './firebase';
import './App.css';

function App() {
  const handleClick = (buttonName) => {
    alert(`${buttonName} clicked`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cage Match</h1>

      </header>

      <main>
        <TeamList />
      </main>
    </div>
  );
}

export default App;
