import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const MakeComplaint = () => {
  const { currentUser } = useAuth(); // Access current user from context
  const userId = currentUser ? currentUser.uid : null; // Get the user's UID

  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    status: 'unresolved',
    submittedOn: new Date().toLocaleDateString(),
    userId: userId, // Add userId to complaint
  });

  const handleChange = (e) => {
    setComplaint({ ...complaint, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('You must be logged in to make a complaint');
      return;
    }

    try {
      // Add complaint with userId
      await addDoc(collection(db, 'complaints'), complaint);
      alert('Complaint Submitted!');
      setComplaint({
        title: '',
        description: '',
        status: 'unresolved',
        submittedOn: new Date().toLocaleDateString(),
        userId: userId, // Retain the userId
      });
    } catch (error) {
      alert('Error submitting complaint');
    }
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h6">Make a Complaint</Typography>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            name="title"
            value={complaint.title}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            name="description"
            value={complaint.description}
            onChange={handleChange}
          />
          <Button onClick={handleSubmit} variant="contained" sx={{ marginTop: 2 }}>
            Submit Complaint
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MakeComplaint;
