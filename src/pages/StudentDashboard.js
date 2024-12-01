import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Make sure Firebase is set up
import { collection, getDocs } from 'firebase/firestore';
import { Box, Container, Drawer, List, ListItem, ListItemText, Card, CardContent, Typography } from '@mui/material';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    department: 'BCA',
  });

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
      <Container>
        {/* Profile Card */}
        <Card sx={{ marginTop: 4 }}>
          <CardContent>
            <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">Department: {user.department}</Typography>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6">Your Complaints</Typography>
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <Card key={complaint.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">{complaint.title}</Typography>
                  <Typography variant="body2">{complaint.description}</Typography>
                  <Typography variant="body2" color={complaint.status === 'resolved' ? 'green' : 'red'}>
                    Status: {complaint.status}
                  </Typography>
                  <Typography variant="body2">Submitted On: {complaint.submittedOn}</Typography>
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
