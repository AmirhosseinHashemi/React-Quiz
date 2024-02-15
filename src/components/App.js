import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Error from "./Error";
import Loader from "./Loader";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";

const initialState = {
  questions: [],
  index: 0,
  // type of status : 👇
  // loading, error, ready, active, finished
  status: "loading",
  answer: null,
  points: 0,
};

const reducer = function (state, action) {
  switch (action.type) {
    case "dataRecived":
      return { ...state, questions: action.payLoad, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return { ...state, status: "active" };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payLoad,
        points:
          action.payLoad === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    default:
      throw new Error("Unknown action type !");
  }
};

function App() {
  const [{ status, questions, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecived", payLoad: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              points={points}
              numQuestions={numQuestions}
              answer={answer}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextQuestion dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}

export default App;
