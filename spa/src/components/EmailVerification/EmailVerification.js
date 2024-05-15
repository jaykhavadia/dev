import { useContext, useEffect, useState } from "react";
import bgImage from "../../assets/img/backgroundImage.png";
import emailImage from "../../assets/img/emailVerification.png";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import {
  ME,
  resendVerificationEmail,
  verifyEmail,
} from "../../service/api_service";
import toast from "react-hot-toast";
const EmailVerification = () => {
  const [zoom, setZoom] = useState("scale-0");
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const { checkLogin } = useContext(AuthContext);
  const location = useLocation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    async function emailVerification(token) {
      try {
        const response = await verifyEmail(token);
        if (response === "User already verified") {
          toast.error("User already verified");
          localStorage.clear();
          navigate("/login");
        }
        if (response === "jwt expired") {
          toast.error("Verified link Expired!");
          navigate("/login");
          return;
        }
        if (response.isVerified) {
          localStorage.removeItem("verifyEmail");
          toast.success("Email Verified Successfully!");
          navigate("/login");
        }
      } catch (error) {
        console.log("error in verifyEmail use effects", error);
        if (error === "User already verified") {
          toast.error("User already verified");
          localStorage.clear();
          navigate("/login");
          return;
        }
        toast.error(error?.message || error);
      }
    }

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      emailVerification(token);
    }
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
    checkLogin("/login");
    setTimeout(() => {
      setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  const resetFields = async () => {
    localStorage.clear();
    navigate("/sign-up");
  };

  const resendEmail = async () => {
    const userEmail = localStorage.getItem("userEmail");
    await resendVerificationEmail(userEmail);
    toast.success("Verification Email Sent!");

    setIsButtonDisabled(true);
    localStorage.setItem("buttonClickTimestamp", Date.now().toString());
    const twoMinutesInMillis = 2 * 60 * 1000;
    setCountdown(120);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      setIsButtonDisabled(false);
      localStorage.removeItem("buttonClickTimestamp");
      setCountdown(0);
    }, twoMinutesInMillis);
  };

  return (
    <div
      className='bg-cover bg-center h-screen'
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div
        className={`flex min-h-full flex-col justify-center h-full px-4 py-8 lg:px-8`}
      >
        <div
          className={`${zoom} transition-transform duration-500 ease-in-out sm:mx-auto sm:w-full sm:max-w-sm p-6 bg-grey-100 border border-gray-100 rounded-lg shadow dark:bg-gray-100 dark:border-gray-200`}
        >
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            {/* <img
              className='mx-auto h-10 w-auto'
              src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
              alt='Your Company'
            ></img> */}
          </div>

          <div className=' sm:mx-auto sm:w-full sm:max-w-md'>
            <div className=''>
              <div>
                <img
                  className=' h-full w-auto'
                  src={emailImage}
                  alt='Your Company'
                ></img>
              </div>
              <div>
                <h2 className='text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900'>
                  Verify your account
                </h2>
              </div>
              <div className='text-center flex flex-col mt-4'>
                <span>Thanks for signup with us.</span>
                <span>
                  Click on the button below to verify your email address.
                </span>
              </div>
            </div>
            <div className=' sm:mx-auto sm:w-full sm:max flex justify-center mt-4'>
              <Button
                onClick={resendEmail}
                color='green'
                className='flex items-center gap-3'
                disabled={isButtonDisabled}
              >
                <FontAwesomeIcon icon={faEnvelope} />
                Verify your email
              </Button>
            </div>
            {/* <div className='text-sm text-center mt-2'> */}
            {/* <span>{userEmail}</span> */}
            {/* </div> */}
            <p className='mt-2 text-center  text-sm text-gray-500'>
              <span>
                {isButtonDisabled
                  ? `Wait for (${countdown}s) for resending the email`
                  : ""}
              </span>
            </p>
            <p className='mt-2 text-center  text-sm text-gray-500'>
              <span>{userEmail} Not your email ?</span>
              <span
                onClick={resetFields}
                className='ml-2 font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer'
              >
                Signup
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
