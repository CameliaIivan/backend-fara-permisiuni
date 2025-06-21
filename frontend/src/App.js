import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"

// Layouts
import MainLayout from "./layouts/MainLayout"

// Public Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ArticlesPage from "./pages/admin/ArticlesPage"
import ArticleDetailPage from "./pages/ArticleDetailPage"
import HospitalsPage from "./pages/HospitalsPage"
import HospitalDetailPage from "./pages/HospitalDetailPage"
import FaqPage from "./pages/admin/FaqPage"

// Protected Pages
import ProfilePage from "./pages/ProfilePage"
import GroupsPage from "./pages/GroupsPage"
import GroupDetailPage from "./pages/GroupDetailPage"
import GroupCreatePage from "./pages/GroupCreatePage"
import EventsPage from "./pages/EventsPage"
import EventDetailPage from "./pages/EventDetailPage"
import NewEventPage from "./pages/NewEventPage"
import MessagesPage from "./pages/MessagesPage"
import ConversationPage from "./pages/ConversationPage"
import NotificationsPage from "./pages/NotificationsPage"

// Admin Pages
import AdminDashboardPage from "./pages/admin/DashboardPage"
import AdminUsersPage from "./pages/admin/UsersPage"
import AdminArticlesPage from "./pages/admin/ArticlesPage"
import AdminHospitalsPage from "./pages/admin/HospitalsPage"
import AdminSpecializationsPage from "./pages/admin/SpecializationsPage"
import AdminFaqPage from "./pages/admin/FaqPage"
import PendingEventsPage from "./pages/admin/PendingEventsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            <Route path="hospitals" element={<HospitalsPage />} />
            <Route path="hospitals/:id" element={<HospitalDetailPage />} />
            <Route path="faq" element={<FaqPage />} />

            {/* Protected Routes */}
            <Route
              path="profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="groups"
              element={
                <PrivateRoute>
                  <GroupsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="groups/new"
              element={
                <PrivateRoute>
                  <GroupCreatePage />
                </PrivateRoute>
              }
            />
            <Route
              path="groups/:id"
              element={
                <PrivateRoute>
                  <GroupDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="events"
              element={
                <PrivateRoute>
                  <EventsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="events/new"
              element={
                <PrivateRoute>
                  <NewEventPage />
                </PrivateRoute>
              }
            />
            <Route
              path="events/:id"
              element={
                <PrivateRoute>
                  <EventDetailPage />
                </PrivateRoute>
              }
            />
            <Route
              path="messages"
              element={
                <PrivateRoute>
                  <MessagesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="messages/:id"
              element={
                <PrivateRoute>
                  <ConversationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/events"
              element={
                <AdminRoute>
                  <PendingEventsPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/articles"
              element={
                <AdminRoute>
                  <AdminArticlesPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/hospitals"
              element={
                <AdminRoute>
                  <AdminHospitalsPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/specializations"
              element={
                <AdminRoute>
                  <AdminSpecializationsPage />
                </AdminRoute>
              }
            />
            <Route
              path="admin/faq"
              element={
                <AdminRoute>
                  <AdminFaqPage />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
