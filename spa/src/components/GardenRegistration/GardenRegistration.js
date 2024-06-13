import toast from "react-hot-toast";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getGardenDetails,
  ME,
  registerGarden,
  updateGarden,
} from "../../service/api_service";
import defaultImage from "../../assets/img/defaultImage.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { State, City } from "country-state-city";
import { Navigate, useNavigate } from "react-router-dom";

const GardenRegistration = () => {
  const navigate = useNavigate();
  const { checkAdmin, Logout } = useContext(AuthContext);
  const [zoom, setZoom] = useState("scale-0");
  const [userData, setUserData] = useState();
  const [Cities, setCities] = useState([]);
  const [image, setImage] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [indianStates, setIndianStates] = useState(
    State.getStatesOfCountry("IN")
  );
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    contact: "",
    height: "",
    width: "",
    plantDetails: "",
    waterSupplyMethod: "",
    image: "",
    userId: "",
  });
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "image" || id === "state") {
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // Reset error message for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const handleStateChange = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      state: "",
    }));
    const stateCode = e.target.value;
    if (stateCode) {
      const stateObj = indianStates.find(
        (state) => state?.isoCode === stateCode
      );
      setSelectedState(stateObj); // Store the whole state object
      setFormData((prevData) => ({
        ...prevData,
        state: stateObj.name,
      }));
      setCities(City.getCitiesOfState("IN", stateObj.isoCode)); // Pass stateObj instead of state
    } else {
      setSelectedState(""); // Store the whole state object
      setFormData((prevData) => ({
        ...prevData,
        state: "",
      }));
      setCities();
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    const imageType = selectedImage.type.split("/")[1];
    if (imageType !== "png" && imageType !== "jpeg") {
      toast.error("Image not supported use png or jpeg");
      return;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
    setImage(URL.createObjectURL(selectedImage));
  };

  const validateForm = () => {
    const errorMessage = "is required";
    const errors = {};
    if (!formData.name) {
      errors.name = errorMessage;
    }
    if (!formData.address) {
      errors.address = errorMessage;
    }
    if (!formData.state) {
      errors.state = errorMessage;
    }
    if (!formData.city) {
      errors.city = errorMessage;
    }
    if (!formData.pincode) {
      errors.pincode = errorMessage;
    }
    if (formData.pincode && formData.pincode.length <= 5) {
      errors.pincode = "Length should be of 6 digits";
    }
    if (!formData.height) {
      errors.height = errorMessage;
    }
    if (!formData.width) {
      errors.width = errorMessage;
    }
    if (!formData.waterSupplyMethod) {
      errors.waterSupplyMethod = errorMessage;
    }
    if (!formData.image) {
      errors.image = errorMessage;
    }
    if (!formData.contact) {
      errors.contact = errorMessage;
    }
    if (formData.contact && formData.contact.length !== 10) {
      errors.contact = "Length should be of 10 digits";
    }

    setErrors(errors);
    console.error("err", errors);

    // If errors exist, prevent form submission
    if (Object.keys(errors).length > 0) {
      return false;
    }
    return true;
  };

  const handleRegistration = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Token Expired");
      navigate("/login");
      return;
    }
    const isValid = validateForm();
    if (isValid) {
      // Perform form submission
      if (!formData.userId) {
        await me();
      }

      try {
        const result = await registerGarden(formData); // Call getSomeData function from the API service
        if (result) {
          toast.success("Garden registered Successful!");
          resetFields();
          await setGardenData();
        }
      } catch (error) {
        console.error("Error while Login:", error);
        toast.error(error.message);
      }
    }
  };

  const handleUpdatedRegistration = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Token Expired");
      navigate("/login");
      return;
    }
    const isValid = validateForm();
    if (isValid) {
      // Perform form submission
      if (!formData.userId) {
        await me();
      }

      try {
        const result = await updateGarden(formData); // Call getSomeData function from the API service
        if (result) {
          toast.success("Garden data updated Successful!");
          resetFields();
          await setGardenData();
        }
      } catch (error) {
        console.error("Error while Login:", error);
        toast.error(error.message);
      }
    }
  };

  const resetFields = () => {
    setFormData({
      name: "",
      address: "",
      state: "",
      city: "",
      pincode: "",
      contact: "",
      height: "",
      width: "",
      plantDetails: "",
      waterSupplyMethod: "",
      image: "",
      userId: "",
    });
    setImage("");
    setSelectedState("");
    setErrors();
  };

  const me = async () => {
    try {
      const user = await ME();
      setUserData(user);
      setFormData((prevData) => ({
        ...prevData,
        userId: user?.user?._id,
      }));
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (error) {
      console.error("ME Error", error);
      if (
        error.message === "jwt expired" ||
        error.message === "Network Error"
      ) {
        Logout();
      }
      throw new Error(error);
    }
  };

  const setGardenData = async () => {
    const response = await getGardenDetails();

    if (response === null) {
      return;
    }
    if (response?.message === "Invalid token") {
      toast.error(response?.message);
      localStorage.clear();
      navigate("/login");
    }
    setFormData(response);
    setIsDataAvailable(true);
    const stateObj = indianStates.find(
      (state) => state.name === response.state
    );
    setSelectedState(stateObj);
    setCities(City.getCitiesOfState("IN", stateObj?.isoCode));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    async function getGardenData() {
      try {
        await checkAdmin();
        await me();
        await setGardenData();
      } catch (error) {
        console.error("get Garden Data", error);
        if (
          error.message === "jwt expired" ||
          error.message === "Network Error"
        ) {
          Logout();
        }
      }
    }
    getGardenData();

    // Zoom in after a delay
    setTimeout(() => {
      setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  return (
    <div>
      <Navbar />
      <div
        className='container-fluid page-header py-5 wow fadeIn'
        data-wow-delay='0.1s'
      >
        <div className='container text-center py-5'>
          <h1 className='display-3 text-white mb-4 animated slideInDown'>
            Garden Registration
          </h1>
          <nav aria-label='breadcrumb animated slideInDown'>
            <ol className='breadcrumb justify-content-center mb-0'>
              <li className='breadcrumb-item'>Home</li>
              <li className='breadcrumb-item'>Pages</li>
              <li className='breadcrumb-item' aria-current='page'>
                garden / registration
              </li>
            </ol>
          </nav>
          {/* ----------------- Form ----------------------- */}
          <div>
            <div className='flex min-h-full flex-col justify-center px-6 pt-12 lg:px-8'>
              <div className='sm:mx-auto sm:w-full p-6 sm:max-w-xl bg-gray-100 border border-gray-100 rounded-lg shadow dark:bg-gray-100 dark:border-gray-200'>
                <div className='sm:mx-auto sm:w-full sm:max-w-xl'>
                  <div className='space-y-6'>
                    <div>
                      <div className='flex justify-start'>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>
                          Name
                        </label>
                      </div>
                      <div className='mt-2'>
                        <input
                          id='name'
                          name='name'
                          type='text'
                          autoComplete='name'
                          placeholder='Enter your name'
                          required
                          value={formData?.name}
                          className={`form-control ${
                            errors?.name && "is-invalid"
                          }`}
                          onChange={handleChange}
                        />
                      </div>
                      {errors?.name && (
                        <div
                          style={{ display: "block" }}
                          className='invalid-feedback'
                        >
                          Your Name {errors?.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className='flex justify-start'>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>
                          Address
                        </label>
                      </div>
                      <textarea
                        placeholder='Enter your address'
                        id='address'
                        style={{ height: "90px" }}
                        value={formData?.address}
                        className={`form-control ${
                          errors?.address && "is-invalid"
                        }`}
                        onChange={handleChange}
                        required
                      ></textarea>
                      {errors?.address && (
                        <div className='invalid-feedback'>
                          Your address {errors?.address}
                        </div>
                      )}
                    </div>
                    <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
                      <div className='w-full mr-3'>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            State
                          </label>
                        </div>
                        <select
                          id='state'
                          name='state'
                          value={
                            formData.state || selectedState
                              ? selectedState?.isoCode
                              : ""
                          } // Use isoCode property
                          onChange={handleStateChange}
                          className={`form-control ${
                            errors?.state && "is-invalid"
                          }`}
                        >
                          <option value=''>Select State</option>
                          {indianStates.map((state, index) => (
                            <option key={index} value={state?.isoCode}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        {errors?.state && (
                          <div className='invalid-feedback'>
                            Your state {errors?.state}
                          </div>
                        )}
                      </div>

                      <div className='w-full mr-3'>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            City
                          </label>
                        </div>
                        <select
                          id='city'
                          name='city'
                          value={formData?.city}
                          onChange={handleChange}
                          className={`form-control ${
                            errors?.city && "is-invalid"
                          }`}
                          disabled={!selectedState} // Disable if no state is selected
                        >
                          <option value=''>Select City</option>
                          {Cities?.map((city, index) => (
                            <option key={index} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        {errors?.city && (
                          <div className='invalid-feedback'>
                            Your city {errors?.city}
                          </div>
                        )}
                      </div>

                      <div className='w-full'>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            Pincode
                          </label>
                        </div>
                        <input
                          id='pincode'
                          name='pincode'
                          type='number'
                          minLength={6}
                          maxLength={6}
                          placeholder='Enter your pincode'
                          value={formData?.pincode}
                          onChange={handleChange}
                          className={`form-control ${
                            errors?.pincode && "is-invalid"
                          }`}
                        />
                        {errors?.pincode && (
                          <div className='invalid-feedback'>
                            Your pincode {errors?.pincode}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className='flex justify-start'>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>
                          Contact
                        </label>
                      </div>
                      <input
                        id='contact'
                        name='contact'
                        type='number'
                        placeholder='Enter your contact number'
                        minLength={10}
                        maxLength={10}
                        value={formData?.contact}
                        onChange={handleChange}
                        className={`form-control ${
                          errors?.contact && "is-invalid"
                        }`}
                      />
                      {errors?.contact && (
                        <div className='invalid-feedback'>
                          Your contact {errors?.contact}
                        </div>
                      )}
                    </div>
                    <div className='flex flex-col sm:flex-row justify-between'>
                      <div>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            Garden Height ft.
                          </label>
                        </div>
                        <input
                          id='height'
                          name='height'
                          type='number'
                          placeholder='Enter Garden Height ft.'
                          value={formData?.height}
                          onChange={handleChange}
                          className={`form-control ${
                            errors?.height && "is-invalid"
                          }`}
                        />
                        {errors?.height && (
                          <div className='invalid-feedback'>
                            Your Garden Height {errors?.height}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            Garden Width ft.
                          </label>
                        </div>
                        <input
                          id='width'
                          name='width'
                          type='number'
                          placeholder='Enter Garden Width ft.'
                          value={formData?.width}
                          onChange={handleChange}
                          className={`form-control ${
                            errors?.width && "is-invalid"
                          }`}
                        />
                        {errors?.width && (
                          <div className='invalid-feedback'>
                            Your Garden Width {errors?.width}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className='flex justify-start'>
                        <label className='block text-sm font-medium leading-6 text-gray-900'>
                          Plant Details
                        </label>
                      </div>
                      <textarea
                        placeholder='Enter plant details'
                        id='plantDetails'
                        value={formData?.plantDetails}
                        onChange={handleChange}
                        className='form-control'
                      ></textarea>
                    </div>
                    <div>
                      <div className='flex flex-row justify-between items-center'>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            Water Supply Method
                          </label>
                        </div>
                        <div className='mt-2'>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              id='waterSupplyMethod'
                              className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                              name='waterSupplyMethod'
                              value='automatic'
                              checked={
                                formData?.waterSupplyMethod === "automatic"
                              }
                              onChange={handleChange}
                            />
                            <span className='ml-2'>Automatic</span>
                          </label>
                          <label className='inline-flex items-center ml-6'>
                            <input
                              type='radio'
                              id='waterSupplyMethod'
                              className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                              name='waterSupplyMethod'
                              value='manual'
                              checked={formData?.waterSupplyMethod === "manual"}
                              onChange={handleChange}
                            />
                            <span className='ml-2'>Manual</span>
                          </label>
                        </div>
                      </div>
                      {errors?.waterSupplyMethod && (
                        <div
                          style={{ display: "block" }}
                          className='invalid-feedback'
                        >
                          Your water Supply Method {errors?.waterSupplyMethod}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className='mt-2 flex flex-row justify-evenly'>
                        <div className=''>
                          <img
                            src={
                              formData?.image || image ? image : defaultImage
                            }
                            // src='http://localhost:4000/uploads/image-1714325613032-38313133.jpeg'
                            alt='Selected'
                            className='w-48 h-48 rounded object-fill'
                          />
                        </div>
                        <div className='mt-2 flex items-center '>
                          <label
                            htmlFor='image'
                            className='cursor-pointer flex items-center border-spacing-1 p-2 border'
                          >
                            <FontAwesomeIcon
                              icon={faPaperclip}
                              className='mr-2'
                            />{" "}
                            Select Image
                          </label>
                          <input
                            id='image'
                            name='image'
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='hidden'
                          />
                        </div>
                      </div>
                      {errors?.image && (
                        <div
                          style={{ display: "block" }}
                          className='invalid-feedback'
                        >
                          Your Garden Image {errors?.image}
                        </div>
                      )}
                    </div>
                    {isDataAvailable ? (
                      <button
                        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        onClick={handleUpdatedRegistration}
                      >
                        Update your data
                      </button>
                    ) : (
                      <button
                        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        onClick={handleRegistration}
                      >
                        Register your Garden
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ----------------- Form ----------------------- */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GardenRegistration;
