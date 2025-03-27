import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [navigate]);

  return <h1>Welcome to Home Page</h1>;
};

export default Home;
