import { useEffect, useState } from "react";

export default function QuizView(props) {
  const {
    quizzes,
    currentPage,
    currentQuizIndex,
    setCurrentQuizIndex,
    onAnswerSubmit,
    onQuizComplete
  } = props;

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const currentQuiz = Array.isArray(quizzes) ? quizzes[currentQuizIndex] : null;


  if (!currentQuiz) {
    return (
      <div className="book-story-image-pages">
        <div className="book-page left-page">
          <img src={currentPage.imageUrl} alt={`${currentPage.pageNum} 페이지 그림`} />
        </div>
        <div className="book-page right-page quiz-container">
          <h2 className="quiz-question">아직 퀴즈를 생성하지 않았습니다.</h2>
        </div>
      </div>
    );
  }


  useEffect(() => {
    setSelectedAnswerIndex(null); // 퀴즈가 바뀌면 선택 리셋
  }, [currentQuiz]);

  const handleSelectAnswer = (index) => {
    setSelectedAnswerIndex(index);
  };

  const handlePrev = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedAnswerIndex === null) {
      alert("답을 선택해주세요!");
      return;
    }

    const quizId = currentQuiz.quizId;
    const selectedAnswer = selectedAnswerIndex + 1;

    onAnswerSubmit(quizId, selectedAnswer);

    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      onQuizComplete();
      console.log("last")
    }
  };

  const isLastQuiz = currentQuizIndex === quizzes.length - 1;
  


  return (
    <div className="book-story-image-pages">
      <div className="book-page left-page">
        <img src={currentPage.imageUrl} alt={`${currentPage.pageNum} 페이지 그림`} />
      </div>

      <div className="book-page right-page quiz-container">
        <h2 className="quiz-question">{currentQuiz.question}</h2>

        <div className="quiz-options-list">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              className={`quiz-option-button ${selectedAnswerIndex === index ? 'selected' : ''}`}
              onClick={() => handleSelectAnswer(index)}
            >
              {`${index + 1}. ${option}`}
            </button>
          ))}
        </div>

        <div className="quiz-navigation">
          <button
            className="quiz-nav-button"
            onClick={handlePrev}
            disabled={currentQuizIndex === 0}
          >
            이전
          </button>
          <button
            className="quiz-nav-button"
            onClick={handleNext}
          >
            {isLastQuiz ? "제출" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}