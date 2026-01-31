import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  questions: Question[];
}

export const QuizGenerator = ({ bookId, chapterName }: { bookId: string; chapterName?: string }) => {
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadQuiz();
  }, [bookId, chapterName]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-study-material", {
        body: { bookId, materialType: "quiz", chapterName },
      });

      if (error) throw error;

      if (data?.material?.content) {
        setQuiz(data.material.content);
        setAnswers(new Array(data.material.content.questions.length).fill(null));
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
      toast({
        title: "Error",
        description: "Failed to load quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowResult(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowResult(false);
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (answer === quiz?.questions[index].correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers(new Array(quiz?.questions.length || 0).fill(null));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Generating quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No quiz available.</p>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (showResult && currentQuestion === quiz.questions.length - 1) {
    const percentage = (score / quiz.questions.length) * 100;
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
        <div className="mb-6">
          <p className="text-4xl font-bold mb-2">
            {score} / {quiz.questions.length}
          </p>
          <p className="text-muted-foreground">
            {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep studying!"}
          </p>
        </div>
        <Button onClick={resetQuiz}>Retake Quiz</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrectAnswer = showResult || answers[currentQuestion] !== null;

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  isSelected
                    ? showCorrectAnswer && isCorrect
                      ? "border-green-500 bg-green-50"
                      : showCorrectAnswer && !isCorrect
                      ? "border-red-500 bg-red-50"
                      : "border-primary bg-primary/5"
                    : showCorrectAnswer && isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrectAnswer && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {showCorrectAnswer && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {answers[currentQuestion] !== null && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={previousQuestion} disabled={currentQuestion === 0} variant="outline">
          Previous
        </Button>
        {currentQuestion === quiz.questions.length - 1 ? (
          <Button onClick={submitQuiz} disabled={answers.some((a) => a === null)}>
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={nextQuestion} disabled={answers[currentQuestion] === null}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
