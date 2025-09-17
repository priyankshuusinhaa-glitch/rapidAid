require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');
const seedAdminUser = require('./src/utils/seedAdmin');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Real-time ambulance tracking
io.on('connection', (socket) => {
  // Driver joins a room per ambulanceId
  socket.on('driver:join', ({ ambulanceId }) => {
    if (!ambulanceId) return;
    socket.join(`ambulance:${ambulanceId}`);
  });

  // Driver updates current location
  socket.on('driver:location', async ({ ambulanceId, coords }) => {
    try {
      if (!ambulanceId || !coords || !Array.isArray(coords) || coords.length !== 2) return;
      // Persist to DB
      const Ambulance = require('./src/models/Ambulance');
      await Ambulance.findByIdAndUpdate(ambulanceId, {
        currentLocation: { type: 'Point', coordinates: coords }
      });
      // Broadcast to riders subscribed to this ambulance
      io.to(`ambulance:${ambulanceId}`).emit('ambulance:location', { ambulanceId, coords });
    } catch (e) {
      // ignore
    }
  });

  socket.on('subscribe:ambulance', ({ ambulanceId }) => {
    if (!ambulanceId) return;
    socket.join(`ambulance:${ambulanceId}`);
  });

  socket.on('unsubscribe:ambulance', ({ ambulanceId }) => {
    if (!ambulanceId) return;
    socket.leave(`ambulance:${ambulanceId}`);
  });
});

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await seedAdminUser();
    console.log('Admin Continue');
  } catch (e) {
    console.log('Admin seeding skipped/failed:', e?.message || e);
  }
});
