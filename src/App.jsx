import { useState } from "react";
import { RandomWalk } from "./components/RandomWalk";

function App() {
  const [steps, setSteps] = useState(1000);
  const [startSim, setStartSim] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Floating input box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 border border-white/20 max-w-[90%]">

        <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center">
          🎲 Random Walk Simulator
        </h1>
        <p className="text-white/80 text-center">
          A simple random walk simulation visualized with a force-directed graph.
          Adjust the number of monomers and start the simulation!
          <br />
          Enter the number of monomers (100-10,000) to start the simulation.
          <br />
        </p>
        {/* Input and Button */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="number"
            className="p-3 rounded-md bg-white/20 text-white placeholder-white/80 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 w-64 text-center"
            placeholder="Enter the number of monomers"
            label="Number of monomers"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            min={100}
            max={10000}
          />
          <button
            onClick={() => setStartSim(!startSim)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-md transition-all duration-300"
          >
            {startSim ? "Reset" : "Start"}
          </button>
        </div>

      </div>

      {/* Random Walk Canvas */}
      <RandomWalk steps={steps} start={startSim} />
    </div>
  );
}

export default App;
