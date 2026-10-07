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
    const [gamemode, setGamemode] = useState('classic')

    useEffect(() => {

        const getCountriesApi = async () => {
            setCountries(await getCountries())
        }

        getCountriesApi()

        if (localStorage.getItem("leaderboard") != null) {
            setleaderboard(JSON.parse(localStorage.getItem("leaderboard")))
        } else {
            setleaderboard([])
            localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        }

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
        const newLeaderboard = [...leaderboard, {"user": currentUser, "score": score}].sort((a, b) => b.score - a.score)
        setleaderboard(newLeaderboard)
        localStorage.setItem("leaderboard", JSON.stringify(newLeaderboard))
    }

    const pickCountry = () => {
        let rnd = getRandomInt(countries.length)
        setCurrentCountry(countries[rnd])
        setHintedName("_".repeat(countries[rnd].length))
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

    const pickGamemode = () => {
        if(gamemode === "classic"){
            setGamemode("capitals")
        }else{
            setGamemode("classic")
        }
    }

    const login = (username) => {
        setCurrentUser(username)
        localStorage.setItem("user", JSON.stringify(currentUser))
    }
    const logout = () => {
        setCurrentUser(null)
        localStorage.removeItem("user")
    }

    return (
        <GameContext.Provider value={{ score, timer, hints, currentCountry, countries, hintedName, leaderboard, currentUser, login, logout, pickCountry, checkGuess, getHint, setGame, finishGame, pickGamemode }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGameProvider = () => {
    return useContext(GameContext);
};