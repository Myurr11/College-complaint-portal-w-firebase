import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Box, Container, Drawer, List, ListItem, ListItemText, Card, CardContent, Typography, Button, Badge, Avatar, Grid, Fab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    category: '',
    contactNo: '',
    profilePhoto: 'https://via.placeholder.com/150',
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const userId = auth?.currentUser?.uid;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
  
    const fetchUserDetails = async () => {
      const userRef = collection(db, 'users');
      const q = query(userRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        console.log("Fetched user data:", userData);  // Log to check the user data
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
      const q = query(complaintsRef, where('userId', '==', userId)); // Filter complaints by userId
      const querySnapshot = await getDocs(q);

      const complaintsArray = [];
      querySnapshot.forEach((doc) => {
        complaintsArray.push({ id: doc.id, ...doc.data() });
      });
      setComplaints(complaintsArray);
    };

    fetchUserComplaints();
  }, [userId]); // Depend on userId to fetch complaints specific to the logged-in user

  const handleFeedbackClick = (complaintId) => {
    setSelectedComplaint((prev) => (prev === complaintId ? null : complaintId));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Sidebar */}
      <Drawer
        sx={{
          width: isSidebarOpen ? 240 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? 240 : 0,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
            overflow: isSidebarOpen ? 'auto' : 'hidden',
          },
        }}
        variant="persistent"
        anchor="left"
        open={isSidebarOpen}
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

      {/* Sidebar Toggle Button */}
<Fab
  onClick={toggleSidebar}
  sx={{
    position: 'fixed',
    bottom: 16, // Move to the bottom of the screen
    left: 16,
    zIndex: 1200,
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#115293',
    },
  }}
>
  {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
</Fab>


      {/* Main Content */}
      <Container sx={{ flexGrow: 1, padding: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar src={user.profilePhoto} sx={{ width: 100, height: 100, marginBottom: 2 }} />
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
                  <Typography variant="body1">Email: {user.email}</Typography>
                  <Typography variant="body1">Department: {user.department}</Typography>
                  <Typography variant="body1">userType: {user.userType}</Typography>
                  <Typography variant="body1">Contact No: {user.contactNo}</Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Complaints List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6">Your Complaints</Typography>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <Card key={complaint.id} sx={{ marginBottom: 2, padding: 2 }}>
                  <CardContent>
  {/* Title and Status Badge for Desktop and Mobile */}
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on mobile
    marginBottom: 1,
  }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
      {complaint.title}
    </Typography>

    {/* Badge only for Desktop */}
    <Badge
      badgeContent={complaint.status === 'resolved' ? 'Resolved' : 'Unresolved'}
      color={complaint.status === 'resolved' ? 'success' : 'error'}
      sx={{ display: { xs: 'none', md: 'block' },
      marginRight: 4,
    }} // Hide on mobile
    />
  </Box>

  {/* Complaint Description */}
  <Typography variant="body2" sx={{ marginTop: 1 }}>
    {complaint.description}
  </Typography>

  {/* Category, Submitted On, and Priority for Desktop and Mobile */}
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 2,
    flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on mobile
    gap: 1,
  }}>
    <Typography variant="body2"><strong>Category:</strong> {complaint.category}</Typography>
    <Typography variant="body2"><strong>Submitted On:</strong> {complaint.submittedOn}</Typography>
    <Typography variant="body2"><strong>Priority:</strong> {complaint.priority}</Typography>
  </Box>

  {/* Feedback Button and Status Badge for Mobile */}
  <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    flexDirection: { xs: 'row', md: 'row' },
    marginTop: 2,
    width: '100%', // Ensure it takes full width on mobile
    maxWidth: '100%', // Ensure it doesn't stretch beyond screen width
  }}>
    <Button
      variant="outlined"
      sx={{ width: 'auto', flexShrink: 0 }} // Ensure the button doesn't grow too big
      onClick={() => handleFeedbackClick(complaint.id)}
    >
      {selectedComplaint === complaint.id ? 'Hide Feedback' : 'Show Feedback'}
    </Button>

    {/* Status Badge for Mobile (inside the feedback container) */}
    <Badge
      badgeContent={complaint.status === 'resolved' ? 'Resolved' : 'Unresolved'}
      color={complaint.status === 'resolved' ? 'success' : 'error'}
      sx={{
        display: { xs: 'inline-block', md: 'none' }, // Show on mobile
        marginLeft: 1,
        marginRight: 4, // Ensure the badge isn't too close to the button
        maxWidth: '40%', // Limit the width on mobile to prevent overflow
      }}
    />
  </Box>

  {/* Feedback from Admin (visible when feedback button is clicked) */}
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
              <Typography>No complaints yet</Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
