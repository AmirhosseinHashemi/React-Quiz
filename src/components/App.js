import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Error from "./Error";
import Loader from "./Loader";

const initialState = {
  questions: [],
  index: 0,
  // type of status : 👇
  // loading, error, ready, active, finished
  status: "loading",
};

const reducer = function (state, action) {
  switch (action.type) {
    case "dataRecived":
      return { ...state, questions: action.payLoad, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return { ...state, status: "active" };

    default:
      throw new Error("Unknown action type !");
  }
};

function App() {
  const [{ status, questions, index }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const numQuestions = questions.length;

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
        {status === "active" && <Question question={questions[index]} />}
      </Main>
    </div>
  );
}

export default App;
