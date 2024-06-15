import toast from "react-hot-toast";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import {
  createMaintenance,
  getAllMaintenance,
  getGardenDetails,
  ME,
  registerGarden,
} from "../../service/api_service";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Loader from "../common/Loader/Loader";

const GardenMaintenance = () => {
  const navigate = useNavigate();
  const { checkLogin } = useContext(AuthContext);
  const [zoom, setZoom] = useState("scale-0");
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    userId: "",
    gardenId: "",
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
  // {
  // "userId": "6637410eaec18950a96f2782",
  // "gardenId": "663743ead97870f521b7ff35",
  // "maintenanceName": "testing",
  // "garden": "new",
  // "potChange": "true",
  // "waterSupply": "true",
  // "designChange": "true",
  // "description": "testing description"

  const validateForm = () => {
    const errorMessage = "is required";
    const errors = {};
    if (!formData.gardenId) {
      errors.gardenId = errorMessage;
    }
    if (!formData.maintenanceName) {
      errors.maintenanceName = errorMessage;
    }
    if (!formData.garden) {
      errors.garden = errorMessage;
    }
    if (!formData.potChange) {
      errors.potChange = errorMessage;
    }
    if (!formData.waterSupply) {
      errors.waterSupply = errorMessage;
    }
    if (!formData.designChange) {
      errors.designChange = errorMessage;
    }
    if (!formData.description) {
      errors.description = errorMessage;
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
    setLoading(true);
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
        const response = await createMaintenance(formData);
        if (response) {
          toast.success("Maintenance added Successful!");
          navigate("/garden/maintenance/list");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error while Maintenance:", error);
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  const me = async () => {
    try {
      const user = await ME();
      setUserData(user);
      setFormData((prevData) => ({
        ...prevData,
        userId: user.user?._id,
      }));
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (error) {
      setLoading(false);
      console.error("Error in [GardenMaintenance] [me]", error);
      throw error;
    }
  };

  const setGardenData = async () => {
    try {
      setLoading(true);
      const response = await getGardenDetails();
      if (response === null) {
        toast("Please Register a garden first", {
          icon: (
            <FontAwesomeIcon
              className='text-yellow-700'
              icon={faExclamationCircle}
            />
          ),
        });
        navigate("/garden/registration");
        return;
      }
      console.log("response", response);
      setFormData((prevData) => ({
        ...prevData,
        gardenId: response?._id,
      }));
    } catch (error) {
      setLoading(false);
      if (error?.message === "Invalid token") {
        toast.error(error?.message);
        localStorage.clear();
        navigate("/login");
      }
      console.error("Error in [gardenMaintenance] [setGardenData]", error);
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    async function getGardenData() {
      try {
        setLoading(true);
        await setGardenData();
        const maintenanceData = await getAllMaintenance();
        if (
          maintenanceData.length &&
          maintenanceData[maintenanceData?.length - 1]?.status === "pending"
        ) {
          navigate("/garden/maintenance/list");
          setLoading(false);
          return;
        }
        await me();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error in [gardenMaintenance] [getGardenData]', error);
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
      {loading ? <Loader /> : ""}

      <div>
        <Navbar />
        <div
          className='container-fluid page-header py-5 wow fadeIn'
          data-wow-delay='0.1s'
        >
          <div className='container text-center py-5'>
            <h1 className='display-3 text-white mb-4 animated slideInDown'>
              Garden Maintenance
            </h1>
            <nav aria-label='breadcrumb animated slideInDown'>
              <ol className='breadcrumb justify-content-center mb-0'>
                <li className='breadcrumb-item'>Home</li>
                <li className='breadcrumb-item'>Pages</li>
                <li className='breadcrumb-item' aria-current='page'>
                  garden / Maintenance
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
                            Maintenance Name
                          </label>
                        </div>
                        <div className='mt-2'>
                          <input
                            id='maintenanceName'
                            name='maintenanceName'
                            type='text'
                            autoComplete='maintenanceName'
                            placeholder='Enter your maintenance name'
                            required
                            value={formData?.maintenanceName}
                            className={`form-control ${
                              errors?.maintenanceName && "is-invalid"
                            }`}
                            onChange={handleChange}
                          />
                        </div>
                        {errors?.maintenanceName && (
                          <div
                            style={{ display: "block" }}
                            className='invalid-feedback'
                          >
                            Your Maintenance Name {errors?.maintenanceName}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex justify-start'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>
                              Maintenance For garden
                            </label>
                          </div>
                          <div className=' w-44 mt-2'>
                            <label className='inline-flex items-center'>
                              <input
                                type='radio'
                                id='garden'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='garden'
                                value='new'
                                checked={formData?.garden === "new"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>New</span>
                            </label>
                            <label className='inline-flex items-center ml-6'>
                              <input
                                type='radio'
                                id='garden'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='garden'
                                value='same'
                                checked={formData?.garden === "same"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>Same</span>
                            </label>
                          </div>
                        </div>
                        {errors?.garden && (
                          <div
                            style={{ display: "block" }}
                            className='invalid-feedback'
                          >
                            Your garden Maintenance response is required
                          </div>
                        )}
                      </div>

                      <div>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex justify-start'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>
                              Pot Changing
                            </label>
                          </div>
                          <div className='w-44 mt-2'>
                            <label className='inline-flex items-center'>
                              <input
                                type='radio'
                                id='potChange'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='potChange'
                                value={"true"}
                                checked={formData?.potChange === "true"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>Yes</span>
                            </label>
                            <label className='inline-flex items-center ml-6'>
                              <input
                                type='radio'
                                id='potChange'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='potChange'
                                value={"false"}
                                checked={formData?.potChange === "false"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>No</span>
                            </label>
                          </div>
                        </div>
                        {errors?.potChange && (
                          <div
                            style={{ display: "block" }}
                            className='invalid-feedback'
                          >
                            Your response for pot Change is required
                          </div>
                        )}
                      </div>

                      <div>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex justify-start'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>
                              Water supply Changing
                            </label>
                          </div>
                          <div className='w-44 mt-2'>
                            <label className='inline-flex items-center'>
                              <input
                                type='radio'
                                id='waterSupply'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='waterSupply'
                                value={"true"}
                                checked={formData?.waterSupply === "true"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>Yes</span>
                            </label>
                            <label className='inline-flex items-center ml-6'>
                              <input
                                type='radio'
                                id='waterSupply'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='waterSupply'
                                value={"false"}
                                checked={formData?.waterSupply === "false"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>No</span>
                            </label>
                          </div>
                        </div>
                        {errors?.waterSupply && (
                          <div
                            style={{ display: "block" }}
                            className='invalid-feedback'
                          >
                            Your response for water Supply is required
                          </div>
                        )}
                      </div>

                      <div>
                        <div className='flex flex-row justify-between items-center'>
                          <div className='flex justify-start'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>
                              Design Changing
                            </label>
                          </div>
                          <div className='w-44 mt-2'>
                            <label className='inline-flex items-center'>
                              <input
                                type='radio'
                                id='designChange'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='designChange'
                                value={"true"}
                                checked={formData?.designChange === "true"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>Yes</span>
                            </label>
                            <label className='inline-flex items-center ml-6'>
                              <input
                                type='radio'
                                id='designChange'
                                className='form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out'
                                name='designChange'
                                value={"false"}
                                checked={formData?.designChange === "false"}
                                onChange={handleChange}
                              />
                              <span className='ml-2'>No</span>
                            </label>
                          </div>
                        </div>
                        {errors?.designChange && (
                          <div
                            style={{ display: "block" }}
                            className='invalid-feedback'
                          >
                            Your response for design change is required
                          </div>
                        )}
                      </div>

                      <div>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            Description
                          </label>
                        </div>
                        <textarea
                          placeholder='Enter Maintenance details'
                          id='description'
                          value={formData?.description}
                          onChange={handleChange}
                          className='form-control'
                        ></textarea>
                        {errors?.description && (
                          <div
                            style={{ display: "block" }}
                            className='invalid-feedback'
                          >
                            Your response for description is required
                          </div>
                        )}
                      </div>

                      {/* <div>
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
                    </div> */}

                      <button
                        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        onClick={handleRegistration}
                      >
                        {isDataAvailable
                          ? "Update your data"
                          : "Create maintenance"}
                      </button>
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
    </div>
  );
};

export default GardenMaintenance;
