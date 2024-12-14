import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import './Login.css'; // Import the Tailwind-based CSS file

const Login = () => {
  const [activeTab, setActiveTab] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data()?.userType; // Read userType field
        if (role === "student") {
          navigate("/studentdashboard");
        } else if (role === "faculty") {
          navigate("/admindashboard");
        } else {
          alert("Invalid role in database.");
        }
      } else {
        alert("User document not found!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        {/* Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab("Student")}
            className={`tab-button ${activeTab === "Student" ? "active" : "inactive"}`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("Admin")}
            className={`tab-button ${activeTab === "Admin" ? "active" : "inactive"}`}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <h2 className="login-title">Login Portal</h2>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your Email ID"
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button
            onClick={handleLogin}
            className="login-button"
          >
            Login as {activeTab}
          </button>
        </div>

        {/* Sign Up */}
        <p className="signup-link">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-dark-blue font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
