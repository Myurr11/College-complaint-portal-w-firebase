import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const MakeComplaint = () => {
  const [complaint, setComplaint] = useState({
    title: '',
    description: '',
    status: 'unresolved',
    submittedOn: new Date().toLocaleDateString(),
    userId: '', // To store the logged-in user's ID
  });
  const [userId, setUserId] = useState(null);

  // Track the logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        console.log('No user is logged in');
      }
    });
    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    setComplaint({ ...complaint, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('You must be logged in to submit a complaint.');
      return;
    }

    try {
      await addDoc(collection(db, 'complaints'), { ...complaint, userId });
      alert('Complaint Submitted!');
      setComplaint({
        title: '',
        description: '',
        status: 'unresolved',
        submittedOn: new Date().toLocaleDateString(),
        userId: '', // Reset to default state
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
