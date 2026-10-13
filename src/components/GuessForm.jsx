import { useState } from 'react';
import { useGameProvider } from '../context/GameProvider';
import './GuessForm.css';

const GuessForm = () => {
  const { checkGuess, getHint } = useGameProvider();
  const [guess, setGuess] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!guess.trim()) return;

    checkGuess(guess);
    setGuess('');
  };

  return (
    <form className="panel guess-form" onSubmit={handleSubmit}>
      <label className="input-group">
        <span>Which country does this flag belong to?</span>
        <input
          type="text"
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Type the country name"
        />
      </label>

      <div className="actions-row">
        <button type="submit" className="primary-button">Submit</button>
        <button type="button" className="secondary-button" onClick={getHint}>Hint (-2s)</button>
      </div>
    </form>
  );
};

export default GuessForm;
