import React, { useState, useEffect } from 'react';
import '../index.css';
import { db } from '../firebase'; // Firebase setup
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Pie } from 'react-chartjs-2'; // Graphical chart library
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [admin, setAdmin] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    profilePhoto: 'https://via.placeholder.com/150',
  });
  const [feedback, setFeedback] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const complaintsList = [];
      querySnapshot.forEach((doc) => {
        complaintsList.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(complaintsList);
      setFilteredComplaints(complaintsList);
    };

    fetchComplaints();
  }, []);

  const handleSearch = () => {
    let filtered = complaints;
    if (searchQuery) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(complaint => complaint.status === filterStatus);
    }

    setFilteredComplaints(filtered);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const complaintRef = doc(db, "complaints", id);
    await updateDoc(complaintRef, {
      status: currentStatus === "resolved" ? "unresolved" : "resolved",
    });

    toast.success(`Complaint status updated to ${currentStatus === "resolved" ? "Unresolved" : "Resolved"}`);

    const querySnapshot = await getDocs(collection(db, "complaints"));
    const complaintsList = [];
    querySnapshot.forEach((doc) => {
      complaintsList.push({ id: doc.id, ...doc.data() });
    });
    setComplaints(complaintsList);
    setFilteredComplaints(complaintsList);
  };

  const handleAddFeedback = async (id) => {
    if (!feedback) {
      toast.error("Please provide feedback!");
      return;
    }

    const complaintRef = doc(db, "complaints", id);
    await updateDoc(complaintRef, {
      feedback: feedback,
    });

    toast.success("Feedback added successfully!");

    const querySnapshot = await getDocs(collection(db, "complaints"));
    const complaintsList = [];
    querySnapshot.forEach((doc) => {
      complaintsList.push({ id: doc.id, ...doc.data() });
    });
    setComplaints(complaintsList);
    setFilteredComplaints(complaintsList);
  };

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((complaint) => complaint.status === "resolved").length;
  const unresolvedComplaints = complaints.filter((complaint) => complaint.status === "unresolved").length;

  const chartDataStatus = {
    labels: ['Resolved', 'Unresolved'],
    datasets: [
      {
        data: [resolvedComplaints, unresolvedComplaints],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const chartDataRole = {
    labels: ['Student', 'Faculty', 'Staff', 'Other'],
    datasets: [
      {
        data: [5, 10, 3, 2],
        backgroundColor: ['#FFB830', '#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FFB830', '#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center mt-4 sm:mt-0">
            <img
              src={admin.profilePhoto}
              alt="Admin Profile"
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <div className="ml-4">
              <h2 className="font-semibold text-lg">{`${admin.firstName} ${admin.lastName}`}</h2>
              <p className="text-gray-500 text-sm">{admin.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Complaint Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow">
            <h4 className="text-sm text-gray-600">Total Complaints</h4>
            <p className="text-lg font-bold">{totalComplaints}</p>
          </div>
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow">
            <h4 className="text-sm text-gray-600">Resolved Complaints</h4>
            <p className="text-lg font-bold">{resolvedComplaints}</p>
          </div>
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow">
            <h4 className="text-sm text-gray-600">Unresolved Complaints</h4>
            <p className="text-lg font-bold">{unresolvedComplaints}</p>
          </div>
        </div>
      </div>

      {/* Filters and Pie Chart Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Filter Section */}
        <div className="p-4 bg-blue-50 border-2 border-blue-500 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Complaint Filters</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <input
                type="text"
                placeholder="Search Complaints"
                className="w-full p-2 border rounded mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="w-full p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="resolved">Resolved</option>
                <option value="unresolved">Unresolved</option>
              </select>
              <button
                onClick={handleSearch}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Reports & Analytics</h3>
          <div className="flex flex-wrap justify-between">
            <div className="w-full sm:w-1/2 p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Complaint Status</h4>
              <Pie data={chartDataStatus} />
            </div>
            <div className="w-full sm:w-1/2 p-4 bg-gray-50 rounded-lg shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Role Distribution</h4>
              <Pie data={chartDataRole} />
            </div>
          </div>
        </div>
      </div>

{/* Complaints Section */}
<div className="bg-white p-6 rounded-lg shadow-lg">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-gray-800">Complaints</h2>
    <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm sm:text-base">
      Show Suggestions
    </button>
  </div>

  <div className="space-y-6">
    {filteredComplaints.map((complaint) => (
      <div
        key={complaint.id}
        className="p-6 bg-gray-50 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-lg font-bold">{complaint.title}</h4>
          <span
            className={`px-2 py-1 rounded text-sm font-semibold ${
              complaint.status === "resolved"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {complaint.status === "resolved" ? "Resolved" : "Unresolved"}
          </span>
        </div>
        <p className="text-sm mb-4">{complaint.description}</p>
        <textarea
          placeholder="Add Feedback"
          className="w-full p-2 border rounded mb-4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <button
            onClick={() => handleAddFeedback(complaint.id)}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4 sm:mb-0 hover:bg-blue-600"
          >
            Submit Feedback
          </button>
          <button
            onClick={() => handleToggleStatus(complaint.id, complaint.status)}
            className={`py-2 px-4 rounded mb-4 sm:mb-0 ${
              complaint.status === "resolved"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {complaint.status === "resolved" ? "Mark as Unresolved" : "Mark as Resolved"}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;
