import { useEffect, useReducer } from "react";
import Header from "./Header";

const initialState = {
  questions: [],

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

    default:
      throw new Error("Unknown action type !");
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecived", payLoad: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
    </div>
  );
}

export default App;
