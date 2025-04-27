import { useState } from "react";
import { RandomWalk } from "./components/RandomWalk";

function App() {
  const [steps, setSteps] = useState(1000);
  const [startSim, setStartSim] = useState(false);

  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
      {/* Floating Title and Form */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-8 z-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">🎲 Random Walk Simulator</h1>
        
        {/* Centered Input and Button Container */}
        <div className="flex flex-col items-center justify-center gap-6 bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <input
            type="number"
            className="p-4 border-2 border-gray-300 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            min={100}
            max={10000}
          />
          <button
            onClick={() => setStartSim(!startSim)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
          >
            {startSim ? "Reset" : "Start"}
          </button>
        </div>
      </div>

      {/* Random Walk Visualization (Canvas) */}
      <RandomWalk steps={steps} start={startSim} />
    </div>
  );
}

export default App;
