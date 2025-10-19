import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import wallImg from "../assets/scene 3/wall.png";
import teadyImg from "../assets/scene 3/teady.png";
import openDoarImg from "../assets/scene 3/openDoar.png";
import mrBeanImg from "../assets/scene 3/mrBean.png";
import frameImg from "../assets/scene 3/frame.png";
import doarImg from "../assets/scene 3/doar.png";
import selfImg from "../assets/scene 3/self.png";

function Garage() {
  const [lightsOff, setLightsOff] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const navigate = useNavigate(); // <-- required for routing

  const handleMouseMove = (e) => {
    const bounds = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });
  };

  const handleTurnOffLights = () => {
    setOverlayVisible(true);
    setTimeout(() => {
      setLightsOff(true);
    }, 300);
  };

  const handleTurnOnLights = () => {
    setLightsOff(false);
    setOverlayVisible(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-screen h-screen relative overflow-hidden bg-black"
    >
      {/* Background wall */}
      <img
        src={wallImg}
        alt="Wall"
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
      />

      {/* 🧸 Teddy → Car Game */}
      <img
        src={teadyImg}
        alt="Teddy"
        className="absolute top-[70%] left-[73%] w-[150px] cursor-pointer z-20"
        onClick={() => navigate("/car-game")}
      />

      {/* 👨 Mr. Bean → paint */}
      <img
        src={mrBeanImg}
        alt="Mr. Bean"
        className="absolute top-[18%] left-[48%] w-[450px] cursor-pointer z-10"
        onClick={() => navigate("/paintWithMrBean")}
      />

      {/* 🖼️ Frame → quiz */}
      <img
        src={frameImg}
        alt="Wall Frame"
        className="absolute top-[20%] left-[30%] w-[150px] cursor-pointer z-20"
        onClick={() => navigate("/quiz")}
      />

      {/* 🪟 Shelf → Mr. Bean Garage */}
      <img
        src={selfImg}
        alt="Shelf"
        className="absolute top-[-2%] left-[71%] w-[450px] cursor-pointer z-20"
        onClick={() => navigate("/garage")}
      />

      {/* 🚪 Closed Door */}
      <img
        src={doarImg}
        alt="Closed Door"
        className={`absolute bottom-[4%] left-[4%] w-[430px] cursor-pointer z-50 transition-opacity duration-500 ${
          lightsOff ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleTurnOffLights}
      />

      {/* 🚪 Open Door */}
      <img
        src={openDoarImg}
        alt="Open Door"
        className={`absolute top-[29%] left-[7%] w-[300px] z-[70] cursor-pointer transition-all duration-500 ${
          lightsOff ? "block" : "hidden"
        }`}
        onClick={handleTurnOnLights}
      />

      {/* 💡 Darkness Overlay */}
      {overlayVisible && (
        <div
          className={`absolute top-0 left-0 w-full h-full z-[60] pointer-events-none transition-opacity duration-1000 ease-in-out ${
            lightsOff ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `radial-gradient(circle 120px at ${cursorPos.x}px ${cursorPos.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`,
          }}
        />
      )}
    </div>
  );
}

export default Garage;
