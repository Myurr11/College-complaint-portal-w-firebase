import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    contactNumber: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    department: "Select department", // Default department
    userType: "Select UserType", // Default role
  });

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const { email, password, ...userData } = formData;
      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Include the userId (uid) and email in the document
      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...userData, // Include other user data like firstName, lastName, etc.
        email: email, // Explicitly store the email as a field
        userId: userCredential.user.uid, // Explicitly store the userId as a field
        userType: formData.userType.toLowerCase(), // Ensure lowercase for consistency
      });
  
      alert("SignUp Successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen m-0 p-0">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        {/* Sign Up Form */}
        <h2 className="text-2xl font-bold text-center text-dark-blue mb-4 mt-4">
          Sign Up
        </h2>
        <div className="space-y-3">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
            <input
              type="text"
              placeholder="Enter your contact number"
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <select
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              value={formData.department}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            >
              <option value="">Select department</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>
          </div>

          {/* User Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">User Type</label>
            <select
              onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
              value={formData.userType}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dark-blue"
            >
              <option value="">Select UserType</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignUp}
            className="w-full bg-dark-blue text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition duration-300"
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-dark-blue font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
