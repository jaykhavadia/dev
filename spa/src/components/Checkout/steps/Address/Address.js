import { City, State } from "country-state-city";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createAddress,
  getAddressDetails,
  ME,
  updateAddress,
} from "../../../../service/api_service";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const Address = (props) => {
  const navigate = useNavigate();
  const { setAddressValidity } = props;
  const { Logout } = useContext(AuthContext);
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
    address_1: "",
    address_2: "",
    landMark: "",
    state: "",
    city: "",
    pincode: "",
    contact: "",
  });
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const handleChange = (e) => {
    setAddressValidity(false);

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
    setAddressValidity(false);

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

  const validateForm = () => {
    const errorMessage = "is required";
    const errors = {};
    if (!formData?.name) {
      errors.name = errorMessage;
    }
    if (!formData?.address_1) {
      errors.address_1 = errorMessage;
    }
    if (!formData?.address_2) {
      errors.address_2 = errorMessage;
    }
    if (!formData?.landMark) {
      errors.landMark = errorMessage;
    }
    if (!formData?.state) {
      errors.state = errorMessage;
    }
    if (!formData?.city) {
      errors.city = errorMessage;
    }
    if (!formData?.pincode) {
      errors.pincode = errorMessage;
    }
    if (formData?.pincode && formData.pincode.length <= 5) {
      errors.pincode = "Length should be of 6 digits";
    }
    if (!formData?.contact) {
      errors.contact = errorMessage;
    }
    if (formData?.contact && formData.contact.length !== 10) {
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

  const saveAddress = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Token Expired");
      navigate("/login");
      return;
    }
    const isValid = validateForm();
    if (isValid) {
      console.log("Form is valid", formData);
      try {
        if (formData?.userId) {
          delete formData?.userId;
        }
        const result = await createAddress(formData); // Call getSomeData function from the API service
        if (result) {
          setAddressValidity(true);
          toast.success(result.message || 'Address saved successfully!');
          resetFields();
          await setAddressData();
        }
      } catch (error) {
        console.error("Error while Login:", error);
        toast.error(error.message);
      }
    }
  };

  const handleUpdatedAddress = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Token Expired");
      navigate("/login");
      return;
    }
    const isValid = validateForm();
    if (isValid) {
      try {
        if (formData?.userId) {
          delete formData?.userId;
        }
        console.log('formData', formData);
        const result = await updateAddress(formData); // Call getSomeData function from the API service
        setAddressValidity(true);
        if (result) {
          toast.success(result.message);
          resetFields();
          await setAddressData();
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
    });
    setSelectedState("");
    setErrors();
  };

  const setAddressData = async () => {
    try {
      const response = await getAddressDetails();

      if (response === null) {
        return;
      }
      if (response?.message === "Invalid token") {
        toast.error(response?.message);
        localStorage.clear();
        navigate("/login");
      }
      if(response && response.address){
        setFormData(response.address);
        setIsDataAvailable(true);
        const stateObj = indianStates.find(
          (state) => state.name === response.address.state
        );
        setSelectedState(stateObj);
        setCities(City.getCitiesOfState("IN", stateObj?.isoCode));
        setAddressValidity(true);
      }
    } catch (error) {
      console.log('No Address found', error);
      setIsDataAvailable(false);
      toast("Add your Address", {
        icon: (
          <FontAwesomeIcon
            className='text-yellow-700'
            icon={faExclamationCircle}
          />
        ),
      });
    }
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
      if (error.message === "jwt expired") {
        Logout();
      }
      throw new Error(error);
    }
  };

  useEffect(() => {
    async function getAddressData() {
      try {
        //   await checkAdmin();
        await me();
        await setAddressData();
      } catch (error) {
        console.error("get Garden Data", error);
        throw error;
      }
    }
    getAddressData();

    // Zoom in after a delay
    setTimeout(() => {
      setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  return (
    <>
      <div className='container text-center'>
        {/* ----------------- Form ----------------------- */}
        <div>
          <div className='flex min-h-full flex-col justify-center px-6 lg:px-8'>
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

                  {/* <div>
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
                  </div> */}
                  <div>
                    <div className='flex justify-start'>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Address 1
                      </label>
                    </div>
                    <div className='mt-2'>
                      <input
                        id='address_1'
                        name='address_1'
                        type='text'
                        autoComplete='address_1'
                        placeholder='House No., Building Name'
                        required
                        value={formData?.address_1}
                        className={`form-control ${
                          errors?.address_1 && "is-invalid"
                        }`}
                        onChange={handleChange}
                      />
                    </div>
                    {errors?.address_1 && (
                      <div
                        style={{ display: "block" }}
                        className='invalid-feedback'
                      >
                        Your address 1 {errors?.address_1}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className='flex justify-start'>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Address 2
                      </label>
                    </div>
                    <div className='mt-2'>
                      <input
                        id='address_2'
                        name='address_2'
                        type='text'
                        autoComplete='address_2'
                        placeholder='Road name, Area Colony'
                        required
                        value={formData?.address_2}
                        className={`form-control ${
                          errors?.address_2 && "is-invalid"
                        }`}
                        onChange={handleChange}
                      />
                    </div>
                    {errors?.address_2 && (
                      <div
                        style={{ display: "block" }}
                        className='invalid-feedback'
                      >
                        Your address 2 {errors?.address_2}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className='flex justify-start'>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        Land Mark
                      </label>
                    </div>
                    <div className='mt-2'>
                      <input
                        id='landMark'
                        name='landMark'
                        type='text'
                        autoComplete='landMark'
                        placeholder='Nearby famous shop/mall/Landmark'
                        required
                        value={formData?.landMark}
                        className={`form-control ${
                          errors?.landMark && "is-invalid"
                        }`}
                        onChange={handleChange}
                      />
                    </div>
                    {errors?.landMark && (
                      <div
                        style={{ display: "block" }}
                        className='invalid-feedback'
                      >
                        Your Land Mark {errors?.landMark}
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
                          formData?.state || selectedState
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
                            {state?.name}
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

                  {isDataAvailable ? (
                    <button
                      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      onClick={handleUpdatedAddress}
                    >
                      Update your address
                    </button>
                  ) : (
                    <button
                      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      onClick={saveAddress}
                    >
                      Save your address
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ----------------- Form ----------------------- */}
      </div>
    </>
  );
};
export default Address;
