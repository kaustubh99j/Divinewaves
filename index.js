require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DATABASE CONNECTED"))
  .catch(err => console.log("❌ DB CONNECTION ERROR:", err));

// 2. STATIONS ROUTE (DIRECT API - NO DATABASE CACHE)
app.get('/api/stations', async (req, res) => {
  try {
    // We search by name for 'radio' in India to get the biggest possible list
    const response = await axios.get('https://de1.api.radio-browser.info/json/stations/search', {
      params: {
        country: 'India',
        limit: 200,
        hidebroken: true,
        order: 'clickount',
        reverse: true
      }
    });

    // We manually filter for spiritual keywords to ensure quality
    const keywords = ['bhakti', 'devotional', 'gurbani', 'sikh', 'hindu', 'mantra', 'om', 'peace', 'spiritual', 'vividh', 'yoga', 'kirtan',
    'islamic', 'quran', 'christian', 'gospel', 'meditation', 'zen'];
    
    const divineStations = response.data
      .filter(s => keywords.some(word => s.name.toLowerCase().includes(word) || s.tags.toLowerCase().includes(word)))
      .map(s => ({
        _id: s.stationuuid,
        name: s.name.replace(/_/g, ' '),
        url: s.url_resolved || s.url,
        image: s.favicon || "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400"
      }));

    console.log(`✨ Filtering complete: Sending ${divineStations.length} matching stations.`);
    res.json(divineStations);
  } catch (error) {
    res.status(500).json({ error: "API unreachable" });
  }
});


// 3. PROXY ROUTE
app.get('/proxy-stream', async (req, res) => {
  const streamUrl = req.query.url;
  try {
    const response = await axios({ method: 'get', url: streamUrl, responseType: 'stream' });
    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);
  } catch (err) {
    res.status(500).send("Stream offline");
  }
});



const PORT = 5001; // CHANGED FROM 5000
app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`🚀 NEW SERVER STARTED ON PORT ${PORT}`);
  console.log("-----------------------------------------");
});