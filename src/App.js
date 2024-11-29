import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUp from "./auth/sign-up/SignUp";
import SignIn from "./auth/sign-in/SignIn";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
