import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function PaintWithMrBean() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [shape, setShape] = useState("brush");
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [task, setTask] = useState("");

  const tasks = ["Draw Teddy 🧸", "Draw Mr. Bean's Car 🚗", "Draw the Three-Wheeled Car 🚙", "Draw Irma Gobb 👩", "Draw Mr. Bean 👨"];

  useEffect(() => {
    setTask(tasks[Math.floor(Math.random() * tasks.length)]);

    // Initial resize (wait for layout)
    setTimeout(handleResize, 100);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas && containerRef.current) {
      // Save content
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCanvas.getContext('2d').drawImage(canvas, 0, 0);

      const { width, height } = containerRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      // Restore
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      // Draw back image scaled or centered? 
      // Simple restore: draw at 0,0. If canvas got smaller, crop. If bigger, whitespace.
      ctx.drawImage(tempCanvas, 0, 0);
    }
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.nativeEvent.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.nativeEvent.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getPos(e);
    setStartPos({ x, y });
    setDrawing(true);

    if (shape === "brush") {
      const ctx = canvasRef.current.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (shape === "brush") {
      ctx.lineTo(x, y);
      ctx.strokeStyle = isEraser ? "#FFFFFF" : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    e.preventDefault(); // Prevent scrolling on touch
  };

  const stopDrawing = (e) => {
    if (!drawing) return;

    if (shape !== 'brush') {
      // This is tricky on touchEnd because no coordinates.
      // For now, shape drawing on touch might be limited without tracking last move.
      // Let's assume mouse usage for complex shapes or just use last known move if we tracked it.
      // For simplicity, let's just complete the path if it's a brush.
    }

    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'mr-bean-art.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-200 overflow-hidden font-sans text-gray-800 touch-none">

      {/* Sidebar / Tools */}
      {/* Mobile: Top Bar (scrollable horizontally if needed), Desktop: Sidebar */}
      <aside className="w-full md:w-64 bg-slate-800 flex flex-row md:flex-col p-2 md:p-4 shadow-xl z-10 text-white shrink-0 overflow-x-auto md:overflow-y-auto items-center md:items-stretch gap-4 md:gap-0">

        <div className="mb-0 md:mb-6 flex items-center justify-between min-w-[150px] md:min-w-0">
          <h1 className="text-lg md:text-xl font-bold text-yellow-500 font-serif">🎨 Bean Studio</h1>
          <Link to="/" className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded ml-2">EXIT</Link>
        </div>

        {/* Tools Container */}
        <div className="flex flex-row md:flex-col gap-4 overflow-visible items-center md:items-stretch">

          {/* Task */}
          <div className="hidden md:block bg-yellow-100 text-black p-3 rounded shadow-md transform -rotate-1 mb-4">
            <p className="text-xs font-bold uppercase text-gray-500">Assignment</p>
            <p className="text-sm font-handwriting leading-tight">{task}</p>
          </div>

          {/* Brushes */}
          <div className="flex md:flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 min-w-[80px]">
              <button
                onClick={() => { setShape('brush'); setIsEraser(false); }}
                className={`p-2 rounded flex flex-col items-center justify-center ${shape === 'brush' && !isEraser ? 'bg-yellow-600' : 'bg-slate-700'}`}
              >
                ✏️
              </button>
              <button
                onClick={() => { setShape('brush'); setIsEraser(true); }}
                className={`p-2 rounded flex flex-col items-center justify-center ${isEraser ? 'bg-yellow-600' : 'bg-slate-700'}`}
              >
                🧹
              </button>
            </div>
          </div>

          {/* Color */}
          <div className="flex md:flex-col gap-2 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => { setColor(e.target.value); setIsEraser(false); }}
              className="w-8 h-8 md:w-full md:h-10 cursor-pointer rounded border-0"
            />
          </div>

          {/* Size */}
          <div className="w-24 md:w-full">
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
              className="w-full h-2 bg-slate-600 rounded-lg"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={clearCanvas} className="bg-red-800 p-2 rounded text-xs font-bold">
              🗑️
            </button>
            <button onClick={saveCanvas} className="bg-green-700 p-2 rounded text-xs font-bold">
              💾
            </button>
          </div>

        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 relative bg-gray-300 flex items-center justify-center p-2 md:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-repeat opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div
          ref={containerRef}
          className="w-full h-full bg-white shadow-2xl rounded-sm overflow-hidden cursor-crosshair border border-gray-400"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="block touch-none"
          />
        </div>
      </main>

    </div>
  );
}

export default PaintWithMrBean;
