import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/final1200x600.png";
import TrackingModal from "./TrackingModal";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
const HeroSection = () => {
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   
                    if (name === "invoiceNo") {
            // Sirf digits allow karo aur max 12 tak
            const onlyNumbers = value.replace(/\D/g, ""); // non-digits remove
            if (onlyNumbers.length <= 12) {
              setTrackingNumber(onlyNumbers)
            }
            return;
          }
  }
  const handleTrack = () => {
    if (trackingNumber.length !== 12) {
      toast.error("Tracking No must be exactly 12 digits");
      return;
    }
    navigate(`/track/?invoice=${trackingNumber}`)
  };
  return (
    <section className="relative min-h-screen flex items-center pt-16 lg:pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional delivery service"
          className="w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      </div>

      <div className="relative z-10 px-4 lg:px-8">
        <div className="grid lg:grid-cols-1 gap-8">
          {/* Hero Content */}
       <div className="text-left ">
  <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
    Delivering happiness across the world.
  </h1>
  <p className="text-lg lg:text-xl text-white/90 mb-8 max-w-lg">
    Fast and secure cargo & couriers in Saudi Arabia.
  </p>

  {/* Tracking Section */}
  <div className="bg-white/95 backdrop-blur rounded-lg p-6 shadow-xl max-w-screen-3xl">
    <div className="flex flex-col sm:flex-row gap-3 w-full items-center">
      <Input
        type="text"
        placeholder="Enter Invoice No."
        value={trackingNumber}
        onChange={handleChange}
        className="flex-1 h-20 w-40"
        name="invoiceNo"
      />
      <Button
        onClick={handleTrack}
        className="bg-red-500 hover:bg-red-600 text-white font-medium px-12 py-4 whitespace-nowrap mt-5 sm:mt-0"
      >
        TRACK IT
      </Button>
    </div>
  </div>
</div>


          {/* Hero Image Space for larger screens */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* Floating Track Package Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsTrackingModalOpen(true)}
          className="bg-brand-blue  hover:bg-blue-600 text-white rounded-full px-6 py-3 shadow-lg font-medium"
        >
          📦 Track Package
        </Button>
      </div>

      {/* Tracking Modal */}
      <TrackingModal
        open={isTrackingModalOpen}
        onOpenChange={setIsTrackingModalOpen}
      />
    </section>
  );
};

export default HeroSection;