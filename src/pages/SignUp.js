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
    department: "BCA", // Default department
    userType: "student", // Default role
  });

  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const { email, password, ...userData } = formData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...userData, // Includes userType, department, and other fields
        userType: formData.userType.toLowerCase(), // Ensure lowercase for consistency
      });
      alert("SignUp Successful! Please log in.");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="First Name"
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Contact Number"
        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <select
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        value={formData.department}
      >
        <option value="BCA">BCA</option>
        <option value="BBA">BBA</option>
      </select>
      <select
        onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
        value={formData.userType}
      >
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
      </select>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
