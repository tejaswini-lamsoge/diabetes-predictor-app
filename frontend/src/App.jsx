import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Assessment from "./pages/Assessment";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Result from "./pages/Result";
import History from "./pages/History";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";

function Placeholder({ title }) {

  return (

    <div className="placeholder-page">

      <h1>{title}</h1>

      <p>
        This section will be developed next.
      </p>

    </div>

  );

}


function App() {

  return (

    <BrowserRouter>

      <div className="app-layout">

        {/* =========================
            SIDEBAR
        ========================= */}

        <Sidebar />


        {/* =========================
            MAIN CONTENT
        ========================= */}

        <main className="main-content">

          <Routes>


            {/* =========================
                DASHBOARD
            ========================= */}

            <Route
              path="/"
              element={<Dashboard />}
            />


            {/* =========================
                PATIENTS
            ========================= */}

            <Route
              path="/patients"
              element={<Patients />}
            />


            {/* =========================
                NEW ASSESSMENT
            ========================= */}

            <Route
              path="/assessment"
              element={<Assessment />}
            />


            {/* =========================
                ASSESSMENT RESULT
            ========================= */}

            <Route
              path="/assessment/:assessmentId"
              element={<Result />}
            />


            {/* =========================
                ASSESSMENT HISTORY
            ========================= */}

            <Route
              path="/history"
              element={<History />}
            />


            {/* =========================
                OTHER PAGES
            ========================= */}

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/settings"
              element={
                <Placeholder title="Settings" />
              }
            />

            <Route
              path="/help"
              element={
                <Placeholder title="Help & Support" />
              }
            />


            {/* =========================
                FALLBACK
            ========================= */}

            <Route
              path="*"
              element={
                <Placeholder title="Page Not Found" />
              }
            />


          </Routes>

        </main>

      </div>

    </BrowserRouter>

  );

}


export default App;