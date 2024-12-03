import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUp from "./auth/sign-up/SignUp";
import SignIn from "./auth/sign-in/SignIn";
import DashboardLayout from "./dashboard/Dashboard";
import MainGrid from "./dashboard/components/MainGrid";
import PrivateRoute from "./service/PrivateRoute";
import CreateTemplate from "./dashboard/CreateTemplate";
import TemplateManagement from "./dashboard/Template";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        {/* <Route path="/sign-up" element={<SignUp />} /> */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <PrivateRoute>
                {" "}
                <MainGrid />
              </PrivateRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/template"
          element={
            <DashboardLayout>
              <PrivateRoute>
                <TemplateManagement />
              </PrivateRoute>
            </DashboardLayout>
          }
        />
        <Route
          path="/create-template"
          element={
            <PrivateRoute>
              <CreateTemplate />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
