import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase'; // Make sure Firebase is set up
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Box, Container, Drawer, List, ListItem, ListItemText, Card, CardContent, Typography, Button, Badge, Avatar } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth'; // To track auth state

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    category: '',
    contactNo: '',
    profilePhoto: 'https://via.placeholder.com/150', // Default photo if none exists
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [userId, setUserId] = useState(null);

  // Track the user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid); // Set userId when user is logged in
      } else {
        // Handle user not logged in (e.g., redirect to login page)
        console.log('No user is logged in');
      }
    });

    return unsubscribe; // Cleanup listener when the component is unmounted
  }, []);

  // Fetch user details from Firestore
  useEffect(() => {
    if (!userId) return; // Only fetch if userId is available

    const fetchUserDetails = async () => {
      const userRef = collection(db, "users");
      const q = query(userRef, where("userId", "==", userId)); // Assuming userId is stored in Firestore for each user
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setUser({
          ...doc.data(),
          profilePhoto: doc.data().profilePhoto || 'https://via.placeholder.com/150', // Default photo if none exists
        });
      });
    };

    fetchUserDetails();
  }, [userId]);

  // Fetch complaints from Firestore
  useEffect(() => {
    const fetchComplaints = async () => {
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const complaintsArray = [];
      querySnapshot.forEach((doc) => {
        complaintsArray.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(complaintsArray);
    };

    fetchComplaints();
  }, []);

  const handleFeedbackClick = (complaintId) => {
    setSelectedComplaint((prev) => (prev === complaintId ? null : complaintId));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          <ListItem button component={Link} to="/studentdashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/makecomplaint">
            <ListItemText primary="Make Complaint" />
          </ListItem>
          <ListItem button component={Link} to="/makesuggestion">
            <ListItemText primary="Make Suggestion" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Container sx={{ display: 'flex', flexDirection: 'row', paddingLeft: 2, paddingRight: 2 }}>
        {/* Profile Card */}
        <Box sx={{ flex: '0 0 250px', marginRight: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={user.profilePhoto} sx={{ width: 100, height: 100, marginTop: 4 }} />
          <Card sx={{ marginTop: 2, width: '100%' }}>
            <CardContent>
              <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
              <Typography variant="body1">Email: {user.email}</Typography>
              <Typography variant="body1">Department: {user.department}</Typography>
              <Typography variant="body1">Category: {user.category}</Typography>
              <Typography variant="body1">Contact No: {user.contactNo}</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Complaints List */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ marginTop: 4 }}>Your Complaints</Typography>
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <Card key={complaint.id} sx={{ marginBottom: 2, padding: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{complaint.title}</Typography>
                    <Badge
                      badgeContent={complaint.status === 'resolved' ? 'Resolved' : 'Unresolved'}
                      color={complaint.status === 'resolved' ? 'success' : 'error'}
                      sx={{
                        textTransform: 'capitalize',
                        borderRadius: '4px', // Reduced rounding
                        padding: '0.2em 0.6em', // Adjusted padding for better positioning
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ marginTop: 2 }}>{complaint.description}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Typography variant="body2"><strong>Category:</strong> {complaint.category}</Typography>
                    <Typography variant="body2"><strong>Submitted On:</strong> {complaint.submittedOn}</Typography>
                    <Typography variant="body2"><strong>Priority:</strong> {complaint.priority}</Typography>
                  </Box>
                  
                  {/* Show Feedback Button */}
                  <Button 
                    variant="outlined" 
                    sx={{ marginTop: 2 }}
                    onClick={() => handleFeedbackClick(complaint.id)}
                  >
                    {selectedComplaint === complaint.id ? 'Hide Feedback' : 'Show Feedback'}
                  </Button>

                  {/* Display feedback for selected complaint */}
                  {selectedComplaint === complaint.id && (
                    <Box sx={{ marginTop: 2 }}>
                      <Typography variant="body2"><strong>Feedback from Admin:</strong></Typography>
                      <Typography variant="body2">{complaint.adminFeedback || 'No feedback provided yet'}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1">No complaints yet</Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
