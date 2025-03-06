import { useEffect, useState } from "react";
import { quizCategories } from "./data/quizCategories";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const Quiz = () => {
  const [failedQuestions, setFailedQuestions] = useState([]);
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [showNext, setShowNext] = useState(false);
  const [nota, setNota] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(null);
  const [selectedQuestionsCount, setSelectedQuestionsCount] = useState(null);
  const [failedQuestionsCount, setFailedQuestionsCount] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (questions.length > 0) {
      setNota((score / questions.length) * 10);
    } else {
      setNota(0);
    }
  }, [score, questions]);

  const startQuiz = (selectedCategory, customQuestions = null) => {
    const allQuestions = customQuestions || quizCategories[selectedCategory];
    const shuffledAll = shuffleArray(allQuestions);
    
    setCategory(selectedCategory);
    setQuestions(shuffledAll);
    setSelectedQuestionsCount(allQuestions.length);
    setTotalQuestionsCount(allQuestions.length);
    setFailedQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback(null);
    setShowNext(false);
    setShuffledOptions(shuffleArray(shuffledAll[0].options));
    setAnswered(false);
  };

  const handleAnswer = (option) => {
    if (!answered) {
      setSelectedOption(option);
      if (option.correct) {
        setScore(prev => prev + 1);
        setFeedback({ message: "¡Correcto!", correct: true });
      } else {
        const correctAnswer = questions[currentQuestion].options.find(opt => opt.correct).text;
        setFeedback({ message: `Respuesta correcta: ${correctAnswer}`, correct: false });
        setFailedQuestions(prev => [...prev, questions[currentQuestion]]);
      }
      setShowNext(true);
      setAnswered(true);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestion + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestion(nextIndex);
      setShuffledOptions(shuffleArray(questions[nextIndex].options));
      setFeedback(null);
      setShowNext(false);
      setAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  const retryFailedQuestions = () => {
    if (failedQuestions.length > 0) {
      setFailedQuestionsCount(failedQuestions.length);
      startQuiz(category, failedQuestions);
    }
  };

  const totalDisplay = failedQuestionsCount ?? selectedQuestionsCount ?? totalQuestionsCount ?? questions.length;

  return (
    <div className="p-6 xl:max-w-[80%] max-w-[95%] mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      <Analytics />
      <SpeedInsights />
      {!category ? (
        <div>
          <a href="https://www.kodedev.tech/" className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Volver</a>
          <h2 className="mt-5 font-bold">Test 200 preguntas</h2>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => startQuiz("cuestionarios")}
          >
            cuestionarios
          </button>
        </div>
      ) : showScore ? (
        <div>
          <h2 className="text-xl font-bold text-green-600">Tu puntuación: {score} / {totalDisplay}</h2>
          <h2 className="text-xl font-bold text-green-600">Tu nota: {nota.toFixed(2)}</h2>
          <button
            onClick={() => setCategory(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al menú
          </button>
          {failedQuestions.length > 0 && (
            <button
              onClick={retryFailedQuestions}
              className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reintentar preguntas falladas
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-5 text-xs w-full text-left flex flex-col xl:pt-9">
            <span className="text-gray-400 text-[70%]">{category}</span>
            <div>Pregunta nº: {currentQuestion + 1} / {totalDisplay}</div>
            <div className="font-semibold">Correctas: {score} / {totalDisplay}</div>
          </div>
          <h2 className="md:text-lg text-md font-semibold text-gray-700">{questions[currentQuestion]?.question}</h2>
          <div className="mt-4 space-y-4">
            {shuffledOptions.map((option, index) => (
              <button
                key={index}
                disabled={answered}
                onClick={() => handleAnswer(option)}
                className={`block w-full p-2 rounded transition-all ${answered ? (option.correct ? "bg-green-100 text-green-700" : selectedOption === option ? "bg-red-100 text-red-700" : "bg-gray-100") : "bg-gray-100 hover:bg-gray-300"}`}
              >
                {option.text}
              </button>
            ))}
          </div>
          {showNext && (
            <button onClick={nextQuestion} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700">
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;