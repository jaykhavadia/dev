import { useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { contact } from "../../service/api_service";
import toast from "react-hot-toast";

const Contact = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
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

  const validateForm = () => {
    const errors = {};

    if (formData.name.trim().length < 3) {
      errors.name = "Name should be at least 3 characters long";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    if (formData.phone.length !== 10) {
      errors.phone = "Mobile number should be 10 digits long";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      const isValid = validateForm();
      if (isValid) {
        // Perform form submission
        const response = await contact(formData);
        if (response) {
          toast.success("Form Submitted SuccessFully!");
          resetFields();
        }
      }
    } catch (error) {
      console.error("error in contact form", error);
      toast.error(error.message);
    }
  };

  const resetFields = () => {
    setErrors();
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div>
      <Navbar />
      <div
        className='container-fluid page-header py-5 mb-5 wow fadeIn'
        data-wow-delay='0.1s'
      >
        <div className='container text-center py-5'>
          <h1 className='display-3 text-white mb-4 animated slideInDown'>
            Contact Us
          </h1>
          <nav aria-label='breadcrumb animated slideInDown'>
            <ol className='breadcrumb justify-content-center mb-0'>
              <li className='breadcrumb-item'>
                <a href='#'>Home</a>
              </li>
              <li className='breadcrumb-item'>
                <a href='#'>Pages</a>
              </li>
              <li className='breadcrumb-item active' aria-current='page'>
                Contact
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className='container-xxl py-5'>
        <div className='container'>
          <div className='row g-5'>
            <div className='col-lg-6 wow fadeIn' data-wow-delay='0.1s'>
              <p className='fs-5 fw-bold text-primary'>Contact Us</p>
              <h1 className='display-5 mb-5'>
                If You Have Any Query, Please Contact Us
              </h1>
              <p className='mb-4'>
                The contact form is currently inactive. Get a functional and
                working contact form with Ajax & PHP in a few minutes. Just copy
                and paste the files, add a little code and you're done.{" "}
                <a href='https://htmlcodex.com/contact-form'>Download Now</a>.
              </p>
              <div>
                <div className='row g-3'>
                  <div className='col-md-6'>
                    <div className='form-floating'>
                      <input
                        type='text'
                        className={`form-control ${
                          errors?.name && "is-invalid"
                        }`}
                        id='name'
                        placeholder='Your Name'
                        value={formData?.name}
                        onChange={handleChange}
                      />
                      <label>Your Name</label>
                      {errors?.name && (
                        <div className='invalid-feedback'>{errors?.name}</div>
                      )}
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-floating'>
                      <input
                        type='tel'
                        className={`form-control ${
                          errors?.phone && "is-invalid"
                        }`}
                        id='phone'
                        placeholder='Your Mobile Number'
                        value={formData?.phone}
                        onChange={handleChange}
                      />
                      <label htmlFor='phone'>Your Mobile Number</label>
                      {errors?.phone && (
                        <div className='invalid-feedback'>{errors?.phone}</div>
                      )}
                    </div>
                  </div>
                  <div className='col-12'>
                    <div className='form-floating'>
                      <input
                        type='email'
                        className={`form-control ${
                          errors?.email && "is-invalid"
                        }`}
                        id='email'
                        placeholder='Your Email'
                        value={formData?.email}
                        onChange={handleChange}
                      />
                      <label>Your Email</label>
                      {errors?.email && (
                        <div className='invalid-feedback'>{errors?.email}</div>
                      )}
                    </div>
                  </div>
                  <div className='col-12'>
                    <div className='form-floating'>
                      <textarea
                        className='form-control'
                        placeholder='Leave a message here'
                        id='message'
                        style={{ height: "100px" }}
                        value={formData?.message}
                        onChange={handleChange}
                      ></textarea>
                      <label>Message</label>
                    </div>
                  </div>
                  <div className='col-12'>
                    <button
                      className='btn btn-primary py-3 px-4'
                      type='button'
                      onClick={handleSubmit}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className='col-lg-6 wow fadeIn'
              data-wow-delay='0.5s'
              style={{ minHeight: "450px" }}
            >
              <div className='position-relative rounded overflow-hidden h-100'>
                <iframe
                  className='position-relative w-100 h-100'
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024572.936063013!2d69.24337458282552!3d22.25857801175393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39582235017a20ab%3A0xa0b326d63ff6b59c!2sGujarat!5e0!3m2!1sen!2sin!4v1650803484429!5m2!1sen!2sin'
                  frameBorder='0'
                  style={{ minHeight: "450px", border: "0" }}
                  allowFullScreen=''
                  aria-hidden='false'
                  tabIndex='0'
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Contact;
