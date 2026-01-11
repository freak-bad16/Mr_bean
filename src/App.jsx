import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroScene from "./components/IntroScene";

import MrBeansRoom from "./components/MrBeansRoom";
import CarGame from "./components/CarGame";
import Quiz from "./components/Quiz";
import PaintWithMrBean from "./components/PaintWithMrBean";


function App() {
  const [hideIntro, setHideIntro] = useState(false);

  // After 5 seconds, hide the intro scene
  useEffect(() => {
    const timer = setTimeout(() => {
      setHideIntro(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative overflow-hidden">
              {/* Intro scene slides up after 5 sec */}
              <div
                className={`fixed top-0 left-0 w-full h-screen z-50 transition-transform duration-[1500ms] ease-in-out ${hideIntro ? "-translate-y-full" : "translate-y-0"
                  }`}
              >
                <IntroScene />
              </div>

              {/* Main content (hidden under intro initially) */}
              {/* Main content (hidden under intro initially) */}
              <div className="relative z-10 w-full h-screen">
                <MrBeansRoom />
              </div>
            </div>
          }
        />

        <Route path="/car-game" element={<CarGame />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/paintWithMrBean" element={<PaintWithMrBean />} />

      </Routes>
    </Router>
  );
}

export default App;
