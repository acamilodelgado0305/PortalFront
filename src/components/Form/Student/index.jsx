import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  questions,
  questionsEnglish,
  questionLanguajes,
  questionOther,
} from "./questionsData";
import './index.css'
import { TimeOptionButton } from "./components/TimeOptionButton";




function FormStudent() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [budget, setBudget] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showSuboptions, setShowSuboptions] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedSuboption, setSelectedSuboption] = useState(null);
  const [handleOtherValue, setHandleOtherValue] = useState(null)



  const [currentQuestions, setCurrentQuestions] = useState(questions);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("studentPreferences");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    if (isFormComplete) {
      const timer = setTimeout(() => {
        navigate('/results'); // Asumiendo que estás usando react-router-dom
      }, 3000); // Redirecciona después de 2 segundos

      return () => clearTimeout(timer);
    }
  }, [isFormComplete]);

  useEffect(() => {
    localStorage.setItem("studentPreferences", JSON.stringify(answers));
  }, [answers]);

  const handleOptionSelected = (option) => {
    if (handleOtherValue && currentQuestionIndex == 0) {
      setSelectedOption(handleOtherValue);
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = `${handleOtherValue}`;
      setAnswers(newAnswers);
      setCurrentQuestions(questionOther);
      return
    } else {
      setSelectedOption(option);
      setShowSuboptions(option.suboptions);
      if (!option.suboptions) {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = `${option.text}`;
        setAnswers(newAnswers);
      }
    }
  };

  const handleOptionList = (optionName, suboptions) => {
    if (optionName == "Idiomas" && suboptions == "Inglés") {
      setCurrentQuestions(questionsEnglish);
    } else if (optionName == "Idiomas") {
      setCurrentQuestions(questionLanguajes);
    } else {
      setCurrentQuestions(questionOther);
    }

  };

  const handleSuboptionSelected = (suboption) => {
    setSelectedSuboption(suboption);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] =
      `${selectedOption.text}+${suboption.text}`;
    setAnswers(newAnswers);
    if (selectedOption.text, suboption.text) {
      handleOptionList(selectedOption.text, suboption.text);
    }
  };


  const handleShowAllOptions = () => {
    setShowSuboptions(null);
    setSelectedOption(null);
    setSelectedSuboption(null);
  };




  const [isInputVisible, setIsInputVisible] = useState(false);

  const OptionButton = ({ text, isSelected, onClick }) => {
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [handleOtherValue, setHandleOtherValue] = useState("");

    const handleInputSubmit = () => {
      onClick();
      setIsInputVisible(false);
    };


    const timeOptions = ["Mañanas", "Tardes", "Noches", "Fines de semana", "Horario flexible"];

    return (
      <>
        {text === "Otro (especificar)" && isInputVisible ? (
          <input
            type="text"
            value={handleOtherValue}
            onChange={(e) => setHandleOtherValue(e.target.value)}
            onBlur={handleInputSubmit}
            className="w-full rounded-lg border p-4 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Especifica tu respuesta..."
            autoFocus
          />
        ) : timeOptions.includes(text) ? (
          <TimeOptionButton text={text} isSelected={isSelected} onClick={onClick} />
        ) : (
          <button
            onClick={() => {
              if (text === "Otro (especificar)") {
                setIsInputVisible(true);
              } else {
                onClick();
              }
            }}
            className={`flex w-full items-center justify-between rounded-lg border p-4 text-left text-lg font-semibold ${!isSelected ? "hover:bg-purple-100" : ""
              }  ${isSelected ? "border-purple-500 bg-purple-300" : "border-gray-300"
              }`}
          >
            <span>{text}</span>
          </button>
        )}
      </>
    );
  };




  const handleContinue = () => {
    if (!selectedOption && !selectedSuboption && currentQuestionIndex < 2) {
      return
    }

    if (currentQuestionIndex == 1)
      setShowSuboptions(false)
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleShowAllOptions();
    } else {
      finishForm();
    }
  };

  const finishForm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsFormComplete(true);
      localStorage.setItem("studentPreferences", JSON.stringify(answers));
    }, 2000);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      handleShowAllOptions();
    }
  };

  const handleBudgetChange = (e) => {
    const value = parseInt(e.target.value);
    setBudget(value);

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const renderProgressBar = () => {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    return (
      <div className="mb-4 h-[4px] w-full rounded-full bg-gray-200">
        <div
          className="h-[4px] rounded-full bg-purple-600"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const renderQuestionContent = () => {
    const currentQuestion = currentQuestions[currentQuestionIndex];

    if (currentQuestion.type === "slider") {
      return (
        <div className="w-full py-6 my-6 relative">
          <div className="h-4 w-full rounded-lg bg-gray-200">
            <div
              style={{ width: `${((budget - currentQuestion.min) / (currentQuestion.max - currentQuestion.min)) * 100}%` }}
              className="h-4 rounded-lg bg-purple-600"
            ></div>
          </div>
          <input
            type="range"
            min={currentQuestion.min}
            max={currentQuestion.max}
            step={currentQuestion.step}
            value={budget}
            onChange={handleBudgetChange}
            className="absolute -top-2 h-[50px] mt-4 w-full cursor-pointer appearance-none rounded-lg bg-transparent custom-range"
          />
          <div className="mt-4 text-center text-3xl font-semibold">
            {budget} {currentQuestion.unit}
          </div>
        </div>

      );
    }

    return (
      <div className="w-full ">
        {showSuboptions ? (
          <>
            <div className="mb-4 flex items-center">
              <button onClick={handleShowAllOptions} className="mr-2 text-3xl">
                ←
              </button>
              <h2 className="text-2xl font-bold">
                Subopciones de {selectedOption.text}
              </h2>
            </div>
            <div className="max-h-[45rem] overflow-y-auto">
              {showSuboptions.map((suboption, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuboptionSelected(suboption)}
                  className={`block w-full p-2 text-left text-lg font-normal ${selectedSuboption != suboption ? "hover:bg-purple-200" : ""}  ${selectedSuboption === suboption ? "bg-purple-300" : ""}`}
                >
                  {suboption.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="mb-4">
                <OptionButton
                  text={option.text}
                  isSelected={selectedOption === option}
                  onClick={() => handleOptionSelected(option)}
                  handleOtherValue={handleOtherValue}
                  setHandleOtherValue={setHandleOtherValue}
                />
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white-400 flex min-h-screen flex-col justify-center">
      <button
        onClick={() => navigate(-1)}
        className="text-purple absolute left-20 top-[10vh] md:top-20 bg-transparent text-5xl font-bold"
      >
        {window.innerWidth < 707 ? ((!showSuboptions) ? '←' : ' ') : ('←')}
      </button>

      <div className="flex md:h-screen items-center justify-center flex-col md:flex-row">
        <div className="flex h-full md:w-1/2 items-center p-4 md:p-10 md:pl-20">
          <h1 className="text-2xl md:text-7xl font-bold text-black  mt-[15vh] md:mt-0" >
            {window.innerWidth < 707 ? ((!showSuboptions) ? currentQuestions[currentQuestionIndex].question : '') : (currentQuestions[currentQuestionIndex].question)}

          </h1>
        </div>

        <div className="flex md:h-[100vh] w-[89%] md:w-[50%] flex-col items-center justify-center bg-white p-10 shadow-lg">
          {renderProgressBar()}
          {renderQuestionContent()}

          <div className="mt-8 flex w-full justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className={`${currentQuestionIndex === 0 ? "opacity-50" : ""
                } rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-700`}
            >
              Atrás
            </button>
            <button
              onClick={handleContinue}
              className="rounded-lg bg-purple-500 px-4 py-2 text-white hover:bg-purple-700"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>

      {isFormComplete && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-700 bg-opacity-75">

          <h2 className="w-full text-center text-2xl font-semibold text-white">
            Estamos buscando tu profesor ideal...
          </h2>
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>

        </div>
      )}
    </div>
  );
}

export default FormStudent;
