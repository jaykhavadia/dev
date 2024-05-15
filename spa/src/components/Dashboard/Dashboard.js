import { Button } from "@material-tailwind/react";
import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const { checkLogin } = useContext(AuthContext);

  useEffect(() => {
    checkLogin();
  }, []);

  const Logout = () => {
    toast.success("Logout Successful!");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className='flex justify-evenly  mt-8'>
      Hello User
      <Button color='blue' onClick={Logout}>
        Logout
      </Button>
    </div>
  );
};
export default Dashboard;
