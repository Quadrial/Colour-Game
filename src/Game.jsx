import { useState, useEffect } from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  return `#${Array.from(
    { length: 6 },
    () => letters[Math.floor(Math.random() * 16)]
  ).join("")}`;
};

const generateColors = () => Array.from({ length: 6 }, () => getRandomColor());

const Game = () => {
  const [colorOptions, setColorOptions] = useState(generateColors());
  const [targetColor, setTargetColor] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [gameStatus, setGameStatus] = useState("");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem("bestScore")) || 0
  );
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setTargetColor(colorOptions[Math.floor(Math.random() * 6)]);
  }, [colorOptions]);

  const handleGuess = (color) => {
    setSelectedColor(color);

    if (color === targetColor) {
      setGameStatus("Correct! 🎉 New round...");
      setScore((prev) => prev + 1);

      if (score + 1 > bestScore) {
        setBestScore(score + 1);
        localStorage.setItem("bestScore", score + 1);
      }

      setTimeout(startNewRound, 800);
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
    setSelectedColor(null);
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setGameStatus("");
    setSelectedColor(null);
    setColorOptions(generateColors());
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      <main className="text-center text-4xl sm:text-5xl text-amber-700 font-bold font-serif">
        COLOUR<span className="block sm:inline sm:ml-4">MATCH</span>
      </main>

      <main className="border-amber-400 border-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto rounded-2xl mx-auto my-10 p-6 bg-white shadow-lg">
        {/* Score Section */}
        <div className="flex justify-between text-lg font-semibold text-gray-700">
          <div>
            BEST: <span className="text-green-600">{bestScore}</span>
          </div>
          <div>
            SCORES: <span className="text-blue-600">{score}</span>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <h2 data-testid="gameInstructions" className="text-lg font-bold">
            Guess the correct color!
          </h2>

          <div
            data-testid="colorBox"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-md border"
            style={{ backgroundColor: targetColor }}
          ></div>

          {/* Color Selection Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6">
            {colorOptions.map((color, index) => (
              <button
                key={index}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md border ${
                  selectedColor === color ? "ring-4 ring-black" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleGuess(color)}
              />
            ))}
          </div>

          {/* Game Status */}
          <p
            data-testid="gameStatus"
            className="font-semibold text-lg text-gray-800"
          >
            {gameStatus}
          </p>

          {/* Reset Game Button */}
          <button
            data-testid="newGameButton"
            onClick={resetGame}
            className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Reset Game
          </button>
        </div>
      </main>
    </section>
  );
};

export default Game;
