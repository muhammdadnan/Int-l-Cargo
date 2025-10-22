import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AppRoutes } from '../constants/AppRoutes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ContainerList = () => {
  const [deletingId, setDeletingId] = useState(null);
const [bookingList, setBookingList] = useState([]);

  const [containerList, setContainerList] = useState([]);
    const [containerLoading, setcontainerLoading] = useState(false);

   const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()
    useEffect(() => {
        const getContainerList = async () => {
            try {
              setcontainerLoading(true)
              const response = await axios.get(AppRoutes.allContainersList);
                setContainerList(response?.data?.data?.containersList || []);
              } catch (error) {
                console.log(error);
                // Error message dikhana behtar hoga
              }finally{
                setcontainerLoading(false)

              }
        };
        getContainerList();
    }, []);

    // --- Action Handlers (Edit/Delete ke liye) ---
    const handleEdit = (id) => {
       navigate(`/update-container/edit/${id}`);

    };
    // --- Action Handlers (Edit/Delete ke liye) ---
  const handleEditContainer = (id, containerStatus) => {
       if (containerStatus.toLowerCase() === 'shipment in container') {
         navigate(`/edit-container/edit/${id}`);
        
    }else{
      toast.error(`This Container is no more editable, Status: ${containerStatus}`)
    }
    

    };

  const handleDelete = async (id, containerStatus) => {
    // console.log(containerStatus);
    
    if (containerStatus.toLowerCase() === 'shipment in container' || containerStatus.toLowerCase() === 'delivered') {
      if (!window.confirm("Are you sure you want to delete this container?")) return;
      
  try {
    setDeletingId(id); // Set current deleting container ID
    await axios.delete(`${AppRoutes.deleteSingleContainer}/${id}`);
    
    // Filter out deleted container from list
    toast.success("Container Deleted Successfully");
    setContainerList((prevList) => prevList.filter(c => c._id !== id));
  } catch (error) {
     console.log(error);
        const err = error?.response?.data?.errors;
        // if (err?.email) setEmailErr(err.email);
        if (err?.general) toast.error(err.general);
        if (!err) toast.error('Something went wrong');
    // alert("Failed to delete container. Try again.");
  } finally {
    setDeletingId(null); // Reset after done
  }
    }
    else {
       toast.error(`This Container is no more editable, Status: ${containerStatus}`)
    }

};

// ✅ FILTERED Containers
  const filteredBookings = containerList.filter(container =>
    container.ContainerNumber?.toLowerCase().toString().includes(searchQuery.toLowerCase().trim())
  );
 // download excel file
const handleDownloadExcel = async () => {
  try {
    // 1️⃣ Get all bookings from API
    const response = await axios.get(AppRoutes.allBookings);
    const allBookings = response?.data?.data?.bookings || [];

    const excelData = [];

    // 2️⃣ Loop through all filtered containers
    filteredBookings.forEach(container => {
      let totalShipped = 0;
      if (Array.isArray(container.Invoices) && container.Invoices.length > 0) {
        container.Invoices.forEach(item => {
          const [invoiceNo, qtyFromContainer] = item.split("/"); // e.g. INV001/10
          totalShipped += parseInt(qtyFromContainer || "0");

          // 3️⃣ Try to find booking by Invoice No
          const bookingMatch = allBookings.find(
            b => b.InvoiceNo?.split("/")[0] === invoiceNo
          );

          // 4️⃣ Prefer booking pieces over container string qty
          const actualPieces = bookingMatch?.NoOfPieces || qtyFromContainer || "-";

          excelData.push({
            "Container No": container.ContainerNumber || "-",
            "From": container.Destination?.From || "-",
            "To": container.Destination?.To || "-",
            "Invoice No": invoiceNo || "-",
            // "No of Pieces": actualPieces,
           "Total Shipped": totalShipped || 0, 
            "Status": container.Status || "-"
          });
        });
      } else {
        // If no invoices in container
        excelData.push({
          "Container No": container.ContainerNumber || "-",
          "From": container.Destination?.From || "-",
          "To": container.Destination?.To || "-",
          "Invoice No": "-",
          // "No of Pieces": "-",
          "Status": container.Status || "-"
        });
      }
    });

    // 5️⃣ Create and download Excel
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Containers");

    XLSX.writeFile(workbook, "All_Containers.xlsx");

  } catch (error) {
    console.error("❌ Excel export failed:", error);
    alert("Failed to generate Excel file!");
  }
};




