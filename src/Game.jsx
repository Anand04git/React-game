import { useState, useEffect } from "react";
import "./App.css";
import Confetti from "react-confetti";
import axios from 'axios';

function Game({ user }) {
  const [numberToGuess, setNumberToGuess] = useState(
    Math.floor(Math.random() * 100) + 1
  );
  const [userGuess, setUserGuess] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pastScores, setPastScores] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.username}`
        );
        console.log("Fetched User Data:", response.data);
        setHighScore(response.data.highScore);
        setPastScores(response.data.pastScores);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);


  const handleGuess = () => {
    const guess = parseInt(userGuess);
    if (isNaN(guess)) {
      setMessage("Please enter a valid number!");
      return;
    }

    if (guess === numberToGuess) {
      setMessage("Correct! You guessed the number!");
      const newScore = score + 1;
      setScore( newScore );
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      saveScore(newScore);
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem("highScore", newScore);
        setShowConfetti(true);
      }
      setNumberToGuess(Math.floor(Math.random() * 100) + 1);
      setUserGuess("");
    } else if (guess < numberToGuess) {
      setMessage("Too low! Try again.");
    } else {
      setMessage("Too high! Try again.");
      setShowConfetti(false);
    }
  };

  const handleInputChange = (e) => {
    setUserGuess(e.target.value);
    setShowConfetti(false); // Stop confetti when the user starts typing a new guess
  };

  const saveScore = async (newScore) => {
    try {
      console.log('Sending score to backend:', newScore);
      const response = await axios.post(`http://localhost:5000/api/users/${user.username}/update-scores`, {
        score: newScore,
      });
      console.log('Score update response:', response.data);
      setHighScore(response.data.highScore);
      // setPastScores(response.data.pastScores);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

   // Render only the most recent past score
   const recentPastScore = pastScores.length > 0 ? pastScores[pastScores.length - 1] : null;

  return (
    <div>
      {showConfetti && <Confetti />}
      <h1>Number Guessing Game (1 -100)</h1>
      <p>Your Score: {score}</p>
      <p>High Score: {highScore}</p>
      <input
        type="text"
        value={userGuess}
        onChange={handleInputChange}
        placeholder="Enter your guess"
      />
      <button onClick={handleGuess}>Guess</button>
      <p>{message}</p>
      <h3>Recent Past Score</h3>
      {recentPastScore ? (
        <p>{`Score: ${recentPastScore.score} on ${new Date(recentPastScore.date).toLocaleDateString()}`}</p>
      ) : (
        <p>No past scores available</p>
      )}
    </div>
  );
}

export default Game;
