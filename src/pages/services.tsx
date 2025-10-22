import React from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const role = sessionStorage.getItem("role") || "user"; 

  const commonLinks = [
    { label: "Home", path: "/" },
    { label: "Create Booking", path: "/add-booking" },
    { label: "Bookings Lists", path: "/all-bookings" },
  ];

  const adminLinks = [
    { label: "Create Container", path: "/container" },
    { label: "Containers Lists", path: "/all-containers" },
    { label: "Track Your Deliveries", path: "/" },
    { label: "Admin Panel", path: "/admin-pannel" },
    { label: "Whatsapp-Media", path: "/whatsapp-marketing" },
    { label: "Update Status", path: "/all-containers" },
  ];

  // Decide which links to show
  const linksToShow =
    role === "admin" ? [...adminLinks,...commonLinks, ] : commonLinks;

  return (
    <div className="flex justify-center items-center px-8 h-[87vh] bg-[#2596be]">
      <div>
        <ul className="grid grid-cols-3 gap-8 text-center text-2xl">
          {linksToShow.map((l, index) => (
            <Link
              key={index}
              to={l.path}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2"
            >
              {l.label}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Services;
