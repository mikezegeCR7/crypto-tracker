import { useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Dashboard 🚀</h1>
      <p>Welcome to your crypto tracker</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;