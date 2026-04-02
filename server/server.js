const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Smart Job Tracker API is running' });
});

app.use('/api/jobs', jobRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
