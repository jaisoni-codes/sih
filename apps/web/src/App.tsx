import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { GovtHeader } from "./components/layout/GovtHeader";
import { GovtFooter } from "./components/layout/GovtFooter";
import { JharkhandSahayakChatbot } from "./components/ai/JharkhandSahayakChatbot";
import { WhatsAppSimulatorModal } from "./components/whatsapp/WhatsAppSimulatorModal";

// Public Pages
import { LandingPage } from "./pages/public/LandingPage";
import { LoginPage } from "./pages/public/LoginPage";
import { PublicTrackPage } from "./pages/public/PublicTrackPage";

// Dedicated RBAC Portals
import { CitizenPortalPage } from "./pages/portals/CitizenPortalPage";
import { HeiNodalPortalPage } from "./pages/portals/HeiNodalPortalPage";
import { FacultyPortalPage } from "./pages/portals/FacultyPortalPage";
import { StudentPortalPage } from "./pages/portals/StudentPortalPage";
import { IndustryPortalPage } from "./pages/portals/IndustryPortalPage";
import { GovtAdminPortalPage } from "./pages/portals/GovtAdminPortalPage";
import { ProjectLifecyclePage } from "./pages/ProjectLifecyclePage";

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#0f2942] selection:text-white">
            <GovtHeader />
            <main className="flex-1">
              <Routes>
                {/* Public Access */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/track" element={<PublicTrackPage />} />

                {/* Dedicated RBAC Portals */}
                <Route path="/portal/citizen" element={<CitizenPortalPage />} />
                <Route path="/portal/hei-nodal" element={<HeiNodalPortalPage />} />
                <Route path="/portal/faculty" element={<FacultyPortalPage />} />
                <Route path="/portal/student" element={<StudentPortalPage />} />
                <Route path="/portal/industry" element={<IndustryPortalPage />} />
                <Route path="/portal/admin" element={<GovtAdminPortalPage />} />

                {/* Legacy Route Redirects */}
                <Route path="/submit" element={<Navigate to="/portal/citizen" replace />} />
                <Route path="/my-problems" element={<Navigate to="/portal/citizen" replace />} />
                <Route path="/leaderboard" element={<Navigate to="/portal/citizen" replace />} />
                <Route path="/hei/dashboard" element={<Navigate to="/portal/hei-nodal" replace />} />
                <Route path="/hei/teams" element={<Navigate to="/portal/faculty" replace />} />
                <Route path="/industry/marketplace" element={<Navigate to="/portal/industry" replace />} />
                <Route path="/industry/agreements" element={<Navigate to="/portal/industry" replace />} />
                <Route path="/govt/dashboard" element={<Navigate to="/portal/admin" replace />} />
                {/* 5-Stage Project Lifecycle Tracker */}
                <Route path="/lifecycle" element={<ProjectLifecyclePage />} />
                <Route path="/lifecycle/:proposalId" element={<ProjectLifecyclePage />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <GovtFooter />
            <JharkhandSahayakChatbot />
            <WhatsAppSimulatorModal />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
