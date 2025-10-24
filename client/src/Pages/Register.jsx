import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { post } from "../services/Endpoint.js";


const Register = () => {
   const navigate =useNavigate() 
  const [value, setValue] = useState({
    register: "",
    email: "",
    password: "",
    image: null, // To store the selected image
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue({ ...value, image: file }); // Directly update the state with the selected file
    }
   
  }

  const handleImageClick = () => {
    document.getElementById('image').click();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData object
    const formData = new FormData();
    formData.append('Register', value.register);
    formData.append('email', value.email);
    formData.append('password', value.password);
    formData.append('profile', value.image); // Using 'profile' as the key for the image

    try {
      const response = await post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data;
      if (data.success) {
        console.log(data.message)
        navigate('/')
        toast.success(data.message)

       }
      
    } catch (error) {
      console.log(error);
      console.error("login error", error);
      if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message)
      } else {
          toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }
  return (
    <div
       className="min-h-screen w-full flex items-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/Login bg.jpg')",
      }}
    >
   <div className="flex flex-col items-center rounded-full">
            <div className=" w-[80px] sm:w-[100px] md:w-[80px] lg:w-[300px] max-w-[500px] "> {/* Extra div for left-right padding */}
            </div></div>
      {/* White Box (Narrow & Responsive) */}
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 md:p-10 w-[350px] sm:w-[400px] md:w-[450px] max-w-[450px]">
      <div className="flex flex-col items-center rounded-full">
            <div className="w-[2px] h-[10px] "> {/* Extra div for left-right padding */}
            </div></div>

        {/* Logo & Heading */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <img src="/logo2.png" alt="Logo" className="w-16 sm:w-24 md:w-24 lg:w-28" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Registration</h2>
        </div>


        {/* Spacing Divider */}
        <div className="h-6 sm:h-8 md:h-6"></div>

        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* animated user */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
       
       <label  className="cursor-pointer">
       <img src={value.image ? URL.createObjectURL(value.image) :"/adduser1.gif" } alt="Loading animation" className="w-20 h-20 mx-auto rounded-full" style={{marginBottom:40,cursor: 'pointer',objectFit:"cover"}} 
       onClick={handleImageClick}
       />
       
     </label>
     {/* Hidden File Input */}
     <input
       type="file"
       id="image"
       className="hidden"
       accept="image/*"
       onChange={handleImageChange} 
      
     />
       </div>
          {/* Register Number */}
          <div>
            <label htmlFor="register" className="block text-[20px] font-medium text-gray-900 [text-indent:2rem] sm:[text-indent:2.5rem] md:[text-indent:2.5rem]">Register Number</label>
            {/* Extra spacing between label and input */}
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[35px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[85%] mx-auto">
            <input
              type="text"
              id="register" 
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
              value={value.register} 
              onChange={(e) => setValue({ ...value, register: e.target.value })} 
            />
            </div>
          </div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>

          {/* Bitsathy Mail */}
          <div>
            <label htmlFor="email" className="block text-[20px] font-medium text-gray-900  [text-indent:2rem] sm:[text-indent:2.5rem] md:[text-indent:2.5rem]">E-Mail</label>
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[35px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[85%] mx-auto"> 
            <input
              type="email"
              id="email" 
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
              value={value.email} 
              onChange={(e) => setValue({ ...value, email: e.target.value })} 
            />
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-[20px] font-medium text-gray-900  [text-indent:2rem] sm:[text-indent:2.5rem] md:[text-indent:2.5rem]">Password</label>
            <div className="h-4 sm:h-6 md:h-4"></div>
            <div className="flex items-center rounded-full">
            <div className="w-[35px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[85%] mx-auto"> 
            <input
              type="password"
              id="password" 
              className="w-full h-10 sm:h-12 [text-indent:1rem] sm:[text-indent:1.25rem] pr-3 sm:pr-4 rounded-full bg-gray-200 focus:ring-2 focus:ring-indigo-400"
              required
              value={value.password} 
              onChange={(e) => setValue({ ...value, password: e.target.value })} 
            />
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-8 sm:h-10 md:h-8"></div>

          {/* Sign Up Button */}
          <div>
          <div className="flex items-center rounded-full">
            <div className="w-[35px] "> {/* Extra div for left-right padding */}
            </div>
            <div className="w-[85%] mx-auto"> 
            <button className="w-full h-10 sm:h-12 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition" style={{cursor:'pointer'}} >
              Sign Up
            </button>
          </div></div></div>

          {/* Extra Divider */}
          <div className="h-6 sm:h-8 md:h-6"></div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-700 text-sm sm:text-base">
              Already have an account?{" "}
              <Link to="/" className="text-blue-700 underline font-semibold" style={{textDecoration:'none'}} >
                Login
              </Link>
            </p>
          </div>
          <div className="flex items-center rounded-full">
            <div className="w-[8px] h-[10px] "> {/* Extra div for left-right padding */}
            </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Register;