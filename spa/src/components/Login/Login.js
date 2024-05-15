import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import bgImage from "../../assets/img/backgroundImage.png";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/api_service";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function validateEmail(email) {
  const re =
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

const Login = () => {
  const [zoom, setZoom] = useState("scale-0");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { updateUserEmail, checkLogin } = useContext(AuthContext);

  const handleEmailChange = (e) => {
    setEmailError();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordError();
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!email) {
      setEmailError("Please enter your email");
    }

    if (validateEmail(email) === false) {
      setEmailError("Invalid Email");
    }

    if (!password || password.length < 6) {
      setPasswordError("Your password should be of at least 6 characters");
    }

    if (
      !email ||
      validateEmail(email) === false ||
      !password ||
      password.length < 6
    ) {
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const result = await login(loginData); // Call getSomeData function from the API service
      if (result.token) {
        toast.success("Login Successfully!");
        resetFields();
        // checkLogin();
        navigate('/garden/registration');
        return;
      }
      toast.error(result.message);
    } catch (error) {
      // Handle errors
      console.error("Error while Login:", error);
    }
  };

  const resetFields = () => {
    setPassword("");
    setEmail("");
    setEmailError("");
    setPasswordError("");
  };

  useEffect(() => {
    checkLogin();
    setTimeout(() => {
      setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  return (
    <div
      className='bg-cover bg-center h-screen'
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div
        className={`flex min-h-full flex-col justify-center h-full px-6 py-12 lg:px-8`}
      >
        <div
          className={`${zoom} transition-transform duration-500 ease-in-out sm:mx-auto sm:w-full sm:max-w-sm p-6 bg-grey-100 border border-gray-100 rounded-lg shadow dark:bg-gray-100 dark:border-gray-200`}
        >
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <img
              className='mx-auto h-10 w-auto'
              src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
              alt='Your Company'
            ></img>
            <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
              Sign in to your account
            </h2>
          </div>

          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    value={email}
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3'
                    onChange={handleEmailChange}
                  />
                </div>
                {emailError && (
                  <label className='block text-sm font-medium leading-6 text-red-500'>
                    {emailError}
                  </label>
                )}
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label className='block text-sm font-medium leading-6 text-gray-900'>
                    Password
                  </label>
                  {/* <div className='text-sm'>
                    <a
                      href='#'
                      className='font-semibold text-indigo-600 hover:text-indigo-500'
                    >
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    value={password}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3'
                    onChange={handlePasswordChange}
                  />
                </div>
                {passwordError && (
                  <label className='block text-sm font-medium leading-6 text-red-500'>
                    {passwordError}
                  </label>
                )}
              </div>

              <div>
                <button
                  className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={handleLogin}
                >
                  Sign in
                </button>
              </div>
            </div>

            <p className='mt-10 text-center text-sm text-gray-500'>
              Not a member?
              <a
                onClick={resetFields}
                href='/sign-up'
                className='ml-2 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
