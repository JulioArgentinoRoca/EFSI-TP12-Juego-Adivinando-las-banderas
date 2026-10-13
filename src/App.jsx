import './App.css';
import Flag from './components/Flag';
import GuessForm from './components/GuessForm';
import ScoreBoard from './components/ScoreBoard';
import Timer from './components/Timer';
import { GameProvider } from './context/GameProvider';

function App() {
  return (
    <GameProvider>
      <div className="app-shell">
        <header className="title-row">
          <h1>Guess the Flags</h1>
        </header>

        <main className="game-layout">
          <section className="main-column">
            <Flag />
            <GuessForm />
          </section>

          <aside className="sidebar-column">
            <ScoreBoard />
            <Timer />
          </aside>
        </main>
      </div>
    </GameProvider>
  );
}

export default App;
