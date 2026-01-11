import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import carImg from '../assets/scene 1/car.png';
import teddyImg from '../assets/scene 3/teady.png';

const CANVAS_WIDTH = 400; // Fixed game width
const CANVAS_HEIGHT = 700;
const CAR_SIZE = 70;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_HEIGHT = 100;
const TEDDY_SIZE = 40;
const INITIAL_SPEED = 8;
const MAX_SPEED = 25;
const SPEED_INCREMENT = 0.005;

function CarGame() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game/Physics state refs to avoid re-renders during loop
  const stateRef = useRef({
    carX: CANVAS_WIDTH / 2 - CAR_SIZE / 2,
    carLane: 1, // 0: left, 1: center, 2: right
    speed: INITIAL_SPEED,
    obstacles: [], // {x, y, type: 'rock'|'bluecar'}
    teddies: [],   // {x, y}
    bgOffset: 0,
    frames: 0,
  });

  const requestRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem('bean_car_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    // Keyboard listener
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        moveCar(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        moveCar(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const moveCar = (dir) => {
    const s = stateRef.current;
    const newLane = Math.max(0, Math.min(2, s.carLane + dir));
    if (newLane !== s.carLane) {
      s.carLane = newLane;
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    stateRef.current = {
      carX: CANVAS_WIDTH / 2 - CAR_SIZE / 2,
      carLane: 1,
      speed: INITIAL_SPEED,
      obstacles: [],
      teddies: [],
      bgOffset: 0,
      frames: 0,
    };
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const gameOver = () => {
    setGameState('gameover');
    cancelAnimationFrame(requestRef.current);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('bean_car_highscore', score);
    }
  };

  const gameLoop = () => {
    if (gameState !== 'playing') return;

    update();
    draw();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const update = () => {
    const s = stateRef.current;

    // Increase speed over time (accelerating)
    if (s.speed < MAX_SPEED) s.speed += SPEED_INCREMENT;

    s.frames++;
    s.bgOffset = (s.bgOffset + s.speed) % CANVAS_HEIGHT; // Scroll background down to simulate moving UP

    // Smooth car movement
    const targetX = (CANVAS_WIDTH / 3) * s.carLane + (CANVAS_WIDTH / 6) - CAR_SIZE / 2;
    s.carX += (targetX - s.carX) * 0.2; // Lerp for smooth lane change

    // Spawn Obstacles (Opposite Lane Traffic)
    // Decreasing spawn rate as speed increases to keep it fair? Or just simple mod.
    // At speed 10, 60 frames = 600px movement.
    const spawnRate = Math.max(30, Math.floor(100 - s.speed * 2));

    if (s.frames % spawnRate === 0) {
      if (Math.random() > 0.4) {
        const lane = Math.floor(Math.random() * 3);
        const obsX = (CANVAS_WIDTH / 3) * lane + (CANVAS_WIDTH / 6) - OBSTACLE_WIDTH / 2;
        // Don't spawn if too close to another obstacle
        const tooClose = s.obstacles.some(o => Math.abs(o.y - (-150)) < 200);
        if (!tooClose)
          s.obstacles.push({ x: obsX, y: -150, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT });
      }
    }

    // Spawn Teddies
    if (s.frames % 120 === 0) {
      const lane = Math.floor(Math.random() * 3);
      const tedX = (CANVAS_WIDTH / 3) * lane + (CANVAS_WIDTH / 6) - TEDDY_SIZE / 2;
      // Ensure not inside an obstacle
      const safe = !s.obstacles.some(o => Math.abs(o.y - (-150)) < 150 && o.x === ((CANVAS_WIDTH / 3) * lane + (CANVAS_WIDTH / 6) - OBSTACLE_WIDTH / 2));
      if (safe) {
        s.teddies.push({ x: tedX, y: -150, width: TEDDY_SIZE, height: TEDDY_SIZE, collected: false });
      }
    }

    // Move Objects DOWN (simulating player moving UP)
    // Obstacles move faster than road? Or same speed if they are static rocks?
    // User said "oposit lane with opstical". If it's traffic, they move towards you.
    // So relative speed = player_speed + obstacle_speed.
    // Let's make obstacles move slightly faster than the road markings to simulate oncoming traffic.
    const relativeSpeed = s.speed * 1.5;

    s.obstacles.forEach(o => o.y += relativeSpeed);
    s.teddies.forEach(t => t.y += s.speed); // Teddies are static on road, so they move at road speed

    // Collision Detection
    // Player Hitbox (smaller than sprite)
    const pBox = { x: s.carX + 15, y: CANVAS_HEIGHT - 130, w: CAR_SIZE - 30, h: CAR_SIZE - 20 };

    // Obstacles
    for (let o of s.obstacles) {
      if (
        pBox.x < o.x + o.width &&
        pBox.x + pBox.w > o.x &&
        pBox.y < o.y + o.height &&
        pBox.y + pBox.h > o.y
      ) {
        gameOver();
        return;
      }
    }

    // Teddies
    s.teddies.forEach(t => {
      if (!t.collected &&
        pBox.x < t.x + t.width &&
        pBox.x + pBox.w > t.x &&
        pBox.y < t.y + t.height &&
        pBox.y + pBox.h > t.y
      ) {
        t.collected = true;
        setScore(prev => prev + 10);
      }
    });

    // Score from distance/survival
    if (s.frames % 10 === 0) setScore(prev => prev + 1);

    // Cleanup
    s.obstacles = s.obstacles.filter(o => o.y < CANVAS_HEIGHT + 100);
    s.teddies = s.teddies.filter(t => t.y < CANVAS_HEIGHT + 100 && !t.collected);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;

    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Road Loop
    const roadY = s.bgOffset;

    // Draw Road Surface
    ctx.fillStyle = '#444'; // Asphalt
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Side Grass
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 0, 20, CANVAS_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - 20, 0, 20, CANVAS_HEIGHT);

    // Speed Lines (motion blur effect on sides)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < CANVAS_HEIGHT; i += 50) {
      if ((i + s.frames * 10) % 100 < 50) {
        ctx.fillRect(25, (i + s.bgOffset) % CANVAS_HEIGHT, 5, 30);
        ctx.fillRect(CANVAS_WIDTH - 30, (i + s.bgOffset) % CANVAS_HEIGHT, 5, 30);
      }
    }

    // Lane Markers (Dashed Lines)
    ctx.strokeStyle = '#FFF';
    ctx.setLineDash([40, 40]);
    ctx.lineDashOffset = -s.bgOffset;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 3, -100);
    ctx.lineTo(CANVAS_WIDTH / 3, CANVAS_HEIGHT + 100);
    ctx.moveTo((CANVAS_WIDTH / 3) * 2, -100);
    ctx.lineTo((CANVAS_WIDTH / 3) * 2, CANVAS_HEIGHT + 100);
    ctx.stroke();

    // Draw Obstacles (The Blue Reliant Regal)
    s.obstacles.forEach(o => {
      // Body
      ctx.fillStyle = '#0066CC'; // Blue
      ctx.fillRect(o.x, o.y, o.width, o.height);

      // Roof
      ctx.fillStyle = '#004C99';
      ctx.fillRect(o.x + 5, o.y + 10, o.width - 10, o.height - 30);

      // Windshield (Front facing player if they are coming at us)
      ctx.fillStyle = '#ADD8E6';
      ctx.fillRect(o.x + 8, o.y + 60, o.width - 16, 20);

      // Headlights
      ctx.fillStyle = '#FFF';
      ctx.beginPath();
      ctx.arc(o.x + 10, o.y + 90, 5, 0, Math.PI * 2);
      ctx.arc(o.x + o.width - 10, o.y + 90, 5, 0, Math.PI * 2);
      ctx.fill();

      // 3 Wheels (One in front/center, two back)
      // Since viewing from top/frontish, we just draw shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(o.x + 5, o.y + o.height - 5, 10, 10);
      ctx.fillRect(o.x + o.width - 15, o.y + o.height - 5, 10, 10);
    });

    // Draw Teddies
    s.teddies.forEach(t => {
      if (!t.collected) {
        // Brown Bear
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(t.x + t.width / 2, t.y + t.height / 2, t.width / 2, 0, Math.PI * 2);
        ctx.fill();
        // Inner Ears
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.arc(t.x + 8, t.y + 8, 6, 0, Math.PI * 2);
        ctx.arc(t.x + t.width - 8, t.y + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        // Face
        ctx.fillStyle = '#CD853F';
        ctx.beginPath();
        ctx.ellipse(t.x + t.width / 2, t.y + t.height / 2 + 5, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(t.x + t.width / 2 - 4, t.y + t.height / 2, 2, 0, Math.PI * 2);
        ctx.arc(t.x + t.width / 2 + 4, t.y + t.height / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Player Car (Green Mini)
    const cx = s.carX;
    const cy = CANVAS_HEIGHT - 130;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(cx + CAR_SIZE / 2, cy + CAR_SIZE - 5, CAR_SIZE / 2 + 5, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#ADFF2F'; // Citron Green
    ctx.beginPath();
    ctx.roundRect(cx, cy, CAR_SIZE, CAR_SIZE, 10);
    ctx.fill();

    // Hood (Black Stripe)
    ctx.fillStyle = '#111';
    ctx.fillRect(cx + CAR_SIZE / 2 - 10, cy, 20, 30); // Center stripe? Or hood.
    // Actually Mr Bean's car has a black hood
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.roundRect(cx + 5, cy + 5, CAR_SIZE - 10, 25, 5);
    ctx.fill();

    // Roof
    ctx.fillStyle = '#8FCE00'; // Slightly darker green
    ctx.fillRect(cx + 5, cy + 30, CAR_SIZE - 10, 30);

    // Windshield
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(cx + 8, cy + 35, CAR_SIZE - 16, 15);

    // Headlights
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(cx + 10, cy + 10, 6, 0, Math.PI * 2);
    ctx.arc(cx + CAR_SIZE - 10, cy + 10, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-900 overflow-hidden">

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-lg border-2 border-white"
        >
          ⬅ EXIT
        </button>
      </div>

      <div className="relative border-4 border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-gray-800">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block shadow-inner"
        />

        {/* UI Overlay */}
        <div className="absolute top-4 right-4 bg-black/60 px-4 py-2 rounded text-white font-mono text-xl font-bold border border-yellow-500">
          {score} PTS
        </div>

        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm z-20">
            <h1 className="text-5xl font-extrabold text-yellow-400 mb-2 italic tracking-tighter transform -skew-x-12">MINI RUSH</h1>
            <h2 className="text-xl font-bold mb-8 text-gray-300">WRONG WAY!</h2>

            <div className="flex flex-col gap-4 text-center mb-8 bg-white/10 p-6 rounded-xl">
              <p>⬆ You are driving UP!</p>
              <p>⬇ Traffic is coming DOWN!</p>
              <p className="mt-2 text-yellow-300">Dodge the Blue Cars!</p>
            </div>

            <div className="flex gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl">⬅</div>
                <div className="text-xs">Left</div>
              </div>
              <div className="text-center">
                <div className="text-4xl">➡</div>
                <div className="text-xs">Right</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-500 text-white font-black py-4 px-12 rounded-full text-2xl shadow-[0_0_20px_rgba(0,255,0,0.5)] animate-pulse transition-transform active:scale-95"
            >
              START ENGINE
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white z-20 backdrop-blur-md">
            <h2 className="text-6xl font-black mb-2 animate-bounce">CRASH!</h2>
            <div className="text-8xl mb-4">💥</div>

            <div className="bg-black/40 p-6 rounded-xl mb-8 text-center min-w-[200px]">
              <p className="text-sm uppercase tracking-widest text-gray-400">Final Score</p>
              <p className="text-5xl font-mono font-bold text-yellow-400">{score}</p>
              <div className="h-px bg-gray-500 my-4"></div>
              <p className="text-sm text-gray-400">Best: {highScore}</p>
            </div>

            <button
              onClick={startGame}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-10 rounded shadow-xl hover:scale-105 transition-all text-xl"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarGame;