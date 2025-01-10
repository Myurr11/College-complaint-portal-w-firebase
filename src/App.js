import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from './context/AuthContext';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MakeComplaint from './pages/MakeComplaint';
import MakeSuggestion from './pages/MakeSuggestion';
import logo from './media/logo_campus.png';
import campusBackground from './media/campus-image.jpg'; // Import the background image

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <AuthProvider>
      <Router basename="/">
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
       <div
  className={`pt-24 transition-all duration-300 ${!isSidebarCollapsed ? 'mr-64' : ''} min-h-screen bg-cover bg-center`}
  style={{
    backgroundImage: `url(${campusBackground})`, // Set default background image
  }}
>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/studentdashboard"
              element={<StudentDashboard isSidebarCollapsed={isSidebarCollapsed} />}
            />
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/makecomplaint" element={<MakeComplaint />} />
            <Route path="/makesuggestion" element={<MakeSuggestion />} />
          </Routes>
        </div>
        {/* Conditional Sidebar */}
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      </Router>
    </AuthProvider>
  );
}

function Header({ isSidebarCollapsed, toggleSidebar }) {
  const location = useLocation();
  const isVisible =
    location.pathname === '/studentdashboard' ||
    location.pathname === '/makecomplaint' ||
    location.pathname === '/makesuggestion';

  return (
    <header className="fixed top-0 left-0 w-full bg-opacity-40 backdrop-blur-md p-6 z-50 border-b border-yellow-500">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-20 h-12 sm:w-16 sm:h-12" />
          <h1 className="text-xl sm:text-lg font-semibold text-black hidden sm:block">
            Bharati Vidyapeeth (Deemed to be University)
          </h1>
        </div>
        <h1 className="text-lg sm:text-sm font-semibold text-black sm:hidden">
          Bharati Vidyapeeth (Deemed to be University)
        </h1>
        {isVisible && (
          <button
            onClick={toggleSidebar}
            className="text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isSidebarCollapsed ? '☰' : '✖'}
          </button>
        )}
      </div>
    </header>
  );
}

function Sidebar({ isSidebarCollapsed, toggleSidebar }) {
  const location = useLocation();
  const isVisible =
    location.pathname === "/studentdashboard" ||
    location.pathname === "/makecomplaint" ||
    location.pathname === "/makesuggestion";

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-y-24 right-0 z-50 bg-white text-black ${
        isSidebarCollapsed ? 'translate-x-full' : 'translate-x-0'
      } w-60 h-full overflow-y-auto shadow-lg transition-transform duration-300`}
    >
      <ul className="p-6 space-y-6">
        <li>
          <Link to="/studentdashboard" className="block hover:text-blue-300 text-lg font-semibold">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/makecomplaint" className="block hover:text-blue-300 text-lg font-semibold">
            Make Complaint
          </Link>
        </li>
        <li>
          <Link to="/makesuggestion" className="block hover:text-blue-300 text-lg font-semibold">
            Make Suggestion
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default App;