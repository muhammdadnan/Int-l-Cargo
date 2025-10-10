import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { AppRoutes } from '../constants/AppRoutes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CsvModal from '@/components/CsvModal';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setbookingLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    
  const [searchQuery, setSearchQuery] = useState(""); // ✅ NEW
  const [currentPage,setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number | "All">(10);

  
  const [showModal, setShowModal] = useState(false);
  const [branch, setBranch] = useState([]);
  const navigate = useNavigate();


  const getBookings = async () => { 
    try {
      setbookingLoading(true)
      const response = await axios.get(AppRoutes.allBookings);
      setBookings(response?.data?.data?.bookings || []);
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err?.general);
      if (!err) toast.error('Something went wrong');
    } finally {
            setbookingLoading(false)
    }
  };

  useEffect(() => {
    getBookings();
    fetchBranches()
  }, []);
  // console.log(bookings);
  
  const handleDelete = async (id, builtNo,statusInput) => {
    try {
      // const statusList = Array.isArray(statusInput)
      // ? statusInput
      // : typeof statusInput === "string"
      // ? [statusInput]
      // : [];
      // console.log(statusList);
      // const notAllowed = statusList.some(status => status.toLowerCase() !== "shipment in godown" && status.toLowerCase() !== "delivered");
    //   if (notAllowed) {
    //   toast.error("This Booking is no more deletable already in process.");
    //   return;
    // }
      if (!builtNo) {
        toast.error('Builty no is missing');
        return;
      }
      
      const confirmed = window.confirm('Are you sure you want to delete this booking?');
      if (!confirmed) return;
        setDeleteLoadingId(id); 
      const response = await axios.delete(AppRoutes.deleteBooking, { data: { BiltyNo: builtNo } });
      const data = response.data;
      toast.success(data?.data?.message);
      getBookings(); // ✅ Refresh bookings
    } catch (error) {
    console.log(error);
    
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err?.general);
      if (!err) toast.error('Something went wrong');
    } finally {
        setDeleteLoadingId(null); 
      
    }
  };

  // ✅ FILTERED BOOKINGS
  // const filteredBookings = bookings.filter(booking =>
  //   booking.InvoiceNo?.toString().includes(searchQuery.trim())
  // );
  const filteredBookings = bookings.filter((booking) => {
  const q = searchQuery.trim().toLowerCase();

  return (
    booking.InvoiceNo?.toString().toLowerCase().includes(q) ||
    booking.BiltyNo?.toString().toLowerCase().includes(q) ||
    booking.SenderName?.toLowerCase().includes(q) ||
    booking.ReceiverName?.toLowerCase().includes(q) ||
    booking.SenderMobile?.toString().includes(q) ||
    booking.ReceiverMobile1?.toString().includes(q) ||
    booking.ReceiverMobile2?.toString().includes(q)
  );
});

  // ✅ PAGINATION LOGIC
  const totalPages =
 itemsPerPage === "All"
    ? 1
    : Math.ceil(filteredBookings.length / (itemsPerPage as number));

  //set the item on curent page through index
  const startIndex =
  itemsPerPage === "All" ? 0 : (currentPage - 1) * itemsPerPage;

  // set items to show on page  according to number
  const currentBookings =
  itemsPerPage === "All"
    ? filteredBookings
    : filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  // const currentIndex = filteredBookings.
  
  
  const fetchBranches = async () => {
      try {
        const res = await axios.get(AppRoutes.allBranch);
        setBranch(res.data?.data?.allBranches || []);
      } catch (error) {
        const err = error?.response?.data?.errors;
        if (err?.general) toast.error(err.general);
        else toast.error('Something went wrong');
      }
    };
  return (
    <div className="bg-gray-50 min-h-screen">
      {
        showModal &&  (<CsvModal setShowModal={setShowModal} branches={branch} bookings={bookings}/>)
      }
      <Header />
      {
        bookingLoading ? (
        <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
        Loading...
          </div>
        ): (
          <>
              <h1 className="text-center text-2xl font-bold text-blue-800 px-4 pt-6 pb-2">
        All Bookings Details
      </h1>

      {/* ✅ SEARCH BAR */}
      <div className="flex justify-center mb-4 relative w-1/2 mx-auto">
        <input
          type="text"
          // placeholder="Search by Invoice No..."
          placeholder="Search by Invoice No, Bilty No, Name or Phone..."

          value={searchQuery}
          onChange={(e) =>{ 
            setSearchQuery(e.target.value);
            setCurrentPage(1)
          }}
          // className="w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {searchQuery && (
    <button
      onClick={() => setSearchQuery("")}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      ✕
    </button>
  )}
      </div>
      
              {/* ✅ Per Page Dropdown */}
          <div className="flex justify-center px-6 mb-2">
            <label className="mr-2 font-semibold">Rows per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                const value = e.target.value;
                setItemsPerPage(value === "All" ? "All" : Number(value));
                setCurrentPage(1); // reset to first page

              }}
              className="border rounded px-2 py-1"
            >
              {[5, 10, 20, 50,"All"].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>


      <div className="p-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {currentBookings.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-700 bg-white">
              <thead className="text-xl uppercase bg-gray-200 text-gray-800">
                <tr className="border-b border-gray-300 text-center">
                  <th className="px-6 py-3">S.No</th>
                  <th className="px-6 py-3">Bilty No</th>
                  <th className="px-6 py-3">Invoice No</th>
                  <th className="px-6 py-3">Booking Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Sender Name</th>
                  <th className="px-6 py-3">Sender Mobile</th>
                  <th className="px-6 py-3">Sender City</th>
                  <th className="px-6 py-3">Receiver Name</th>
                  <th className="px-6 py-3">Receiver Mobile 1</th>
                  <th className="px-6 py-3">Receiver Mobile 2</th>
                  <th className="px-6 py-3">Receiver City</th>
                  <th className="px-6 py-3">No. of Pieces</th>
                  <th className="px-6 py-3">Branch</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                        {currentBookings.map((row, index) => {
                          // console.log(row);
                          
                  return  <tr key={index} className="bg-white border-b hover:bg-gray-50 text-center">
                    <td className="px-4 py-2">{startIndex + index + 1}</td>
                    <td className="px-4 py-2">{row.BiltyNo || '-'}</td>
                    <td className="px-4 py-2">{row.InvoiceNo || '-'}</td>
                    <td className="px-4 py-2">{row.BookingDate || '-'}</td>
                    <td className="px-4 py-2">
  {row.status}
</td>

                    <td className="px-4 py-2">{row.SenderName || '-'}</td>
                    <td className="px-4 py-2">{row.SenderMobile || '-'}</td>
                    <td className="px-4 py-2">{row.SenderArea || '-'}</td>
                    <td className="px-4 py-2">{row.ReceiverName || '-'}</td>
                    <td className="px-4 py-2">{row.ReceiverMobile1 || '-'}</td>
                    <td className="px-4 py-2">{row.ReceiverMobile2 || '-'}</td>
                    <td className="px-4 py-2">{row.ReceiverArea || '-'}</td>
                    <td className="px-4 py-2">{row.NoOfPieces || '-'}</td>
                    <td className="px-4 py-2">{row.Branch || '-'}</td>
                    <td className="px-4 py-2">{row.City || '-'}</td>
                    <td className="px-6 flex gap-4 py-4 text-center">
                      <button
                        onClick={() => navigate(`/edit-booking/edit/${row._id}`)}
                        className="cursor-pointer text-green-600 hover:text-blue-800"
                      >
                        Edit Booking
                      </button>
                      
                        <button
  onClick={() => handleDelete(row._id, row.BiltyNo, row.status)}
  className="cursor-pointer text-red-600 hover:text-blue-800"
>
  {deleteLoadingId === row._id ? 'Deleting...' : 'Delete Booking'}


                      </button>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-red-600 font-semibold text-lg">
              No Bookings Found
            </div>
          )}
          
                  <div className="flex justify-center items-center mt-4 space-x-2 mb-4">
                     <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || itemsPerPage === "All"}
                  className={`px-3 py-1 border rounded disabled:opacity-50
                     ${currentPage === 1 ? '':'cursor-pointer'}`}
                >
                  Prev
                    </button>
                    {itemsPerPage !== "All" &&
    Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
        } cursor-pointer`}
      >
        {i + 1}
      </button>
    ))}
                       <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || itemsPerPage === "All"}
                  className={`px-3 py-1 border rounded disabled:opacity-50 ${currentPage === totalPages ? '':'cursor-pointer'}`}
                >
                  Next
                    </button>
                  </div>
        </div>
              </div>
              <div className='flex justify-center  mb-5'>
        <button className={` px-3 py-1 border rounded bg-blue-500 text-white disabled:opacity-50 cursor-pointer`} onClick={() => {
          if (branch.length > 0 && bookings.length > 0) {
            setShowModal(true)
            
          }
          else {
            toast.error("Branch and Bookings Data required to open")
          }
        }}>
            Export Csv
          </button>
        </div>
          </>
          
        )
      }
        

      </div>
  );
};

export default BookingList;
