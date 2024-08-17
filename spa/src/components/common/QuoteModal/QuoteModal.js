import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { createQuote } from "../../../service/api_service";

const QuoteModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobile: "",
    serviceType: [],
    pincode: "",
    budget: 0,
    message: "",
    image: null, // New state for image
  });
  const [formErrors, setFormErrors] = useState({});

  const location = useLocation();

  // Check if the current route is '/admin'
  const isAdmin = location.pathname.startsWith('/admin');

  const allServiceOptions = [
    "Garden Maintenance",
    "Landscaping",
    "Pruning plants",
    "Urban Gardening",
    "Green Technology",
    "Irrigation & Drainage",
  ];

  const resetForm = () => {
    setFormValues({
      name: "",
      email: "",
      mobile: "",
      serviceType: [],
      pincode: "",
      budget: 0,
      message: "",
      image: null, // Reset image state
    });

    setAvailableOptions(allServiceOptions);
  };

  const [availableOptions, setAvailableOptions] = useState(allServiceOptions);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));

    setFormValues({ ...formValues, [id]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormValues({ ...formValues, image: file });
  };

  const handleServiceTypeChange = (e) => {
    const selectedService = e.target.value;
    setFormValues((prevState) => {
      const isAlreadySelected = prevState.serviceType.includes(selectedService);
      const updatedServiceType = isAlreadySelected
        ? prevState.serviceType.filter((service) => service !== selectedService)
        : [...prevState.serviceType, selectedService];

      setAvailableOptions(
        allServiceOptions.filter(
          (option) => !updatedServiceType.includes(option)
        )
      );

      return { ...prevState, serviceType: updatedServiceType };
    });
  };

  const removeService = (serviceToRemove) => {
    setFormValues((prevState) => {
      const updatedServiceType = prevState.serviceType.filter(
        (service) => service !== serviceToRemove
      );

      setAvailableOptions(
        allServiceOptions.filter(
          (option) => !updatedServiceType.includes(option)
        )
      );

      return { ...prevState, serviceType: updatedServiceType };
    });
  };

  const validateForm = () => {
    let errors = {};

    if (formValues.name.length < 3) {
      errors.name = "Name must be more than 3 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      errors.email = "Please enter a valid email address.";
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formValues.mobile)) {
      errors.mobile = "Mobile number must be 10 digits.";
    }

    if (!/^\d{6}$/.test(formValues.pincode)) {
      errors.pincode = "Pincode must be a 6-digit number.";
    }

    if (formValues.budget < 0) {
      errors.budget = "Budget must be a positive number.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log("Form submitted successfully:", formValues);
      try {
        const response = await createQuote(formValues);
        if (response) {
          toast.success("Quote Request Sent!");
        }
      } catch (error) {
        console.error(" [QuoteModal] [handleSubmit] Error:", error);
        toast.error(error.message);
      }
      toggleModal();
    }
  };

  return (
    <div className={`${isAdmin ? 'hidden' : '' }`} >
      {/* Floating Button */}
      <button
        onClick={() => {
          toggleModal();
          resetForm();
        }}
        className='fixed bottom-16 right-10 z-50 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
      >
        GET QUOTE
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          id='medium-modal'
          tabIndex='-1'
          className='fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto h-full w-full bg-black bg-opacity-50'
        >
          <div className='relative w-full max-w-lg max-h-full'>
            <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
              <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
                <h1 className='display-5 text-center mb-0 '>
                  Get A Free Quote
                </h1>
                <button
                  type='button'
                  className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
                  onClick={toggleModal}
                >
                  <svg
                    className='w-3 h-3'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 14 14'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                    />
                  </svg>
                  <span className='sr-only'>Close modal</span>
                </button>
              </div>
              <div className='p-4 md:p-5 space-y-4'>
                <div className='row g-3'>
                  {/* Existing fields */}
                  <div className='col-sm-6'>
                    <div className='form-floating'>
                      <input
                        type='text'
                        className='form-control bg-light border-0'
                        id='name'
                        placeholder='Your Name'
                        value={formValues.name}
                        onChange={handleInputChange}
                      />
                      <label>Your Name</label>
                      {formErrors.name && (
                        <p className='text-red-500'>{formErrors.name}</p>
                      )}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-floating'>
                      <input
                        type='email'
                        className='form-control bg-light border-0'
                        id='email'
                        placeholder='Your Email'
                        value={formValues.email}
                        onChange={handleInputChange}
                      />
                      <label>Your Email</label>
                      {formErrors.email && (
                        <p className='text-red-500'>{formErrors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-floating'>
                      <input
                        type='number'
                        className='form-control bg-light border-0'
                        id='mobile'
                        placeholder='Your Mobile'
                        value={formValues.mobile}
                        onChange={handleInputChange}
                      />
                      <label>Your Mobile</label>
                      {formErrors.mobile && (
                        <p className='text-red-500'>{formErrors.mobile}</p>
                      )}
                    </div>
                  </div>
                  {/* Service Type Field */}
                  <div className='col-sm-6'>
                    <div className='form-floating'>
                      <select
                        className='form-control bg-light border-0'
                        id='serviceType'
                        value=''
                        onChange={handleServiceTypeChange}
                      >
                        <option value='' disabled>
                          Select Service Type
                        </option>
                        {availableOptions.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                      <label>Service Type</label>
                    </div>
                  </div>
                  <div className='col-12'>
                    <div className='flex flex-wrap gap-2'>
                      {formValues.serviceType.map((service) => (
                        <span
                          key={service}
                          className='inline-flex items-center justify-center rounded-full border border-green-500 px-2.5 py-0.5 text-green-700'
                        >
                          <p className='whitespace-nowrap mb-0 text-sm'>
                            {service}
                          </p>
                          <button
                            className='-me-1 ms-1.5 inline-block rounded-full bg-green-200 p-0.5 text-green-700 transition hover:bg-green-300'
                            onClick={() => removeService(service)}
                          >
                            <span className='sr-only'>Remove badge</span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth='1.5'
                              stroke='currentColor'
                              className='size-3'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M6 18L18 6M6 6l12 12'
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-floating'>
                      <input
                        type='number'
                        className='form-control bg-light border-0'
                        id='pincode'
                        placeholder='Pincode'
                        value={formValues.pincode}
                        onChange={handleInputChange}
                      />
                      <label>Pincode</label>
                      {formErrors.pincode && (
                        <p className='text-red-500'>{formErrors.pincode}</p>
                      )}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <div className='form-floating'>
                      <input
                        type='number'
                        className='form-control bg-light border-0'
                        id='budget'
                        placeholder='Budget'
                        value={formValues.budget}
                        onChange={handleInputChange}
                      />
                      <label>Budget</label>
                      {formErrors.budget && (
                        <p className='text-red-500'>{formErrors.budget}</p>
                      )}
                    </div>
                  </div>
                  {/* New Image Input Field */}
                  <div className='col-12'>
                    <div className='form-floating'>
                      <input
                        type='file'
                        className='form-control bg-light border-0'
                        id='image'
                        accept='image/*'
                        onChange={handleFileChange}
                      />
                      <label>Upload Image</label>
                      {formValues.image && (
                        <p className='text-gray-500'>{formValues.image.name}</p>
                      )}
                    </div>
                  </div>
                  {/* Other fields */}
                  <div className='col-12'>
                    <div className='form-floating'>
                      <textarea
                        className='form-control bg-light border-0'
                        placeholder='Leave a message here'
                        id='message'
                        style={{ height: "100px" }}
                        value={formValues.message}
                        onChange={handleInputChange}
                      ></textarea>
                      <label>Message</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className='p-4 md:p-5 border-t border-gray-200 dark:border-gray-600'>
                <div className='col-12 text-center'>
                  <button
                    className='btn btn-primary py-3 px-4'
                    type='submit'
                    onClick={handleSubmit}
                  >
                    Submit Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteModal;
