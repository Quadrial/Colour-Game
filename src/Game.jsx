import { useState, useEffect } from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  return `#${Array.from(
    { length: 6 },
    () => letters[Math.floor(Math.random() * 16)]
  ).join("")}`;
};

const generateColors = (num) =>
  Array.from({ length: num }, () => getRandomColor());

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [colorOptions, setColorOptions] = useState(generateColors(6));
  const [targetColor, setTargetColor] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [gameStatus, setGameStatus] = useState("");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem("bestScore")) || 0
  );
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState("");

  useEffect(() => {
    setTargetColor(
      colorOptions[Math.floor(Math.random() * colorOptions.length)]
    );
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
    setColorOptions(
      generateColors(difficulty === "easy" ? 3 : difficulty === "hard" ? 9 : 6)
    );
    setGameStatus("");
    setAttempts(0);
    setSelectedColor(null);
    setHint("");
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setGameStatus("");
    setSelectedColor(null);
    setColorOptions(
      generateColors(difficulty === "easy" ? 3 : difficulty === "hard" ? 9 : 6)
    );
    setHint("");
  };

  const revealHint = () => {
    setHint(`Hint: The color starts with ${targetColor.slice(0, 2)}`);
  };

  if (!gameStarted) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl font-bold text-amber-700">COLOUR MATCH</h1>
        <div className="mt-6 flex flex-col items-center gap-4">
          <label className="text-lg font-semibold">Select Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-4 py-2 border rounded-lg text-lg"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={() => setGameStarted(true)}
            className="mt-4 px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition"
          >
            Start Game
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-amber-700">COLOUR MATCH</h1>
      <main className="border-amber-400 border-4 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto rounded-2xl mx-auto my-10 p-6 bg-white shadow-lg">
        <div className="flex justify-between text-lg font-semibold text-gray-700">
          <div>
            BEST: <span className="text-green-600">{bestScore}</span>
          </div>
          <div>
            SCORES: <span className="text-blue-600">{score}</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4">
          <h2 className="text-lg font-bold">Guess the correct color!</h2>
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
          <p className="font-semibold text-lg text-gray-800">{gameStatus}</p>
          <button
            onClick={revealHint}
            className="bg-yellow-500 text-white px-5 py-2 rounded-md hover:bg-yellow-600 transition"
          >
            Hint
          </button>
          {hint && <p className="text-gray-700 font-semibold">{hint}</p>}
          <button
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
