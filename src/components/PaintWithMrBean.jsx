import React, { useRef, useState, useEffect } from "react";

function PaintWithMrBean() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [drawing, setDrawing] = useState(false);
  const [shape, setShape] = useState("brush");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [task, setTask] = useState("");

  const tasks = ["Draw Teddy 🧸", "Draw Mr. Bean's Car 🚗", "Draw Pigeon 🐦", "Draw Cat 🐱", "Draw Mr. Bean 👨"];

  useEffect(() => {
    setTask(tasks[Math.floor(Math.random() * tasks.length)]);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPos({ x: offsetX, y: offsetY });
    if (shape === "brush") {
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    }
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (shape === "brush") {
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (!drawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (shape === "rectangle") {
      const width = offsetX - startPos.x;
      const height = offsetY - startPos.y;
      ctx.fillStyle = color;
      ctx.fillRect(startPos.x, startPos.y, width, height);
    } else if (shape === "circle") {
      const radius = Math.sqrt(
        Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTask(tasks[Math.floor(Math.random() * tasks.length)]);
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen bg-gradient-to-br from-yellow-200 via-pink-100 to-white p-6">
      <h1 className="text-4xl font-extrabold text-brown-800 mb-6">🎨 Paint with Mr. Bean</h1>

      <div className="flex flex-wrap gap-4 items-center justify-center mb-4">
        <label className="text-lg font-medium">Color:</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

        <label className="text-lg font-medium">Brush Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(e.target.value)}
        />

        <label className="text-lg font-medium">Shape:</label>
        <select
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="px-2 py-1 rounded border"
        >
          <option value="brush">🖌️ Brush</option>
          <option value="rectangle">⬛ Rectangle</option>
          <option value="circle">⚪ Circle</option>
        </select>

        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-bold"
        >
          🧽 Clear Canvas
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth * 0.9}
        height={window.innerHeight * 0.7}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-4 border-gray-800 bg-white rounded shadow-xl"
      />

      <div className="mt-4 text-xl font-semibold text-purple-700 bg-purple-100 px-6 py-3 rounded shadow">
        ✏️ Your Task: <span className="text-black">{task}</span>
      </div>
    </div>
  );
}

export default PaintWithMrBean;
