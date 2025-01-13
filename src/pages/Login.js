import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { useSwipeable } from "react-swipeable";
import campusImageDesktop from "../media/campus-image.jpg";
import campusImageMobile from "../media/IMG_1230.JPG";
=======
>>>>>>> origin/main

const Login = () => {
  const [activeTab, setActiveTab] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [isSwipedUp, setIsSwipedUp] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleResize);
=======
  const navigate = useNavigate();

  useEffect(() => {
    // Restrict scrolling when this component is active
    document.body.style.overflow = "hidden";

    // Cleanup: reset the overflow when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
>>>>>>> origin/main
    };
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
<<<<<<< HEAD
=======

      // Fetch user document to check role
>>>>>>> origin/main
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) {
        alert("User document not found!");
        return;
      }
<<<<<<< HEAD
      const role = userDoc.data()?.userType;

      if (activeTab === "Student") {
        if (role === "student") navigate("/studentdashboard");
        else alert("You are not authorized to access the Student Dashboard.");
      } else if (activeTab === "Admin") {
        const adminDoc = await getDoc(doc(db, "authorizedAdmins", email));
        if (adminDoc.exists()) navigate("/admindashboard");
        else alert("You are not authorized to access the Admin Dashboard.");
=======

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
>>>>>>> origin/main
      } else {
        alert("Invalid login type.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }
  };

<<<<<<< HEAD
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setIsSwipedUp(true),
    onSwipedDown: () => setIsSwipedUp(false),
    trackTouch: true,
  });

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section - Image */}
      <div className="relative lg:w-[75%] w-full h-full">
        <img
          src={isMobile ? campusImageMobile : campusImageDesktop}
          alt="Campus"
          className="w-full h-full object-cover"
        />
        {/* Black Tint Overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col items-left justify-center px-4 mt-20">
          <div className="max-w-2xl text-left">
            <h1 className="text-2xl lg:text-5xl font-bold text-white mb-4">
              Welcome to Complaints and Suggestion portal
            </h1>
            <p className="text-sm lg:text-lg text-white">
              Your feedback matters! Use this portal to submit any complaints or suggestions. 
              We are committed to addressing your concerns and improving our services
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div
        className={`absolute lg:relative lg:w-[25%] w-full bg-white transition-all duration-700 ease-in-out 
          ${isSwipedUp && isMobile ? 'h-[85vh]' : 'h-[35vh]'} 
          lg:h-full top-10 bottom-0 left-0 z-10 rounded-t-3xl lg:rounded-none shadow-lg`}
        {...(isMobile ? swipeHandlers : {})}
      >
        <div className="h-full flex flex-col items-center justify-center px-8">
          {/* Swipe Instruction */}
          {!isSwipedUp && isMobile && (
            <div className="flex flex-col items-center text-gray-600 animate-bounce absolute top-4">
              <span className="text-sm font-semibold">Swipe up to log in</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          )}

          {/* Login Content */}
          <div
            className={`w-full max-w-md transition-opacity duration-500 ease-in-out 
              ${isSwipedUp || !isMobile ? 'opacity-100' : 'opacity-0'}`}
          >
            <h1 className="text-xl lg:text-2xl font-bold text-center text-dark-blue mb-6">
              Login Portal
            </h1>

            {/* Tabs */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab("Student")}
                className={`w-32 py-2 text-center font-semibold transition-all duration-300 rounded-lg border ${
                  activeTab === "Student"
                    ? "bg-dark-blue text-white border-dark-blue"
                    : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-300"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setActiveTab("Admin")}
                className={`w-32 py-2 text-center font-semibold transition-all duration-300 rounded-lg border ${
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email ID"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-dark-blue text-white py-2 rounded font-semibold hover:bg-dark-blue-600 transition duration-300"
              >
                Login as {activeTab}
              </button>
            </div>

            {/* Sign Up */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-indigo-700 font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
=======
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
>>>>>>> origin/main
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> origin/main
