import { useGameProvider } from '../context/GameProvider';
import './Timer.css';

const Timer = () => {
  const { timer, resetScore } = useGameProvider();

  return (
    <div className="panel timer-panel">
      <h2>Time</h2>
      <p className="timer-value">{timer}s</p>
      <button type="button" className="secondary-button" onClick={resetScore}>Restart</button>
    </div>
  );
};

export default Timer;
