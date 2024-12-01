import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
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
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account?</p>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
    </div>
  );
};

export default Login;
