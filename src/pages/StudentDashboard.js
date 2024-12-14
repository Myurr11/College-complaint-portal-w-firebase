import React, { useState, useEffect } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';


const StudentDashboard = ({ isSidebarCollapsed }) => {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    contactNo: '',
    profilePhoto: 'https://via.placeholder.com/150',
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const userId = auth?.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setUser({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          department: userData.department || '',
          contactNo: userData.contactNumber || '',
          profilePhoto: userData.profilePhoto || 'https://via.placeholder.com/150',
          userType: userData.userType || '',
        });
      });
    };

    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserComplaints = async () => {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const complaintsArray = [];
      querySnapshot.forEach((doc) => {
        complaintsArray.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(complaintsArray);
    };

    fetchUserComplaints();
  }, [userId]);

  const handleFeedbackClick = (complaintId) => {
    setSelectedComplaint((prev) => (prev === complaintId ? null : complaintId));
  };

  return (
    <div className={`flex-1 p-6 bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="shadow-lg rounded-lg p-6 flex flex-col items-center space-y-4 bg-white bg-opacity-90">
          <img
            src={user.profilePhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4 hover:scale-105 transition-transform"
          />
          <h2 className="text-3xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Department: {user.department}</p>
          <p className="text-gray-600">User Type: {user.userType}</p>
          <p className="text-gray-600">Contact No: {user.contactNo}</p>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Complaints</h3>
          {complaints.length > 0 ? (
            complaints.map((complaint, index) => (
              <div
                key={complaint.id}
                className={`bg-white shadow-lg rounded-lg p-4 mb-4 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-bold text-gray-800">{complaint.title}</h4>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-sm font-semibold ${
                      complaint.status === 'resolved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                    style={{
                      minWidth: '80px', // Ensures the badge has a minimum width
                      height: '30px', // Fixes the height of the badge
                      justifyContent: 'center', // Centers the text inside the badge
                      textAlign: 'center', // Ensures text is centered
                    }}
                  >
                    {complaint.status === 'resolved' ? 'Resolved' : 'Unresolved'}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{complaint.description}</p>
                <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-4">
                  <p><strong>Category:</strong> {complaint.category}</p>
                  <p><strong>Submitted On:</strong> {complaint.submittedOn}</p>
                  <p><strong>Priority:</strong> {complaint.priority}</p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleFeedbackClick(complaint.id)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {selectedComplaint === complaint.id ? 'Hide Feedback' : 'Show Feedback'}
                  </button>
                </div>
                {selectedComplaint === complaint.id && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p>
                      <strong>Feedback from Admin:</strong> 
                      {complaint.adminFeedback || 'No feedback provided yet'}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No complaints yet</p>
          )}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/makecomplaint')}
              className="bg-dark-blue text-white px-6 py-3 rounded-lg shadow-lg hover:bg-dark-blue-600 transition-colors"
            >
              Add a Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
