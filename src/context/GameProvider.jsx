import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const GameContext = createContext(null);

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const getRandomItem = (items = []) => {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
};

const buildHintedName = (countryName = '') =>
  Array.from(countryName)
    .map((character) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(character) ? '_' : character)
    .join('');

const parseCountries = (response) => {
  const data = Array.isArray(response?.data) ? response.data : response?.data?.data ?? [];

  return data
    .map((item) => ({
      name: item?.name || item?.country || '',
      flag: item?.flag || item?.image || item?.flagUrl || '',
    }))
    .filter((item) => item.name && item.flag);
};

export const GameProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [hintedName, setHintedName] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [hintsUsed, setHintsUsed] = useState(0);

  const chooseRandomCountry = (list = countries) => {
    const randomCountry = getRandomItem(list);

    if (!randomCountry) return null;

    setCurrentCountry(randomCountry);
    setHintedName(buildHintedName(randomCountry.name));
    setTimer(15);

    return randomCountry;
  };

  const resetScore = () => {
    setScore(0);
    setHintsUsed(0);
    chooseRandomCountry();
  };

  const getHint = () => {
    if (!currentCountry) return;

    const hiddenIndexes = currentCountry.name
      .split('')
      .map((character, index) => ({ character, index }))
      .filter(({ character, index }) => /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(character) && hintedName[index] === '_')
      .map(({ index }) => index);

    if (!hiddenIndexes.length) return;

    const randomIndex = getRandomItem(hiddenIndexes);
    const nextHintedName = hintedName.split('');
    nextHintedName[randomIndex] = currentCountry.name[randomIndex];

    setHintedName(nextHintedName.join(''));
    setHintsUsed((prev) => prev + 1);
    setTimer((prev) => Math.max(0, prev - 2));
  };

  const checkGuess = (guess) => {
    if (!currentCountry) return;

    const normalizedGuess = normalizeText(guess);
    const normalizedCountry = normalizeText(currentCountry.name);

    if (normalizedGuess === normalizedCountry) {
      setScore((prev) => prev + 10 + timer);
    } else {
      setScore((prev) => prev - 1);
    }

    chooseRandomCountry();
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/flag/images');
        const parsedCountries = parseCountries(response);
        setCountries(parsedCountries);
        chooseRandomCountry(parsedCountries);
      } catch (error) {
        console.error('Error cargando países:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!currentCountry) return;

    const intervalId = window.setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          window.clearInterval(intervalId);
          setScore((prevScore) => prevScore - 1);
          chooseRandomCountry();
          return 15;
        }

        return prevTimer - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [currentCountry, countries]);

  return (
    <GameContext.Provider
      value={{
        countries,
        currentCountry,
        hintedName,
        score,
        timer,
        hintsUsed,
        checkGuess,
        getHint,
        resetScore,
        chooseRandomCountry,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameProvider = () => useContext(GameContext);