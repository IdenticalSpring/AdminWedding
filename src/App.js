import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignUp from "./auth/sign-up/SignUp";
import SignIn from "./auth/sign-in/SignIn";
import DashboardLayout from "./dashboard/Dashboard";
import MainGrid from "./dashboard/components/MainGrid";
import PrivateRoute from "./service/PrivateRoute";
import CreateTemplate from "./dashboard/CreateTemplate";
import TemplateManagement from "./dashboard/Template";
import DashboardLayoutv2 from "./dashboard/Dashboardv2";
import ViewTemplate from "./dashboard/ViewTemplate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
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
            <DashboardLayoutv2>
              <PrivateRoute>
                <CreateTemplate />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
        <Route
          path="/view-template/:templateId"
          element={
            <DashboardLayoutv2>
              <PrivateRoute>
                <ViewTemplate />
              </PrivateRoute>
            </DashboardLayoutv2>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
