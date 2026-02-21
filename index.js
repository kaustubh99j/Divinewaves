require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();

// CORS must be enabled for your Netlify URL to talk to this server
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log("✅ DATABASE CONNECTED"))
      .catch(err => console.log("❌ DB CONNECTION ERROR:", err));
}

// 2. STATIONS ROUTE
app.get('/api/stations', async (req, res) => {
  try {
    const response = await axios.get('https://de1.api.radio-browser.info/json/stations/search', {
      params: {
        country: 'India',
        limit: 200,
        hidebroken: true,
        order: 'clickcount', 
        reverse: true
      }
    });

    const keywords = ['bhakti', 'devotional', 'gurbani', 'sikh', 'hindu', 'mantra', 'om', 'peace', 'spiritual', 'vividh', 'yoga', 'kirtan', 'islamic', 'quran', 'christian', 'gospel', 'meditation', 'zen'];
    
    const divineStations = response.data
      .filter(s => keywords.some(word => s.name.toLowerCase().includes(word) || s.tags.toLowerCase().includes(word)))
      .map(s => ({
        _id: s.stationuuid,
        name: s.name.replace(/_/g, ' '),
        url: s.url_resolved || s.url,
        image: s.favicon || "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400"
      }));

    console.log(`✨ Sending ${divineStations.length} matching stations.`);
    res.json(divineStations);
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({ error: "API unreachable" });
  }
});

// 3. PROXY ROUTE
app.get('/proxy-stream', async (req, res) => {
  const streamUrl = req.query.url;
  if (!streamUrl) return res.status(400).send("No URL provided");
  
  try {
    const response = await axios({ method: 'get', url: streamUrl, responseType: 'stream' });
    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
  } catch (err) {
    res.status(500).send("Stream offline");
  }
});

// 4. DYNAMIC PORT (Crucial for Render/Deployment)
const PORT = process.env.PORT || 5001; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});