const handleExportInvoiceExcel = async (containerId) => {
  try {
    // 1️⃣ Get that specific container from bookingList or filteredBookings
    const dataSource =
      filteredBookings && filteredBookings.length > 0
        ? filteredBookings
        : bookingList && bookingList.length > 0
        ? bookingList
        : [];

    const selectedContainer = dataSource.find(c => c._id === containerId);

    if (!selectedContainer) {
      alert("Container not found!");
      return;
    }

    // 2️⃣ Parse invoice numbers from container
    let invoicesArray = [];
    if (typeof selectedContainer.Invoices === "string") {
      invoicesArray = selectedContainer.Invoices.split(",").map(i => i.trim());
    } else if (Array.isArray(selectedContainer.Invoices)) {
      invoicesArray = selectedContainer.Invoices;
    }

    if (invoicesArray.length === 0) {
      alert("No invoices found in this container!");
      return;
    }

    // 3️⃣ Fetch all bookings for these invoices
    const invoiceNumbers = invoicesArray.map(i => i.split("/")[0]);

    const response = await axios.get(AppRoutes.allBookings);
    const allBookings = response?.data?.data?.bookings || [];

    // 4️⃣ Filter bookings that match these invoices
    const matchingBookings = allBookings.filter(b =>
      invoiceNumbers.includes(b.InvoiceNo?.split("/")[0])
    );

    if (matchingBookings.length === 0) {
      alert("No matching bookings found for this container’s invoices!");
      return;
    }

    // 5️⃣ Prepare Excel data
    const excelData = matchingBookings.map(b => ({
      "Container No": selectedContainer.ContainerNumber || "-",
      "From": selectedContainer.Destination?.From || "-",
      "To": selectedContainer.Destination?.To || "-",
      "Sender Name": b.SenderName || "-",
      "Sender Mobile": b.SenderMobile || "-",
      "Sender Id Number": b.SenderIdNumber || "-",
      "Sender Address": b.SenderAddress || "-",
      "Sender Area": b.SenderArea || "-",
      "Receiver Name": b.ReceiverName || "-",
      "Receiver Mobile1": b.ReceiverMobile1 || "-",
      "Receiver Mobile2": b.ReceiverMobile2 || "-",
      "Receiver Address": b.ReceiverAddress || "-",
      "Receiver Area": b.ReceiverArea || "-",
      "Item Details": b.ItemDetails || "-",
      "Other Details": b.OtherDetails || "-",
      "No Of Pieces": b.NoOfPieces || "-",
      "Branch": b.Branch || "-",
      "Booking Date": b.BookingDate || "-",
      "Sub Total": b.SubTotal || "-",
      "Vat": b.Vat || "-",
      "Vat Total": b.VatTotal || "-",
      "Invoice Total": b.InvoiceTotal || "-",
      "Amount In Words": b.AmountInWords || "-",
      "Bilty No": b.BiltyNo || "-",
      "Invoice No": b.InvoiceNo || "-",
      "City": b.City || "-",
      "Total Weight": b.totalWeight || "-",
      // "Remaining Pieces": b.RemainingPieces || "-",
      "Status": b.status || "-",
      "Tracking Details": JSON.stringify(b.tracking_details || []),
      "Tracking History": JSON.stringify(b.tracking_history || []),

      // Charges breakdown (each field)
      "Freight Charges Enabled": b.Charges?.FreightCharges?.enabled ?? "-",
      "Freight Charges Unit Rate": b.Charges?.FreightCharges?.unitRate ?? "-",
      "Freight Charges Qty": b.Charges?.FreightCharges?.qty ?? "-",
      "Freight Charges Total": b.Charges?.FreightCharges?.total ?? "-",

      "Insurance Enabled": b.Charges?.Insurance?.enabled ?? "-",
      "Insurance Unit Rate": b.Charges?.Insurance?.unitRate ?? "-",
      "Insurance Qty": b.Charges?.Insurance?.qty ?? "-",
      "Insurance Total": b.Charges?.Insurance?.total ?? "-",

      "Packing Enabled": b.Charges?.Packing?.enabled ?? "-",
      "Packing Unit Rate": b.Charges?.Packing?.unitRate ?? "-",
      "Packing Qty": b.Charges?.Packing?.qty ?? "-",
      "Packing Total": b.Charges?.Packing?.total ?? "-",

      "Customs Enabled": b.Charges?.Customs?.enabled ?? "-",
      "Customs Unit Rate": b.Charges?.Customs?.unitRate ?? "-",
      "Customs Qty": b.Charges?.Customs?.qty ?? "-",
      "Customs Total": b.Charges?.Customs?.total ?? "-",

      "Clearance Enabled": b.Charges?.Clearance?.enabled ?? "-",
      "Clearance Unit Rate": b.Charges?.Clearance?.unitRate ?? "-",
      "Clearance Qty": b.Charges?.Clearance?.qty ?? "-",
      "Clearance Total": b.Charges?.Clearance?.total ?? "-",

      "Other Charges Enabled": b.Charges?.OtherCharges?.enabled ?? "-",
      "Other Charges Unit Rate": b.Charges?.OtherCharges?.unitRate ?? "-",
      "Other Charges Qty": b.Charges?.OtherCharges?.qty ?? "-",
      "Other Charges Total": b.Charges?.OtherCharges?.total ?? "-",

      "Discount Enabled": b.Charges?.Discount?.enabled ?? "-",
      "Discount Unit Rate": b.Charges?.Discount?.unitRate ?? "-",
      "Discount Qty": b.Charges?.Discount?.qty ?? "-",
      "Discount Total": b.Charges?.Discount?.total ?? "-",
    }));

    // 6️⃣ Export to Excel
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Container Invoices");

    const fileName = `Container_${selectedContainer.ContainerNumber || "Data"}.xlsx`;
    XLSX.writeFile(wb, fileName);

  } catch (error) {
    console.error("Error exporting invoice Excel:", error);
    alert("Failed to export Excel!");
  }
};












    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            {
              containerLoading ? ( <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
        Loading...
          </div>) : (
              <>
                  <h1 className="text-center text-2xl font-bold text-blue-800 px-4 pt-6 pb-2">
    All Container Details
  </h1>
  
            <div className="p-4">
                {/* ✅ Update all Button */}
<div className="px-4 mb-4 flex justify-between">
  <input
    type="text"
    placeholder="Search by Invoice No..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-1/2 px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <div className="flex gap-2">
    <button
      onClick={() => navigate('/all-container-bulk-status')}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer"
    >
      Bulk Status
    </button>
    <button
      onClick={handleDownloadExcel}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 cursor-pointer"
    >
      Download Excel
    </button>
  </div>
</div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-700 bg-white">
  <thead className="text-xl uppercase bg-gray-200 text-gray-800">
    <tr className="border-b border-gray-300">
      <th className="px-6 py-3 text-center whitespace-nowrap">S.No</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Container No</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Destination</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Invoices</th>
      {/* <th className="px-6 py-3 text-center whitespace-nowrap">No. of Pieces</th> */}
      <th className="px-6 py-3 text-center whitespace-nowrap">Total Shipped</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Status</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredBookings.length > 0 ? (
      filteredBookings.map((container, index) => {
        // --- Invoices parsing ---
        const invoiceNumbers = [];
        let totalShipped = 0;

        // if (Array.isArray(container.Invoices)) {
        //   container.Invoices.forEach(item => {
        //     const [inv, qty] = item.split('/');
        //     invoiceNumbers.push(inv);
        //     totalShipped += parseInt(qty || 0);
        //   });
          // }
          let Destination
        if (container.Destination) {
              Destination =` From: ${container.Destination.From} → To: ${container.Destination.To}`
          }
          // console.log(Destination);
          
          if (container.Invoices) {
              container.Invoices.forEach((item) => {
                  const [inv, qty] = item.split('/');
                  invoiceNumbers.push(inv);
                  totalShipped += parseInt(qty || 0);
              });
                
          }
          
        return (
          <tr key={container._id || index} className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 text-center">{index + 1}</td>
            <td className="px-6 py-4 text-center">{container.ContainerNumber || '-'}</td>
            <td className="px-6 py-4 text-center">{Destination}</td>
            <td className="px-6 py-4 text-center">{invoiceNumbers.join(', ') || '-'}</td>
            {/* <td className="px-6 py-4 text-center">{container.Invoices.join(', ')  || '-'}</td> */}
            <td className="px-6 py-4 text-center">{totalShipped}</td>
            <td className="px-6 py-4 text-center">{container.Status || '-'}</td>
            <td className="px-6 flex gap-4 py-4 text-center">
              <button
                onClick={() => handleEdit(container._id)}
                className="cursor-pointer text-blue-600 whitespace-nowrap hover:text-blue-800"
              >
                Update Status
              </button>
              <button
                onClick={() => handleEditContainer(container._id,container.Status)}
                className="cursor-pointer text-green-600 whitespace-nowrap hover:text-blue-800"
              >
                Edit Container
              </button>
              <button
  onClick={() => handleDelete(container._id,container.Status)}
  className={`cursor-pointer text-red-600 whitespace-nowrap hover:text-blue-800 ${deletingId === container._id ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={deletingId === container._id}
>
  {deletingId === container._id ? "Deleting..." : "Delete Container"}
</button>

   <button
  onClick={() => handleExportInvoiceExcel(container._id)}
                className="cursor-pointer text-blue-600 whitespace-nowrap hover:text-blue-800"
              >
  Download Invoice wise Excel
              </button>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={7} className="text-center py-8 text-red-600 font-semibold text-lg">
          No Containers Data Found
        </td>
      </tr>
    )}
  </tbody>
</table>

                </div>
            </div>
              </>
      )
            }
          
        </div>
    );
};

export default ContainerList;