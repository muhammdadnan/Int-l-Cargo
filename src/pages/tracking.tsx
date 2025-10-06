
import Logo from "@/assets/logo.jpg";
import { Divider, Field } from "@/components/TrackingData/TrackCompo";
import { TrackingDetails } from "@/components/TrackingData/TrackingDetails";
import { TrackingHistory } from "@/components/TrackingData/TrackingHistory";
import {useNavigate} from 'react-router-dom'
export default function Tracking() {
  const navigate = useNavigate() 
  // Dummy data — replace with your real API response
  
  const invoice = {
    number: "S0169743",
    date: "08/08/2025",
    bookingOffice: "HEAD OFFICE",
    sender: "PUNJAB EXPRESS CARGO",
    receiver: "ROJIN KUMAR RAM",
    docketNo: "—",
    toLocation: "Madhu ban-",
    localTransporter: "—",
    totalWeight: "43",
    pieces: 1,
    currentStatusDate: "04 Sep 2025",
    currentStatus: "SHIPMENT CLEARED at NEW DELHI–INDIA",
  };


  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Top spacing to mimic screenshot white space */}
      <div className="h-8" />

      <main className="mx-auto max-w-5xl px-4">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src={Logo}
            alt="Professional delivery service"
            className="w-28  rounded-2xl"
          />
          <div className="pl-3">
            <h3 className="text-red-700 text-6xl font-bold text-center ">
              PCC
            </h3>
            <p className="text-6xl text-red-700 -mt-1">
              Pak Chinar Int'I Cargo
            </p>
          </div>
        </div>

        {/* System title */}
        <p className="mt-2 text-center text-sm tracking-wider text-gray-500">
          Consignment Tracking System
        </p>

        {/* Tracking Details  */}
          <TrackingDetails invoice={invoice}/>
        {/* History */}
        <h2 className="mt-10 text-center text-lg font-semibold">
          Tracking History for{" "}
          <span className="text-blue-700">{invoice.number}</span>
        </h2>
        <Divider className="mx-auto mt-2 max-w-xs" />

       <TrackingHistory/>
        {/* Back button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Pak Chinar Int'I Cargo Home
          </button>
        </div>

        <div className="h-10" />
      </main>
    </div>
  );
}


