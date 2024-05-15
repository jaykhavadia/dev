import { createContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const checkLogin = (path) => {
    const verifyEmail = localStorage.getItem("verifyEmail");
    const token = localStorage.getItem("accessToken");
    if (!token && !verifyEmail) {
      navigate(path || '/login');
      return;
    }
    if (token) {
      updateUserToken(token);
      navigate("/garden/registration");
      return;
    }
    if (verifyEmail) {
      navigate("/email-verification");
      return;
    }
    updateUserToken("");
    navigate(path || "/login");
  };

  const Logout = () => {
    toast.success("Logout Successful!");
    localStorage.clear();
    navigate("/home");
  };

  const getUserData = () => {
    if (userData) {
      return userData;
    }
    const user = localStorage.getItem("currentUser");
    return user;
  };

  const updateUserData = (info) => {
    setUserData(info);
  };

  const updateUserToken = (info) => {
    setUserToken(info);
  };

  const updateUserEmail = (info) => {
    setUserEmail(info);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        userToken,
        userEmail,
        updateUserToken,
        updateUserData,
        checkLogin,
        updateUserEmail,
        getUserData,
        Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
