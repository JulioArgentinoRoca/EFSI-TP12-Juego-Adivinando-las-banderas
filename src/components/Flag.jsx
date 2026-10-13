import { useGameProvider } from '../context/GameProvider';
import './Flag.css';

const Flag = () => {
  const { currentCountry, hintedName } = useGameProvider();

  if (!currentCountry) {
    return <p>Loading flag...</p>;
  }

  return (
    <div className="panel flag-panel">
      <img src={currentCountry.flag} alt={currentCountry.name} className="flag-image" />
      <p className="clue-text">{hintedName}</p>
    </div>
  );
};

export default Flag;
