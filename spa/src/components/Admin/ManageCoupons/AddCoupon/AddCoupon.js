import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import {
  createCoupon,
  getCouponByCODE,
  ME,
  updateCoupon,
  updateProduct,
} from "../../../../service/api_service";
import Footer from "../../../Footer/Footer";
import Sidebar from "../../../Sidebar/Sidebar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkAdmin, Logout } = useContext(AuthContext);
  const [zoom, setZoom] = useState("scale-0");
  const [userData, setUserData] = useState();
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [couponId, setCouponId] = useState();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    value: "",
    endingDate: "",
    startingDate: "",
    maximumDiscountPrice: "",
    minimumPurchasingPrice: "",
  });
  const [isDataAvailable, setIsDataAvailable] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "title" ? value.toUpperCase() : value,
    }));

    // Reset error message for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const validateForm = () => {
    const errorMessage = "is required";
    const errors = {};
    if (!formData.title) {
      errors.title = errorMessage;
    }
    if (formData?.title?.length < 3 || formData?.title?.length > 10) {
      errors.title = "must be of 3 - 10 character";
    }
    if (formData?.title.includes(" ")) {
      errors.title = "should not contain spaces";
    }
    if (!formData.value) {
      errors.value = errorMessage;
    }
    if (formData.value < 0) {
      errors.value = "should be more then 1";
    }
    if (!formData.type) {
      errors.type = errorMessage;
    }
    if (!formData.minimumPurchasingPrice) {
      errors.minimumPurchasingPrice = errorMessage;
    }
    if (!formData.maximumDiscountPrice && formData.type === "Percentage") {
      errors.maximumDiscountPrice = errorMessage;
    }
    if (formData.type === "Percentage" && formData.value > 100) {
      errors.value = "should be less then 100%";
      setFormData((prevData) => ({
        ...prevData,
        value: "",
      }));
    }
    if ((formData.type === 'fixedAmount') && formData.minimumPurchasingPrice < formData.value) {
      errors.value = 'should be more then Minimum Purchasing Price';
    }

    setErrors(errors);
    console.error("err", errors);

    // If errors exist, prevent form submission
    if (Object.keys(errors).length > 0) {
      return false;
    }
    return true;
  };

  const submitForm = async () => {
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

      formData.startingDate = startDate;
      formData.endingDate = endDate;
      try {
        console.log("form Data", formData);
        let result;
        console.log("formData", formData);
        result = await createCoupon(formData);
        if (result) {
          toast.success(result.message || "Coupon added Successful!");
          resetFields();
          navigate("/admin/manage-coupons");
        }
        return;
        // result = await addProduct(formData);
        // if (result) {
        //   toast.success("Product added Successful!");
        //   resetFields();
        //   // await setGardenData();
        // }
      } catch (error) {
        console.error("Error while Login:", error);
        toast.error(error.message);
      }
    }
  };

  const handleUpdatedCoupon = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Token Expired");
      navigate("/login");
      return;
    }
    const isValid = validateForm();
    if (isValid) {
      formData.startingDate = startDate;
      formData.endingDate = endDate;
      try {
        delete formData.userId;
        console.log("form Data", formData);
        const result = await updateCoupon(formData, couponId); // Call getSomeData function from the API service
        if (result) {
          toast.success(result.message);
          resetFields();
          navigate("/admin/manage-coupons");
        }
      } catch (error) {
        console.error("Error while Login:", error);
        toast.error(error.message);
      }
    }
  };

  const resetFields = () => {
    setFormData({
      title: "",
      type: "",
      value: "",
      startTime: "",
      EndTime: "",
    });
    setErrors();
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
      return user?.user?.isAdmin || false;
    } catch (error) {
      if (error.message === "jwt expired") {
        Logout();
      }
      throw new Error(error);
    }
  };

  const setCouponData = async () => {
    const response = await getCouponByCODE(id);

    if (response === null) {
      return;
    }
    if (response?.message === "Invalid token") {
      toast.error(response?.message);
      localStorage.clear();
      navigate("/login");
    }
    console.log("resonse", response);
    const transformData = {
      title: response.couponDetail.title,
      type: response.couponDetail.type,
      value: response.couponDetail.value,
      startingDate: new Date(response.couponDetail.startingDate).toISOString(), // or format as needed
      endingDate: new Date(response.couponDetail.endingDate).toISOString(), // or format as needed
      maximumDiscountPrice: response.couponDetail.maximumDiscountPrice,
      minimumPurchasingPrice: response.couponDetail.minimumPurchasingPrice,
    };
    setCouponId(response.couponDetail._id);
    setFormData(transformData);
    setIsDataAvailable(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    async function getProductData() {
      try {
        const isAdmin = await me();
        if (!isAdmin) {
          toast.error("You are not a admin");
          Logout();
          return;
        }
        if (id) {
          await checkAdmin(`/admin/edit-coupon/${id}`);
        } else {
          await checkAdmin("/admin/add-coupon");
        }
        await me();
        if (id) {
          await setCouponData();
        }
      } catch (error) {
        console.error("getProductData", error);
        throw error;
      }
    }
    getProductData();

    // Zoom in after a delay
    setTimeout(() => {
      setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  return (
    <div>
      <Sidebar />
      <div
        className='container-fluid page-header py-5 wow fadeIn'
        data-wow-delay='0.1s'
      >
        <div className='container text-center py-5'>
          <h1 className='display-3 text-white mb-4 animated slideInDown'>
            Add Coupon
          </h1>
          <nav aria-label='breadcrumb animated slideInDown'>
            <ol className='breadcrumb justify-content-center mb-0'>
              <li className='breadcrumb-item'>Home</li>
              <li className='breadcrumb-item'>Pages</li>
              <li className='breadcrumb-item' aria-current='page'>
                admin / add-coupon
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
                          Coupon CODE
                        </label>
                      </div>
                      <div className='mt-2'>
                        <input
                          id='title'
                          name='title'
                          type='text'
                          autoComplete='title'
                          placeholder='Enter your CODE'
                          required
                          value={formData?.title}
                          className={`form-control ${
                            errors?.title && "is-invalid"
                          }`}
                          onChange={handleChange}
                        />
                      </div>
                      {errors?.title && (
                        <div
                          style={{ display: "block" }}
                          className='invalid-feedback'
                        >
                          Your Coupon CODE {errors?.title}
                        </div>
                      )}
                    </div>

                    <div className='flex flex-col sm:flex-row justify-between'>
                      <div className='mr-4 sm:w-56 w-full'>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            value
                          </label>
                        </div>
                        <input
                          id='value'
                          name='value'
                          type='number'
                          placeholder='Enter value'
                          value={formData?.value}
                          onChange={handleChange}
                          className={`form-control ${
                            errors?.value && "is-invalid"
                          }`}
                          min={1}
                        />
                        {errors?.value && (
                          <div className='invalid-feedback'>
                            Your Coupon Value {errors?.value}
                          </div>
                        )}
                      </div>

                      <div className='sm:w-56 w-full'>
                        <div className='flex justify-start'>
                          <label className='block text-sm font-medium leading-6 text-gray-900'>
                            Type
                          </label>
                        </div>
                        <select
                          id='type'
                          name='type'
                          value={formData.type}
                          onChange={handleChange}
                          className={`form-control ${
                            errors?.type && "is-invalid"
                          }`}
                        >
                          <option value=''>Select Type</option>
                          <option value='Percentage'>Percentage</option>
                          <option value='fixedAmount'>Fixed Amount</option>
                        </select>
                        {errors?.type && (
                          <div className='invalid-feedback'>
                            Your Coupon type {errors?.type}
                          </div>
                        )}
                      </div>
                    </div>
                    {formData.type !== "" && (
                      <div
                        className={
                          formData.type === "Percentage"
                            ? "flex flex-col sm:flex-row justify-between"
                            : ""
                        }
                      >
                        <div
                          className={
                            formData.type === "Percentage"
                              ? "sm:w-56 w-full"
                              : "w-full"
                          }
                        >
                          <div className='flex justify-start'>
                            <label className='block text-sm font-medium leading-6 text-gray-900'>
                              Minimum Purchasing Price
                            </label>
                          </div>
                          <input
                            id='minimumPurchasingPrice'
                            name='minimumPurchasingPrice'
                            type='number'
                            placeholder='Enter Minimum Purchasing Price'
                            value={formData?.minimumPurchasingPrice}
                            onChange={handleChange}
                            className={`form-control ${
                              errors?.minimumPurchasingPrice && "is-invalid"
                            }`}
                            min={1}
                          />
                          {errors?.minimumPurchasingPrice && (
                            <div className='invalid-feedback'>
                              Your Coupon minimum purchasing price{" "}
                              {errors?.minimumPurchasingPrice}
                            </div>
                          )}
                        </div>
                        {formData.type === "Percentage" && (
                          <div className='sm:w-56 w-full'>
                            <div className='flex justify-start'>
                              <label className='block text-sm font-medium leading-6 text-gray-900'>
                                Maximum Discount Price
                              </label>
                            </div>
                            <input
                              id='maximumDiscountPrice'
                              name='maximumDiscountPrice'
                              type='number'
                              placeholder='Enter Maximum Discount Price'
                              value={formData?.maximumDiscountPrice}
                              onChange={handleChange}
                              className={`form-control ${
                                errors?.maximumDiscountPrice && "is-invalid"
                              }`}
                              min={1}
                            />
                            {errors?.maximumDiscountPrice && (
                              <div className='invalid-feedback'>
                                Your Coupon Maximum Discount Price{" "}
                                {errors?.maximumDiscountPrice}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <div className='mt-4 w-full flex flex-col sm:flex-row justify-between items-center'>
                        <div className='relative sm:w-44 w-full '>
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                              setStartDate(date);
                              if (date > endDate) {
                                setEndDate(date);
                              }
                            }}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat='dd/MM/yyyy'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            placeholderText='Select start date'
                          />
                        </div>
                        <span className='mx-4 text-gray-500'>to</span>
                        <div className='sm:w-44 w-full'>
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            dateFormat='dd/MM/yyyy'
                            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                            placeholderText='Select end date'
                          />
                        </div>
                      </div>
                    </div>

                    {isDataAvailable ? (
                      <button
                        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        onClick={handleUpdatedCoupon}
                      >
                        Update your Coupon
                      </button>
                    ) : (
                      <button
                        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                        onClick={submitForm}
                      >
                        Add Coupon
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

export default AddCoupon;
