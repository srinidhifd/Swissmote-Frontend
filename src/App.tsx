import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import PrivateRoute from "./components/PrivateRoute"; // Private Route to protect dashboard
import PostFullTimeJobPage from "./pages/dashboard/PostFullTimeJobPage";
import PostInternshipPage from "./pages/dashboard/PostInternshipPage";
import PostUnpaidInternshipPage from "./pages/dashboard/PostUnpaidInternshipPage";

import AssignmentsPage from "./pages/dashboard/AssignmentsPage";

import MessagesPage from "./pages/dashboard/MessagesPage";


import GetUpdatesPage from "./pages/dashboard/GetUpdatesPage";
import ReplyToCandidatePage from "./pages/dashboard/ReplyToCandidatePage";
import ReplyViaBotPage from "./pages/dashboard/ReplyViaBotPage";
import MarkBotEvaluationPage from "./pages/dashboard/MarkBotEvaluationPage";

import DailyUpdatesPage from "./pages/dashboard/DailyUpdatesPage";
import ReplyToDailyUpdatePage from "./pages/dashboard/ReplyToDailyUpdatePage";
import AutoListingsPage from "./pages/dashboard/AutoListingsPage";
import ActiveListingsPage from "./pages/dashboard/ActiveListingsPage";
import ClosedListingsPage from "./pages/dashboard/ClosedListingsPage";
import SendMessagePage from "./pages/dashboard/SendMessagePage";
import ChatPage from "./pages/dashboard/ChatPage";
import QuestionsPage from "./pages/dashboard/QuestionsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/home" element={<LandingPage />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<DashboardHome />} />
          {/* Job Management */}
          <Route path="job-management/full-time" element={<PostFullTimeJobPage />} />
          <Route path="job-management/internship" element={<PostInternshipPage />} />
          <Route path="job-management/unpaid-internship" element={<PostUnpaidInternshipPage />} />
          {/* Listings */}
          <Route path="listings/auto" element={<AutoListingsPage />} />
          <Route path="listings/active" element={<ActiveListingsPage />} />
          <Route path="listings/closed" element={<ClosedListingsPage />} />
          {/* Assignments */}


          <Route path="assignments" element={<AssignmentsPage />} />
          {/* Messaging */}

          <Route path="get-messages" element={<MessagesPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="send-message" element={<SendMessagePage />} />
          {/* Candidate Management */}
          <Route path="candidate-management/reply" element={<ReplyToCandidatePage />} />
          <Route path="candidate-management/bot-reply" element={<ReplyViaBotPage />} />

          {/* Evaluation */}
          
          <Route path="evaluation/bot-mark" element={<MarkBotEvaluationPage />} />
          {/* Reviews */}

          <Route path="reviews/daily" element={<DailyUpdatesPage />} />
          <Route path="reviews/reply" element={<ReplyToDailyUpdatePage />} />
          {/* Settings */}

          {/* Updates */}
          <Route path="get-updates" element={<GetUpdatesPage />} />
          <Route path="questions" element={<QuestionsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
