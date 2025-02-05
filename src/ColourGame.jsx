import { useState, useEffect } from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  return `#${Array.from({ length: 6 }, () =>
    letters[Math.floor(Math.random() * 16)]
  ).join("")}`;
};

const generateColors = () => Array.from({ length: 6 }, () => getRandomColor());

export default function ColorGame() {
  const [colorOptions, setColorOptions] = useState(generateColors());
  const [targetColor, setTargetColor] = useState("");
  const [gameStatus, setGameStatus] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setTargetColor(colorOptions[Math.floor(Math.random() * 6)]);
  }, [colorOptions]);

  const handleGuess = (color) => {
    if (color === targetColor) {
      setGameStatus("Correct! 🎉 New round...");
      setScore((prev) => prev + 1);
      startNewRound();
    } else {
      if (attempts + 1 >= 2) {
        setGameStatus("Game Over! Resetting...");
        setTimeout(resetGame, 1000);
      } else {
        setGameStatus("Wrong! One more try. ❌");
        setAttempts((prev) => prev + 1);
      }
    }
  };

  const startNewRound = () => {
    setColorOptions(generateColors());
    setGameStatus("");
    setAttempts(0);
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setGameStatus("");
    setColorOptions(generateColors());
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 data-testid="gameInstructions" className="text-lg font-bold">
        Guess the correct color!
      </h2>

      <div
        data-testid="colorBox"
        className="w-24 h-24 rounded-md border"
        style={{ backgroundColor: targetColor }}
      ></div>

      <div className="flex gap-2">
        {colorOptions.map((color, index) => (
          <button
            key={index}
            data-testid="colorOption"
            className="w-12 h-12 rounded-md border"
            style={{ backgroundColor: color }}
            onClick={() => handleGuess(color)}
          ></button>
        ))}
      </div>

      <p data-testid="gameStatus" className="font-semibold">{gameStatus}</p>
      <p data-testid="score" className="text-lg">Score: {score}</p>

      <button
        data-testid="newGameButton"
        onClick={resetGame}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        New Game
      </button>
    </div>
  );
}
