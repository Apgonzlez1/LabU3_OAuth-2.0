require('dotenv').config(); // Siempre al inicio

const express = require('express');
const http = require('http');
const path = require('path');
const passport = require('passport');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/api/routes/auth.routes');
const { setupWebsocket } = require('./src/infrastructure/websockets/chat.handler');
const cors = require('cors');
require('./src/config/passport-setup'); // Configura passport

const app = express(); // Primero creamos app
const server = http.createServer(app);

// 🛠️ Middleware para servir archivos estáticos (como index.html y authcallback.html)
app.use(express.static(path.join(__dirname, 'frontend')));

// 🔌 Conexión a MongoDB
connectDB();

// 📦 Middlewares
app.use(express.json());
app.use(passport.initialize());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// 📡 Rutas
app.use('/api/auth', authRoutes); // Rutas normales de registro/login
app.use('/auth', authRoutes);     // Rutas para Google OAuth (si decides dividirlas)

// 💬 WebSockets
setupWebsocket(server);

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
//

// 🧪 Verificar variables de entorno
console.log("🛠️ PORT:", process.env.PORT);
console.log("🛠️ MONGO_URI:", process.env.MONGO_URI);
console.log("🛠️ JWT_SECRET:", process.env.JWT_SECRET);
