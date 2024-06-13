import React, { useContext, useEffect, useState } from "react";
import "./Signup.css";
import bgImage from "../../assets/img/backgroundImage.png";
import { registerUser } from "../../service/api_service";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function validateEmail(email) {
  const re =
    /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());
}

const SignUp = () => {
  const [zoom, setZoom] = useState("scale-0");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [iserror, setIserror] = useState(false);
  const [userNameError, setUserNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const navigate = useNavigate();
  const { checkLogin, checkAdmin } = useContext(AuthContext);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = async () => {
    resetFields("error");
    if (!userName || userName.length < 3) {
      setUserNameError("Please enter valid user name");
    }

    if (!email) {
      setEmailError("Please enter your email");
    }

    if (validateEmail(email) === false) {
      setEmailError("Invalid Email");
    }

    if (!password || password.length < 6) {
      setPasswordError("Your password should be of at least 6 characters");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Password and confirm password must be the same");
    }

    if (
      !email ||
      validateEmail(email) === false ||
      !password ||
      password.length < 6 ||
      !userName ||
      userName.length < 3 ||
      password !== confirmPassword
    ) {
      return;
    }

    const signUpData = {
      email: email,
      password: password,
      name: userName,
      confirmPassword: confirmPassword,
    };

    try {
      const result = await registerUser(signUpData); // Call getSomeData function from the API service
      if (result.saveUser) {
        toast.success("Signup Successful!");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", userName);
        checkLogin();
        resetFields("all");
        return;
      }
      toast.error(result.message);
    } catch (error) {
      // Handle errors
      console.error("Error while signup:", error);
      toast.error(error?.message);
    }
  };

  const resetFields = (section) => {
    if (section === "error" || section === "all") {
      setConfirmPasswordError("");
      setEmailError("");
      setUserNameError("");
      setPasswordError("");
      return;
    }
    setConfirmPassword("");
    setPassword("");
    setEmail("");
    setUserName("");
  };

  useEffect(() => {
    checkAdmin();
    checkLogin('/sign-up');
    // Zoom in after a delay
    setTimeout(() => {
      setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  return (
    <div
      className={`bg-cover bg-center ${
        confirmPasswordError || emailError || userNameError || passwordError
          ? "h-full"
          : "h-screen"
      }`}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
        <div
          className={`${zoom} transition-transform duration-500 ease-in-out sm:mx-auto sm:w-full sm:max-w-sm p-6 bg-gray-100 border border-gray-100 rounded-lg shadow  dark:bg-gray-100 dark:border-gray-200 `}
        >
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <img
              className='mx-auto h-10 w-auto'
              src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
              alt='Your Company'
            />
            <h2 className='mt-7 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
              sign up
            </h2>
          </div>

          <div className='mt-7 sm:mx-auto sm:w-full sm:max-w-sm'>
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  User Name
                </label>
                <div className='mt-2'>
                  <input
                    id='userName'
                    name='userName'
                    type='text'
                    autoComplete='userName'
                    required
                    value={userName}
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3'
                    onChange={handleUserNameChange}
                  />
                </div>
                {userNameError && (
                  <label className='block text-sm font-medium leading-6 text-red-500'>
                    {userNameError}
                  </label>
                )}
              </div>

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
                  <div className='text-sm'>
                    <a
                      href='#'
                      className='font-semibold text-indigo-600 hover:text-indigo-500'
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className='mt-2'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    value={password}
                    autoComplete='current-password'
                    required
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
                <div className='flex items-center justify-between'>
                  <label className='block text-sm font-medium leading-6 text-gray-900'>
                    Confirm Password
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
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    value={confirmPassword}
                    autoComplete='current-password'
                    required
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3'
                    onChange={handleConfirmPasswordChange}
                  />
                </div>
                {confirmPasswordError && (
                  <label className='block text-sm font-medium leading-6 text-red-500'>
                    {confirmPasswordError}
                  </label>
                )}
              </div>

              <div>
                <button
                  className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  onClick={handleSignUp}
                >
                  Sign up
                </button>
              </div>
            </div>

            <p className='mt-10 text-center text-sm text-gray-500'>
              already a member
              <a
                onClick={resetFields}
                href='/login'
                className='ml-2 font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
