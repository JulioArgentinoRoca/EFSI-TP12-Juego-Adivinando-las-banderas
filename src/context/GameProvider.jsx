import { createContext, useContext, useState, useEffect } from 'react';
import getCountries from "../services/api.js"

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {

    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(15)
    const [hints, setHints] = useState(0)
    const [currentCountry, setCurrentCountry] = useState('')
    const [countries, setCountries] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [leaderboard, setleaderboard] = useState([])
    const [hintedName, setHintedName] = useState('')

    useEffect(() => {

        const getCountriesApi = async () => {
            setCountries(await getCountries())
        }

        getCountriesApi()

    }, [])

    useEffect(() => {

        if (timer <= 0) {
            finishGame()
        }

    }, [timer])

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    const setGame = () => {
        pickCountry()
        resetTimer()
        setScore(0)
        setHints(0)
    }

    const finishGame = () => {

    }

    const pickCountry = () => {
        let rnd = getRandomInt(countries.length)
        setCurrentCountry(countries[rnd])
        setHintedName("_".repeat(currentCountry.length))
    }

    const resetTimer = () => {
        setTimer(15)
    }

    const getHint = () => {
        let rnd = getRandomInt(currentCountry.length)
        setHintedName(hintedName => {
            const arr = hintedName.split(''); 
            arr[rnd] = currentCountry[rnd]; 
            return arr.join('');            
        });
        setTimer(timer - 2)
        setHints(hints + 1)
    }

    const checkGuess = (guess) => {
        if (guess.toLowerCase() == currentCountry.toLowerCase()) {
            setScore(score + 10 + timer)
            setTimer(timer + 15)
        }
        else {
            setScore(score - 1)
        }

        pickCountry()
    }

    const login = (username) => setCurrentUser(username);
    const logout = () => setCurrentUser(null);

    return (
        <GameContext.Provider value={{ score, timer, hints, currentCountry, countries, leaderboard, currentUser, login, logout, pickCountry, checkGuess, setGame, finishGame }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGameProvider = () => {
    return useContext(GameContext);
};