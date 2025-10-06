import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AppRoutes } from '../constants/AppRoutes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ContainerList = () => {
  const [deletingId, setDeletingId] = useState(null);

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
        <button
          onClick={() => navigate('/all-container-bulk-status')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer"
        >
           Bulk Status
        </button>
      </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-700 bg-white">
  <thead className="text-xl uppercase bg-gray-200 text-gray-800">
    <tr className="border-b border-gray-300">
      <th className="px-6 py-3 text-center whitespace-nowrap">S.No</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Container No</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Destination</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Invoices</th>
      <th className="px-6 py-3 text-center whitespace-nowrap">Shipped</th>
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