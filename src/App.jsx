import { useEffect, useState } from "react";
import { quizCategories } from "./data/quizCategories";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const Quiz = () => {
  // Estados para preguntas y control del quiz
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

  // Estados para los contadores de preguntas
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(null);
  const [selectedQuestionsCount, setSelectedQuestionsCount] = useState(null);
  const [failedQuestionsCount, setFailedQuestionsCount] = useState(null);

  // Calcular la nota según las preguntas contestadas.
  useEffect(() => {
    if (questions.length > 0) {
      setNota((score / questions.length) * 10);
    } else {
      setNota(0);
    }
  }, [score, questions]);

  // Iniciar el quiz de 40 preguntas
  const startQuiz = (selectedCategory, customQuestions = null) => {
    const allQuestions = customQuestions || quizCategories[selectedCategory];
    const shuffledAll = shuffleArray([...allQuestions]);
    const finalQuestions = shuffledAll

    setCategory(selectedCategory);
    setQuestions(finalQuestions);
    setSelectedQuestionsCount(200);
    setTotalQuestionsCount(null); // Reiniciamos totalQuestionsCount
    setFailedQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback(null);
    setShowNext(false);
    setShuffledOptions(shuffleArray([...finalQuestions[0].options]));
    setAnswered(false);
  };

  // Iniciar el quiz completo
  const startQuizComplet = (selectedCategory, customQuestions = null) => {
    const allQuestions = customQuestions || quizCategories[selectedCategory];
    const shuffledAll = shuffleArray([...allQuestions]);
    const finalQuestions = shuffledAll.slice(0, allQuestions.length);

    setCategory(selectedCategory);
    setQuestions(finalQuestions);
    setTotalQuestionsCount(finalQuestions.length); // Guardamos el total
    setSelectedQuestionsCount(null); // Reiniciamos selectedQuestionsCount
    setFailedQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback(null);
    setShowNext(false);
    setShuffledOptions(shuffleArray([...finalQuestions[0].options]));
    setAnswered(false);
  };

  const [selectedOption, setSelectedOption] = useState(null); // Para almacenar la opción seleccionada

  const handleAnswer = (option) => {
    if (!answered) {
      setSelectedOption(option); // Guardamos la opción seleccionada
      if (option.correct) {
        setScore((prev) => prev + 1);
        setFeedback({ message: "¡Correcto!", correct: true });
      } else {
        const correctAnswer = questions[currentQuestion].options.find(
          (opt) => opt.correct
        ).text;
        setFeedback({
          message: `Respuesta correcta: ${correctAnswer}`,
          correct: false,
        });
        setFailedQuestions((prev) => [...prev, questions[currentQuestion]]);
      }
      setShowNext(true);
      setAnswered(true);
    }
  };

  // Siguiente pregunta o mostrar resultados
  const nextQuestion = () => {
    const nextQuestionIndex = currentQuestion + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestion(nextQuestionIndex);
      setShuffledOptions(shuffleArray([...questions[nextQuestionIndex].options]));
      setFeedback(null);
      setShowNext(false);
      setAnswered(false);
    } else {
      setShowScore(true);
    }
  };

  // Reiniciar solo las preguntas falladas
  const retryFailedQuestions = () => {
    if (failedQuestions.length > 0) {
      setFailedQuestionsCount(failedQuestions.length); // Guardamos el número de falladas
      startQuiz(category, failedQuestions);
    }
  };

  // Determinar el total a mostrar en la puntuación
  const totalDisplay =
    failedQuestionsCount ??
    selectedQuestionsCount ??
    totalQuestionsCount ??
    questions.length;

  return (
    <div className="p-6 xl:max-w-[80%] max-w-[95%] mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
      <Analytics />
      <SpeedInsights />
      {/* Menú de inicio */}
      {!category ? (
        <div>
          <div>

            <a href="https://www.kodedev.tech/"><div className=" group-[link]: mt-4 ml-2 bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 md:text-md rounded hover:bg-red-700 cursor-pointer">Volver</div></a>

            <h2 className="mt-5 font-bold">Test 100 preguntas</h2>
            <button
              className="mt-4 bg-blue-500 text-white px-2 py-1 md:px-4 md:py-2 md:text-md rounded hover:bg-blue-700 cursor-pointer"
              onClick={() => startQuiz("cuestionarios")}
            >
              cuestionarios
            </button>
          </div>
        </div>
      ) : showScore ? (
        <div>
          <h2 className="text-xl font-bold text-green-600">
            Tu puntuación: {score} / {totalDisplay}
          </h2>
          <h2 className="text-xl font-bold text-green-600">
            Tu nota: {nota.toFixed(2)}
          </h2>
          <button
            onClick={() => setCategory(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Volver al menú
          </button>
          {failedQuestions.length > 0 && (
            <button
              onClick={retryFailedQuestions}
              className="mt-4 ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
            >
              Reintentar preguntas falladas
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-5 text-xs w-full text-left flex flex-col xl:pt-9">
            <span className="text-gray-400 text-[70%]">{category}</span>
            <div>
              Pregunta nº: {currentQuestion + 1}
              <div className="font-semibold">
                Correctas: {score} / {totalDisplay}
              </div>
            </div>
          </div>
          <h2 className="md:text-lg text-md font-semibold text-gray-700">
            {questions[currentQuestion]?.question}
          </h2>
          <div className="mt-4 space-y-4">
            {shuffledOptions.map((option, index) => (
              <button
                key={index}
                disabled={answered}
                onClick={() => handleAnswer(option)}
                className={`block w-full md:text-lg text-sm text-left p-2 rounded transition-all
      ${answered
                    ? option.correct
                      ? "outline-2 outline-green-500 bg-green-100 text-green-700"
                      : selectedOption === option
                        ? "outline-2 outline-red-500 bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"
                    : "bg-gray-100 hover:bg-gray-300 cursor-pointer"
                  }`}
              >
                {option.text}
              </button>
            ))}

          </div>
          {showNext && (
            <button
              onClick={nextQuestion}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 cursor-pointer"
            >
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;

