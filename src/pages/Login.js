import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

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
    <div className="flex justify-center items-center min-h-screen m-0 p-0">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm">
        {/* Tabs */}
        <div className="flex mb-4 mt-4">
          <button
            onClick={() => setActiveTab("Student")}
            className={`w-1/2 py-2 text-center font-semibold rounded-t-md ${
              activeTab === "Student"
                ? "bg-dark-blue text-white border-b-4 border-dark-blue shadow-md"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("Admin")}
            className={`w-1/2 py-2 text-center font-semibold rounded-t-md ${
              activeTab === "Admin"
                ? "bg-dark-blue text-white border-b-4 border-dark-blue shadow-md"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <h2 className="text-2xl font-bold text-center text-dark-blue mb-4 mt-4">
          Login Portal
        </h2>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your Email ID"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
          />
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-dark-blue text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition duration-300"
          >
            Login as {activeTab}
          </button>
        </div>

        {/* Sign Up */}
        <p className="mt-4 text-center text-gray-600">
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
