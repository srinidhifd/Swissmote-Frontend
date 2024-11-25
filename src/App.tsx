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
import AutomateListingsPage from "./pages/dashboard/AutomateListingsPage";
import AssignmentsPage from "./pages/dashboard/AssignmentsPage";
import AddAssignmentPage from "./pages/dashboard/AddAssignmentPage";
import GetAssignmentsPage from "./pages/dashboard/GetAssignmentsPage";
import AnnouncementsPage from "./pages/dashboard/AnnouncementsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import CandidateEmailPage from "./pages/dashboard/CandidateEmailPage";
import GetUpdatesPage from "./pages/dashboard/GetUpdatesPage";
import GetQuestionsPage from "./pages/dashboard/GetQuestionsPage";
import ReplyToQuestionsPage from "./pages/dashboard/ReplyToQuestionsPage";
import GetChatPage from "./pages/dashboard/GetChatPage";
import ReplyToCandidatePage from "./pages/dashboard/ReplyToCandidatePage";
import ReplyViaBotPage from "./pages/dashboard/ReplyViaBotPage";
import HireCandidatePage from "./pages/dashboard/HireCandidatePage";
import MarkEvaluationPage from "./pages/dashboard/MarkEvaluationPage";
import MarkBotEvaluationPage from "./pages/dashboard/MarkBotEvaluationPage";
import MarkFutureEvaluationPage from "./pages/dashboard/MarkFutureEvaluationPage";
import AddReviewPage from "./pages/dashboard/AddReviewPage";
import DailyUpdatesPage from "./pages/dashboard/DailyUpdatesPage";
import ReplyToDailyUpdatePage from "./pages/dashboard/ReplyToDailyUpdatePage";
import AutoListingsPage from "./pages/dashboard/AutoListingsPage";
import ActiveListingsPage from "./pages/dashboard/ActiveListingsPage";
import ClosedListingsPage from "./pages/dashboard/ClosedListingsPage";
import ListingStatusPage from "./pages/dashboard/ListingStatusPage";
import SendMessagePage from "./pages/dashboard/SendMessagePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<DashboardHome />} />
          {/* Job Management */}
          <Route path="job-management/full-time" element={<PostFullTimeJobPage />} />
          <Route path="job-management/internship" element={<PostInternshipPage />} />
          <Route path="job-management/unpaid-internship" element={<PostUnpaidInternshipPage />} />
          {/* Listings */}
          <Route path="listings/auto" element={<AutoListingsPage />} />
          <Route path="listings/automate" element={<AutomateListingsPage />} />
          <Route path="listings/active" element={<ActiveListingsPage />} />
          <Route path="listings/closed" element={<ClosedListingsPage />} />
          <Route path="listings/status" element={<ListingStatusPage />} />
          {/* Assignments */}
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="assignments/add" element={<AddAssignmentPage />} />
          <Route path="assignments/get" element={<GetAssignmentsPage />} />
          {/* Messaging */}
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="get-messages" element={<MessagesPage />} />
          <Route path="chat" element={<GetChatPage />} />
          <Route path="send-message" element={<SendMessagePage />} />
          {/* Candidate Management */}
          <Route path="candidate-management/reply" element={<ReplyToCandidatePage />} />
          <Route path="candidate-management/bot-reply" element={<ReplyViaBotPage />} />
          <Route path="candidate-management/hire" element={<HireCandidatePage />} />
          <Route path="candidate-management/email" element={<CandidateEmailPage />} />
          {/* Evaluation */}
          <Route path="evaluation/mark" element={<MarkEvaluationPage />} />
          <Route path="evaluation/bot-mark" element={<MarkBotEvaluationPage />} />
          <Route path="evaluation/future-mark" element={<MarkFutureEvaluationPage />} />
          {/* Questions */}
          <Route path="questions/get" element={<GetQuestionsPage />} />
          <Route path="questions/reply" element={<ReplyToQuestionsPage />} />
          {/* Reviews */}
          <Route path="reviews/add" element={<AddReviewPage />} />
          <Route path="reviews/daily" element={<DailyUpdatesPage />} />
          <Route path="reviews/reply" element={<ReplyToDailyUpdatePage />} />
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          {/* Updates */}
          <Route path="get-updates" element={<GetUpdatesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
