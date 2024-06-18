import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (userdata) => {
    setUser(userdata);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: 'include',
      });
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, login, logout };
};

export default useAuth;
