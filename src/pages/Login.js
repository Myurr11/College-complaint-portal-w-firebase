import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Restrict scrolling when this component is active
    document.body.style.overflow = "hidden";

    // Cleanup: reset the overflow when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user document to check role
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        alert("User document not found!");
        return;
      }

      const role = userDoc.data()?.userType; // Read userType field

      if (activeTab === "Student") {
        // If the active tab is Student, ensure the user is a student
        if (role === "student") {
          navigate("/studentdashboard");
        } else {
          alert("You are not authorized to access the Student Dashboard.");
        }
      } else if (activeTab === "Admin") {
        // If the active tab is Admin, check if the user is an authorized admin
        const adminDoc = await getDoc(doc(db, "authorizedAdmins", email));
        if (adminDoc.exists()) {
          navigate("/admindashboard");
        } else {
          alert("You are not authorized to access the Admin Dashboard.");
        }
      } else {
        alert("Invalid login type.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h1 className="text-xl font-bold text-center text-dark-blue mb-6">Login Portal</h1>
        {/* Tabs */}
        <div className="flex mb-8 justify-between">
  <button
    onClick={() => setActiveTab("Student")}
    className={`w-[48%] py-2 text-center font-semibold transition-all duration-300 rounded-lg border ${
      activeTab === "Student"
        ? "bg-dark-blue text-white border-dark-blue"
        : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-300"
    }`}
  >
    Student
  </button>
  <button
    onClick={() => setActiveTab("Admin")}
    className={`w-[48%] py-2 text-center font-semibold transition-all duration-300 rounded-lg border ${
      activeTab === "Admin"
        ? "bg-dark-blue text-white border-dark-blue"
        : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-300"
    }`}
  >
    Admin
  </button>
</div>

        {/* Login Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your Email ID"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-dark-blue text-white py-3 rounded font-semibold hover:bg-dark--600 transition duration-300"
          >
            Login as {activeTab}
          </button>
        </div>

        {/* Sign Up */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account? {" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-indigo-700 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
