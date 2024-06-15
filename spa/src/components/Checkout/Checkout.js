import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faEnvelope,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import Summary from "./steps/Summary/Summary";
import Address from "./steps/Address/Address";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Loader from "../common/Loader/Loader";

const steps = ["Checkout", "Address", "Payment"];

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [cartData, setCartData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [cartSize, setCartSize] = useState(0);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const { checkAdmin } = useContext(AuthContext);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCartData(JSON.parse(cartData));
    }
  }, []);

  useEffect(() => {
    // Save cart data to localStorage
    try {
      const cart = cartData?.filter((product) => product.itemCount > 0);
      console.log("set cart", cart);
      let total = 0;
      let cartLength = 0;
      if (cart) {
        for (const product of cart) {
          total += product?.itemCount * product?.price;
          if (product?.itemCount > 0) {
            cartLength += 1;
          }
        }
        setGrandTotal(total);
        setCartSize(cartLength);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error(
        "Error in [Checkout] [useEffect save cart data to localStorage]",
        error
      );
    }
  }, [cartData]);

  const removeFromCart = (product) => {
    if (!token) {
      toast("Login Before Removing Products!", {
        icon: (
          <FontAwesomeIcon
            className='text-yellow-700'
            icon={faExclamationCircle}
          />
        ),
      });
      navigate("/login");
      return;
    }

    // Update the product in the state
    setCartData((prevProducts) =>
      prevProducts.map((p) =>
        p._id === product._id && p.itemCount > 0
          ? { ...p, itemCount: p.itemCount - 1 }
          : p
      )
    );
    console.log("Product removed from cart:", product);
  };

  const addToCart = async (product) => {
    if (!token) {
      toast("Login Before Buying Products!", {
        icon: (
          <FontAwesomeIcon
            className='text-yellow-700'
            icon={faExclamationCircle}
          />
        ),
      });
      navigate("/login");
      return;
    }
    setCartData((prevProducts) =>
      prevProducts.map((p) =>
        p._id === product._id ? { ...p, itemCount: p.itemCount + 1 } : p
      )
    );
  };

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    // if (!isStepOptional(activeStep)) {
    //   // You probably want to guard against something like this,
    //   // it should never occur unless someone's actively trying to break something.
    //   throw new Error("You can't skip a step that isn't optional.");
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const setAddressValidity = (value) => {
    setIsValidAddress(value);
  };

  return (
    <div>
      {loading ? <Loader /> : ""}
      <div>
        <Navbar />
        <div
          className='container-fluid page-header py-5 mb-5 wow fadeIn'
          data-wow-delay='0.1s'
        >
          <div className='container text-center py-5'>
            <h1 className='display-3 text-white mb-4 animated slideInDown'>
              Checkout in 3 Steps
            </h1>
            <nav aria-label='breadcrumb animated slideInDown'>
              <ol className='breadcrumb justify-content-center mb-0'>
                <li className='breadcrumb-item'>
                  <a href='#'>Home</a>
                </li>
                <li className='breadcrumb-item'>
                  <a href='#'>Pages</a>
                </li>
                <li className='breadcrumb-item'>
                  <a href='#'>Products</a>
                </li>
                <li
                  className='breadcrumb-item active text-white'
                  aria-current='page'
                >
                  Checkout
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div>
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                // if (isStepOptional(index)) {
                //   labelProps.optional = (
                //     <Typography variant='caption'>Optional</Typography>
                //   );
                // }
                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
                {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box> */}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  <div className='flex justify-center'>
                    <div className='container px-4 sm:px-6 lg:px-8 py-3'>
                      {/* checkout */}
                      {activeStep === 0 && (
                        <Summary
                          cartData={cartData}
                          removeFromCart={removeFromCart}
                          addToCart={addToCart}
                          grandTotal={grandTotal}
                          cartSize={cartSize}
                          setLoading={setLoading}
                        />
                      )}
                      {/* Address */}
                      {activeStep === 1 && (
                        <Address
                          setAddressValidity={setAddressValidity}
                          setLoading={setLoading}
                        />
                      )}
                      {/* Payment */}
                      {activeStep === 2 && (
                        <div className='flex justify-center items-center'>
                          <h1>payment section</h1>
                        </div>
                      )}
                    </div>
                  </div>
                </Typography>
                <Box
                  className='px-16'
                  sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                >
                  {activeStep !== 0 && (
                    <Button
                      color='inherit'
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                  )}
                  <Box sx={{ flex: "1 1 auto" }} />
                  {/* {isStepOptional(activeStep) && (
                  <Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )} */}
                  {activeStep === 0 && (
                    <button
                      type='button'
                      className='btn btn-primary pb-2 my-2 text-white'
                      disabled={cartSize === 0}
                      onClick={handleNext}
                    >
                      Address
                    </button>
                  )}
                  {activeStep === 1 && (
                    <Button disabled={!isValidAddress} onClick={handleNext}>
                      Payment
                    </Button>
                  )}
                  {/* <Button onClick={handleNext}>
                  {activeStep === steps.length - 1
                    ? "Finish"
                    : activeStep === 0
                    ? "Address"
                    : "Next"}
                </Button> */}
                </Box>
              </React.Fragment>
            )}
          </Box>
        </div>

        <Footer />
      </div>
    </div>
  );
};
export default Checkout;
