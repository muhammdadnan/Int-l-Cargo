import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ Added useNavigate
import axios from 'axios';
import Header from '../components/Header';
import { AppRoutes } from '../constants/AppRoutes';
import { toast } from 'react-toastify';

const AdminPannelAction = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Initialize navigate
  const actionType = location.state?.actionType;
  const [data, setData] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [formValue, setFormValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (actionType === 'branchAction') {
      fetchBranches();
    } else if (actionType === 'cityAction') {
      fetchCities();
    }
     else if (actionType === 'userAction') {
      fetchUsers();
    }
  }, [actionType]);

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = sessionStorage.getItem('token');
      const response = await axios.get(AppRoutes.allUsers, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response);
      setData(response.data?.data?.users || []);
      
      
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err.general);
      else toast.error('Something went wrong');
    }
    finally{

      setLoading(false)
    }
  };
  const fetchBranches = async () => {
    try {
      setLoading(true)
      const res = await axios.get(AppRoutes.allBranch);
      setData(res.data?.data?.allBranches || []);
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err.general);
      else toast.error('Something went wrong');
    }finally{
      setLoading(false)
    }
  };

  const fetchCities = async () => {
    try {
      setLoading(true)
      const res = await axios.get(AppRoutes.allCity);
      setData(res.data?.data?.allCities || []);
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err.general);
      else toast.error('Something went wrong');
    }finally{
      setLoading(false)
    }
  };

  const handleEditContainer = (item) => {
    setEditItem(item);
    setFormValue(actionType === 'branchAction' ? item.branch : item.city);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      if (actionType === 'branchAction') {
        await axios.post(`${AppRoutes.editBranch}/${editItem._id}`, {
          branch: { BranchName: formValue },
        });
        toast.success('Branch updated');
        fetchBranches();
      } else {
        await axios.post(`${AppRoutes.editCity}/${editItem._id}`, {
          city: { CityName: formValue },
        });
        toast.success('City updated');
        fetchCities();
      }
      setIsModalOpen(false);
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.BranchName) toast.error(err.BranchName);
      if (err?.CityName) toast.error(err.CityName);
      if (err?.general) toast.error(err.general);
      if (!err) toast.error('Update failed');
    }
  };

  const handleDeleteContainer = async (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${actionType === 'branchAction' ? 'branch' : actionType === 'userAction' ? 'user' :  'city'}?`
    );
    if (!confirmDelete) return;

    try {
      if (actionType === 'branchAction') {
        await axios.delete(`${AppRoutes.deleteBranch}/${id}`);
        toast.success('Branch deleted successfully');
        fetchBranches();
      } 
      else if (actionType === 'userAction') {
        try {
          const token = sessionStorage.getItem('token');
          await axios.delete(`${AppRoutes.deleteUser}/${id}`,{
            headers: {
            Authorization: `Bearer ${token}`
          }
          });
          toast.success('User deleted successfully');
          fetchUsers();
          
        } catch (error) {
          const err = error?.response?.data?.errors;
          if (err?.general) toast.error(err.general);
          else toast.error('Something went wrong');
        }  
      } 
      
      else {
        await axios.delete(`${AppRoutes.deleteCity}/${id}`);
        toast.success('City deleted successfully');
        fetchCities();
      }
    } catch (error) {
      const err = error?.response?.data?.errors;
      if (err?.general) toast.error(err.general);
      else toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50 text-purple-600 text-xl">
        Loading...
          </div>
  }
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <h1 className="text-center text-2xl font-bold text-blue-800 px-4 pt-6 pb-2">
        {actionType === 'branchAction' ? 'All Branches' : actionType === 'userAction' ? 'All Users' : 'All Cities'}
      </h1>

      {/* ✅ Back Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate('/admin-pannel')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          ← Back
        </button>
      </div>

      <div className="p-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-700 bg-white">
            <thead className="text-xl uppercase bg-gray-200 text-gray-800">
              <tr className="border-b border-gray-300">
                <th className="px-6 py-3 text-center whitespace-nowrap">S.No</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">
                  {actionType === 'branchAction' ? 'Branch' : actionType === 'userAction' ? 'Email' : 'City'}
                </th>
                <th className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((d, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 text-center">
                      {actionType === 'branchAction' ? d.branch : actionType === 'userAction' ? d.email : d.city}
                    </td>
                    <td className="px-6 flex gap-4 py-4 text-center">
                      {
                        actionType !== 'userAction' &&(
                          <button
                        onClick={() => handleEditContainer(d)}
                        className="cursor-pointer text-green-600 hover:text-blue-800"
                      >
                        Edit
                      </button>

                        )
                      }
                                            <button
                        onClick={() => handleDeleteContainer(d._id)}
                        className="cursor-pointer text-red-600 hover:text-blue-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-red-600 font-semibold text-lg">
                    {actionType === 'branchAction' ? 'No Branches Found' : 'No Cities Found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md relative">
            <button
              className="absolute top-2 right-3 text-gray-700 text-xl cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center cursor-pointer">
              {actionType === 'branchAction' ? 'Update Branch' : 'Update City'}
            </h2>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder={`Enter ${actionType === 'branchAction' ? 'Branch' : 'City'} Name`}
            />
            <button
              onClick={handleUpdate}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
              {actionType === 'branchAction' ? 'Update Branch' : 'Update City'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPannelAction;
