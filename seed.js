require('dotenv').config();
const mongoose = require('mongoose');
const Station = require('./models/Station');
const Blog = require('./models/Blog');

const stations = [
  { name: "Vividh Bhakti", url: "https://stream.zeno.fm/f9u3v3n7z0huv", tags: "Bhajans, Hindi", image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400" },
  { name: "Golden Temple Live", url: "http://live.sgpc.net:8080/;", tags: "Gurbani, Kirtan", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400" },
  { name: "Sai Baba Radio", url: "https://stream.zeno.fm/062v66atv0huv", tags: "Sai Bhajans", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400" },
  { name: "Radio City Smaran", url: "https://vcl1.node.org.in/vcl1/sh01/radiocity/radiocity/smaran.mp3", tags: "Bhakti, Hindi", image: "https://images.unsplash.com/photo-1590050752117-23a9d7fc2173?w=400" },
  { name: "Hanuman Chalisa", url: "https://stream.zeno.fm/6v0mghatv0huv", tags: "Hanuman, Mantras", image: "https://images.unsplash.com/photo-1614030424754-24d1fbf48f21?w=400" },
  { name: "Gurbani Kirtan", url: "https://stream.zeno.fm/0v1y20n7z0huv", tags: "Gurbani, Punjabi", image: "https://images.unsplash.com/photo-1632766344238-66236df766b1?w=400" },
  { name: "ISKCON Vrindavan", url: "https://stream.zeno.fm/4m2p4t7z0huv", tags: "Krishna, Kirtan", image: "https://images.unsplash.com/photo-1597655650521-cf2847585fbc?w=400" },
  { name: "Om Namah Shivaya", url: "https://stream.zeno.fm/f9u3v3n7z0huv", tags: "Shiva, Chants", image: "https://images.unsplash.com/photo-1616012480717-fd9867059ca0?w=400" },
  { name: "Vedic Chants", url: "https://stream.zeno.fm/u2y20n7z0huv", tags: "Sanskrit, Vedas", image: "https://images.unsplash.com/photo-1609137144814-7f154943f652?w=400" },
  { name: "Peaceful Flute", url: "https://stream.zeno.fm/1f8mghatv0huv", tags: "Meditation, Instrumental", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400" }
];

async function seedDB() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. DELETE EVERYTHING FIRST
    console.log("Wiping old data...");
    await Station.deleteMany({});
    
    // 2. INSERT ONE BY ONE TO CATCH ERRORS
    console.log(`Starting insertion of ${stations.length} stations...`);
    for (const s of stations) {
        await Station.create(s);
        console.log(`Successfully added: ${s.name}`);
    }

    console.log("✅ SEEDING COMPLETE! Total stations in DB: " + (await Station.countDocuments()));
    process.exit();
  } catch (err) {
    console.error("❌ SEEDING FAILED:", err);
    process.exit(1);
  }
}

seedDB();