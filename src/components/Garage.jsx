import React, { useState } from "react";
import { motion } from "framer-motion";

const Garage = () => {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("Teddy is hiding something... Can you figure it out?");
  const [code, setCode] = useState("");

  const handleClick = (item) => {
    if (step === 0 && item === "lever") {
      setStep(1);
      setMessage("The fan fell and revealed a switch!");
    } else if (step === 1 && item === "teddy") {
      setStep(2);
      setMessage("Teddy bounced! A code is now visible on the wall: 1234");
    } else if (step === 2 && item === "panel") {
      setMessage("Enter the 4-digit code:");
    }
  };

  const handleCodeInput = (e) => {
    setCode(e.target.value);
  };

  const handleSubmitCode = () => {
    if (code === "1234") {
      setStep(3);
      setMessage("✅ You unlocked the Flying Mini Cooper! Escape Successful!");
    } else {
      setMessage("❌ Wrong code. Teddy laughs at you.");
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-6">
      <h1 className="text-4xl text-yellow-300 font-bold">🧩 Teddy's Puzzle Room</h1>

      <motion.p
        className="text-center max-w-md text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {message}
      </motion.p>

      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        {step <= 2 && (
          <>
            <button
              onClick={() => handleClick("lever")}
              className="bg-gray-700 px-5 py-3 rounded hover:bg-yellow-500"
            >
              🕹 Pull Lever
            </button>
            <button
              onClick={() => handleClick("teddy")}
              className="bg-gray-700 px-5 py-3 rounded hover:bg-yellow-500"
            >
              🧸 Click Teddy
            </button>
            <button
              onClick={() => handleClick("panel")}
              className="bg-gray-700 px-5 py-3 rounded hover:bg-yellow-500"
            >
              🔢 Open Code Panel
            </button>
          </>
        )}

        {message.includes("Enter") && (
          <div className="flex flex-col items-center gap-3 mt-4">
            <input
              type="text"
              value={code}
              onChange={handleCodeInput}
              placeholder="Enter code"
              className="text-black px-4 py-2 rounded"
            />
            <button
              onClick={handleSubmitCode}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              ✅ Submit
            </button>
          </div>
        )}

        {step === 3 && (
          <motion.div
            className="text-6xl mt-6"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            🚗💨🎉
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Garage;
