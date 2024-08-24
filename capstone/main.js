const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;// Middleware to parse JSON bodies
app.use(express.json());// Environment variables or hardcoded values for API base URLs
const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key// Routes for reservations
app.get('/OTA_HotelResNotif', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/OTA_HotelResNotif`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});app.post('/reservations', async (req, res) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/reservations`, req.body, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});app.get('/OTA_HotelResModifyNotif', async (req, res) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/OTA_HotelResModifyNotif`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});app.post('/OTA_HotelResModifyNotif', async (req, res) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/OTA_HotelResModifyNotif`, req.body, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.message);
    }
});// Acknowledge actions are not supported
app.post('/OTA_HotelResNotif/acknowledge', (req, res) => {
    res.status(405).send('Acknowledge action is not supported.');
});app.post('/OTA_HotelResModifyNotif/acknowledge', (req, res) => {
    res.status(405).send('Acknowledge action is not supported.');
});// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});