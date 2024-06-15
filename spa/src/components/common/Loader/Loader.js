// src/components/Loader.js
import React from "react";
import { TailSpin } from "react-loader-spinner";
import "./Loader.css";

const Loader = () => {
  return (
    <div className='loader-wrapper'>
      <TailSpin
        visible={true}
        height='80'
        width='80'
        color='#4fa94d'
        ariaLabel='tail-spin-loading'
        radius='1'
      />
    </div>
  );
};

export default Loader;
