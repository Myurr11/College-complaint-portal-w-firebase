import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MakeComplaint from './pages/MakeComplaint';
import MakeSuggestion from './pages/MakeSuggestion';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/makecomplaint" element={<MakeComplaint />} />
        <Route path="/makesuggestion" element={<MakeSuggestion />} />
      </Routes>
    </Router>
  );
}

export default App;
