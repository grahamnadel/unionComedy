import TeamList from './teamList';
import './firebase';
import './App.css';
import QRCodeFooter from "./qrCode";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cage Match</h1>

      </header>

      <main>
        <TeamList />
        <QRCodeFooter />
      </main>
    </div>
  );
}

export default App;
