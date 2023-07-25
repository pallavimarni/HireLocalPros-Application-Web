// ServiceProviderAppointments.js
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Grid, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  appointmentCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(12),
    },
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  appointmentHeading: {
    marginBottom: theme.spacing(4),
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    fontSize: '3rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.5rem',
    },
  },
  appointmentList: {
    width: '100%',
    maxWidth: 600,
    marginTop: theme.spacing(2),
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiListItem-root': {
      borderBottom: '1px solid #ccc',
      '&:last-child': {
        borderBottom: 'none',
      },
    },
  },
  appointmentItem: {
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  appointmentStatusConfirmed: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  appointmentStatusCancelled: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  confirmButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#b71c1c',
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  confirmButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
  cancelButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#b71c1c',
    },
  },

}));

const ServiceProviderAppointments = () => {
    const classes = useStyles();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    // Use the service provider ID from the URL parameter
    const { serviceProviderId } = useParams();
  
    useEffect(() => {
      console.log('Service Provider ID:', serviceProviderId);
      fetchAppointments();
    }, [serviceProviderId]);
  
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError('');
  
        // Use the correct base URL for your backend API
        const baseURL = 'http://localhost:8000';
        const response = await axios.get(`${baseURL}/getServiceProviderAppointments/${serviceProviderId}`);
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching appointments. Please try again later.');
        setLoading(false);
        console.error('Error fetching appointments:', error);
      }
    };
  
    const handleConfirmAppointment = async (appointmentId) => {
        try {
          const baseURL = 'http://localhost:8000';
          await axios.post(`${baseURL}/updateAppointmentStatus/${appointmentId}`, { status: 'confirm' }); // Change 'confirm' to 'approve'
          fetchAppointments(); // Refresh the appointments after updating status
        } catch (error) {
          setError('Error confirming appointment. Please try again later.');
          console.error('Error confirming appointment:', error);
        }
      };
  
    const handleCancelAppointment = async (appointmentId) => {
      try {
        const baseURL = 'http://localhost:8000';
        await axios.post(`${baseURL}/updateAppointmentStatus/${appointmentId}`, { status: 'cancel' });
        fetchAppointments(); // Refresh the appointments after updating status
      } catch (error) {
        setError('Error cancelling appointment. Please try again later.');
        console.error('Error cancelling appointment:', error);
      }
    };
  
    return (
        <Card className={classes.appointmentCard}>
          <CardContent>
            <Typography variant="h2" className={classes.appointmentHeading}>
              <span role="img" aria-label="Calendar Icon">🗓️</span> Your Appointments
            </Typography>
            {loading ? (
              <Typography variant="body1">Loading...</Typography>
            ) : error ? (
              <Typography variant="body1">{error}</Typography>
            ) : appointments.length === 0 ? (
              <Typography variant="body1">You have no appointments scheduled.</Typography>
            ) : (
              <List className={classes.appointmentList}>
                {appointments.map((appointment) => (
                  <ListItem key={appointment._id} className={classes.appointmentItem}>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                      <Grid item xs={12} md={6}>
                        <ListItemText
                          primary={`Date: ${appointment.appointmentDate}, Time: ${appointment.appointmentTime}`}
                          secondary={
                            <span className={
                              appointment.appointmentStatus === 'confirmed'
                                ? classes.appointmentStatusConfirmed
                                : classes.appointmentStatusCancelled
                            }>
                              Status: {appointment.appointmentStatus}
                            </span>
                          }
                        />
                        {/* Show appointment details */}
                        <ListItemText
                          primary={`Appointment ID: ${appointment._id}`}
                          secondary={`Client Name: ${appointment.clientName}, Service: ${appointment.service}`}
                        />
                      </Grid>
                      {appointment.appointmentStatus === 'scheduled' && (
                        <Grid item xs={12} md={6} className={classes.buttonContainer}>
                          <Button
                            variant="contained"
                            className={classes.confirmButton}
                            onClick={() => handleConfirmAppointment(appointment._id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="contained"
                            className={classes.cancelButton}
                            onClick={() => handleCancelAppointment(appointment._id)}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      );
    };
    
    export default ServiceProviderAppointments;