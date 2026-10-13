import { useGameProvider } from '../context/GameProvider';
import './ScoreBoard.css';

const ScoreBoard = () => {
  const { score } = useGameProvider();

  return (
    <div className="panel score-panel">
      <h2>Score</h2>
      <p className="score-value">{score}</p>
    </div>
  );
};

export default ScoreBoard;
