const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db'); // Import your MongoDB connection file
const authRoutes = require('./routes/auth.routes');
const loggerInterceptor = require('./middlewares/logger.interceptor');
const employeeRoutes = require('./routes/employee.routes');
const documentRoutes = require('./routes/document.routes');
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200', // your frontend port
  credentials: true
}));
app.use('/uploads', express.static('uploads'));
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(loggerInterceptor);
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
