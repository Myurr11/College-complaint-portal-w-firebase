import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Firebase setup
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Container, Typography, Button, Card, CardContent, Grid, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  // Fetch complaints from Firestore
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

  // Filter complaints based on search query and status
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

  // Mark complaint as resolved/unresolved
  const handleToggleStatus = async (id, currentStatus) => {
    const complaintRef = doc(db, "complaints", id);
    await updateDoc(complaintRef, {
      status: currentStatus === "resolved" ? "unresolved" : "resolved",
    });
    
    toast.success(`Complaint status updated to ${currentStatus === "resolved" ? "Unresolved" : "Resolved"}`);

    // Re-fetch complaints to update the status in UI
    const querySnapshot = await getDocs(collection(db, "complaints"));
    const complaintsList = [];
    querySnapshot.forEach((doc) => {
      complaintsList.push({ id: doc.id, ...doc.data() });
    });
    setComplaints(complaintsList);
    setFilteredComplaints(complaintsList); // Update filtered complaints list
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {/* Search and Filter */}
      <div>
        <TextField
          label="Search Complaints"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="unresolved">Unresolved</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </div>

      <Grid container spacing={3}>
        {filteredComplaints.map((complaint) => (
          <Grid item xs={12} sm={6} md={4} key={complaint.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{complaint.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Submitted on: {complaint.submittedOn}
                </Typography>
                <Typography variant="body1" paragraph>
                  {complaint.description}
                </Typography>
                <Typography variant="body2" color={complaint.status === "resolved" ? "green" : "red"}>
                  Status: {complaint.status}
                </Typography>
                <Button
                  variant="contained"
                  color={complaint.status === "resolved" ? "warning" : "success"}
                  onClick={() => handleToggleStatus(complaint.id, complaint.status)}
                >
                  Mark as {complaint.status === "resolved" ? "Unresolved" : "Resolved"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
