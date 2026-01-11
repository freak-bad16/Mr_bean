import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  {
    questionText: "What is the name of Mr. Bean's teddy bear?",
    answerOptions: [
      { answerText: 'Bobby', isCorrect: false },
      { answerText: 'Teddy', isCorrect: true },
      { answerText: 'Billy', isCorrect: false },
      { answerText: 'Tommy', isCorrect: false },
    ],
  },
  {
    questionText: "What color is Mr. Bean's car?",
    answerOptions: [
      { answerText: 'Red', isCorrect: false },
      { answerText: 'Blue', isCorrect: false },
      { answerText: 'Green (Citron)', isCorrect: true },
      { answerText: 'Yellow', isCorrect: false },
    ],
  },
  {
    questionText: "What is Mr. Bean's first name?",
    answerOptions: [
      { answerText: 'Julian', isCorrect: false },
      { answerText: 'Rowan', isCorrect: false },
      { answerText: 'Mr.', isCorrect: true },
      { answerText: 'Bean', isCorrect: false },
    ],
  },
  {
    questionText: "Who is Mr. Bean's girlfriend?",
    answerOptions: [
      { answerText: 'Irma Gobb', isCorrect: true },
      { answerText: 'Sarah', isCorrect: false },
      { answerText: 'Mary', isCorrect: false },
      { answerText: 'Queen Elizabeth', isCorrect: false },
    ],
  },
  {
    questionText: "Which car does Mr. Bean hate?",
    answerOptions: [
      { answerText: 'Reliant Regal (Blue 3-wheeler)', isCorrect: true },
      { answerText: 'Porsche 911', isCorrect: false },
      { answerText: 'Ford Fiesta', isCorrect: false },
      { answerText: 'Mini Cooper', isCorrect: false },
    ],
  },
];

function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleAnswerOptionClick = (isCorrect, index) => {
    if (isAnswering) return;
    setIsAnswering(true);
    setSelectedAnswer({ index, isCorrect });

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsAnswering(false);
      } else {
        setShowScore(true);
      }
    }, 1000); // Wait 1s before next question
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswering(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-800 text-gray-800 p-4 font-sans relative overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 bg-white text-black font-bold py-2 px-4 rounded shadow hover:bg-gray-200 z-10 font-handwriting text-xl"
      >
        ⬅ Back Home
      </button>

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-paper-texture border-4 border-gray-300 rounded-sm p-8 w-full max-w-2xl shadow-2xl relative bg-[#fdfbf7]"
        style={{ transform: 'rotate(-1deg)' }}
      >
        {/* Tape effect */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/50 transform rotate-1 shadow-sm"></div>

        <h1 className="text-4xl text-center font-bold text-gray-800 border-b-4 border-double border-gray-300 pb-4 mb-6 font-serif tracking-wide">
          📝 The Bean Exam
        </h1>

        <AnimatePresence mode='wait'>
          {showScore ? (
            <motion.div
              key="score"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="absolute -right-8 -top-8 rotate-12 text-6xl opacity-20 text-red-600 font-black border-4 border-red-600 p-2 rounded">GRADED</div>

              <h2 className="text-4xl font-bold mb-4 font-handwriting">Exam Completed!</h2>
              <div className="text-3xl mb-6">
                You scored <span className="font-bold text-red-600">{score}</span> / {questions.length}
              </div>
              <p className="mb-8 text-2xl italic text-gray-600 font-serif">
                {score === questions.length ? "Teddy is proud of you! 🧸 A+" :
                  score > 2 ? "Passable... barely. 😐 C-" :
                    "Mr. Bean is very disappointed... 🤨 F"}
              </p>
              <button
                onClick={resetQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                Retake Exam
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-2">
                <span className="text-lg font-bold text-gray-500 uppercase tracking-widest">Question {currentQuestion + 1}</span>
              </div>

              <div className="text-2xl font-serif font-medium mb-8 leading-relaxed">
                {questions[currentQuestion].questionText}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].answerOptions.map((answerOption, index) => {
                  let btnClass = "bg-white hover:bg-gray-50 text-left px-6 py-4 rounded border-2 border-gray-200 transition-all font-serif text-lg font-semibold text-gray-700 shadow-sm hover:shadow-md";

                  if (selectedAnswer) {
                    if (index === selectedAnswer.index) {
                      btnClass = selectedAnswer.isCorrect
                        ? "bg-green-100 border-green-500 text-green-800 shadow-inner"
                        : "bg-red-100 border-red-500 text-red-800 shadow-inner";
                    } else if (answerOption.isCorrect && !selectedAnswer.isCorrect) {
                      // Show correct answer if wrong one picked
                      btnClass = "bg-green-50 border-green-300 text-green-800 opacity-70";
                    } else {
                      btnClass = "bg-gray-100 text-gray-400 border-gray-100";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerOptionClick(answerOption.isCorrect, index)}
                      disabled={isAnswering}
                      className={btnClass}
                    >
                      <span className="mr-3 text-gray-400 font-bold">{String.fromCharCode(65 + index)}.</span>
                      {answerOption.answerText}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

    </div>
  );
}

export default Quiz;