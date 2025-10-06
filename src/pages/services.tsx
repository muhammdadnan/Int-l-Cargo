import React from 'react'
import {Link} from 'react-router-dom'
const Services = () => {
  
  const servicesLinks = [
    { label: 'Home',path:'/' },
    { label: 'Create Booking',path:'/add-booking' },
    { label: 'Create Container',path:'/container' },
    { label: 'Bookings Lists',path:'/all-bookings' },
    { label: 'Containers Lists',path:'/all-containers' },
    { label: 'Track Your Deliveries',path:'/' },
    { label: 'Whatsapp-Media',path:'/whatsapp-marketing' }
  ]
  return (
    // <div className="relative flex flex-col items-center justify-center  from-slate-200 to-slate-400 h-[87vh] p-6 rounded-r-xl shadow-inner">
      
    //   {/* Navigation Buttons */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-md">
    //     {
    //       servicesLinks.map((link, index) => (
    //         <Link key={index} to={link.path} className="bg-[#1E90FF] text-white font-semibold py-3 px-6 rounded-md shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 ease-in-out">
    //           {link.label}
    //         </Link>
            
    //       ))
    //     }
       
    //   </div>

     
      
    // </div>
    <div className="flex justify-center items-center px-8">
    <div className=" ">
        <ul className="grid grid-cols-3 row-span-3 gap-8 text-center text-2xl ">
          {
            servicesLinks.map((l, index) => (
              <Link key={index} to={l.path} className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 align-middle">
                {l.label}
                </Link>

              
              
            ))
          }
          
              <Link to={'/admin-pannel'} className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 align-middle">
                Admin Pannel
                </Link>
              <Link to={'/all-containers'} className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 align-middle">
                Update status
                </Link>
          
      </ul>
    </div>
  </div>
  )
}

export default Services
