import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "../src/components/DashboardLayout";
import DashboardHome from "../src/pages/dashboard/DashboardHome";
import JobListingsPage from "../src/pages/dashboard/JobListingsPage";
import AssignmentsPage from "../src/pages/dashboard/AssignmentsPage";
import AnnouncementsPage from "../src/pages/dashboard/AnnouncementsPage";
import MessagesPage from "../src/pages/dashboard/MessagesPage";
import SettingsPage from "../src/pages/dashboard/SettingsPage";
import CandidateEmailPage from "./pages/dashboard/CandidateEmailPage";
import GetUpdatesPage from "./pages/dashboard/GetUpdatesPage";
import GetQuestionsPage from "./pages/dashboard/GetQuestionsPage";
import GetChatPage from "./pages/dashboard/GetChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="job-listings" element={<JobListingsPage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="candidate-email" element={<CandidateEmailPage />} />
          <Route path="get-updates" element={<GetUpdatesPage />} />
          <Route path="get-questions" element={<GetQuestionsPage />} />
          <Route path="chat" element={<GetChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
