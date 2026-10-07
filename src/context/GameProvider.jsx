import { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export const  GameProvider = ({ children }) => {

    const [score, setScore] = useState(0)
    const [currentCountry, setCurrentCountry] = useState('')
    const [user, setUser] = useState(null)
}