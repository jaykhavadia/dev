const Footer = () => {
  return (
    <div>
      <div
        className='container-fluid bg-dark text-light footer py-5 wow fadeIn'
        data-wow-delay='0.1s'
      >
        <div className='container py-5'>
          <div className='row g-5'>
            <div className='col-lg-3 col-md-6'>
              <h4 className='text-white mb-4'>Our Office</h4>
              <p className='mb-2'>
                <i className='fa fa-map-marker-alt me-3'></i>123 Street, New York,
                USA
              </p>
              <p className='mb-2'>
                <i className='fa fa-phone-alt me-3'></i>+012 345 67890
              </p>
              <p className='mb-2'>
                <i className='fa fa-envelope me-3'></i>info@example.com
              </p>
              <div className='d-flex pt-2'>
                <a
                  className='btn btn-square btn-outline-light rounded-circle me-2'
                  href=''
                >
                  <i className='fab fa-twitter'></i>
                </a>
                <a
                  className='btn btn-square btn-outline-light rounded-circle me-2'
                  href=''
                >
                  <i className='fab fa-facebook-f'></i>
                </a>
                <a
                  className='btn btn-square btn-outline-light rounded-circle me-2'
                  href=''
                >
                  <i className='fab fa-youtube'></i>
                </a>
                <a
                  className='btn btn-square btn-outline-light rounded-circle me-2'
                  href=''
                >
                  <i className='fab fa-linkedin-in'></i>
                </a>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <h4 className='text-white mb-4'>Services</h4>
              <a className='btn btn-link' href=''>
                Landscaping
              </a>
              <a className='btn btn-link' href=''>
                Pruning plants
              </a>
              <a className='btn btn-link' href=''>
                Urban Gardening
              </a>
              <a className='btn btn-link' href=''>
                Garden Maintenance
              </a>
              <a className='btn btn-link' href=''>
                Green Technology
              </a>
            </div>
            <div className='col-lg-3 col-md-6'>
              <h4 className='text-white mb-4'>Quick Links</h4>
              <a className='btn btn-link' href=''>
                About Us
              </a>
              <a className='btn btn-link' href=''>
                Contact Us
              </a>
              <a className='btn btn-link' href=''>
                Our Services
              </a>
              <a className='btn btn-link' href=''>
                Terms & Condition
              </a>
              <a className='btn btn-link' href=''>
                Support
              </a>
            </div>
            <div className='col-lg-3 col-md-6'>
              <h4 className='text-white mb-4'>Newsletter</h4>
              <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
              <div className='position-relative w-100'>
                <input
                  className='form-control bg-light border-light w-100 py-3 ps-4 pe-5'
                  type='text'
                  placeholder='Your email'
                />
                <button
                  type='button'
                  className='btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2'
                >
                  SignUp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container-fluid copyright py-4'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6 text-center text-md-start mb-3 mb-md-0'>
              &copy;{" "}
              <a className='border-bottom' href='#'>
                Your Site Name
              </a>
              , All Right Reserved.
            </div>
            <div className='col-md-6 text-center text-md-end'>
              Designed By{" "}
              <a className='border-bottom' href='https://htmlcodex.com'>
                HTML Codex
              </a>{" "}
              Distributed By <a href='https://themewagon.com'>ThemeWagon</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
