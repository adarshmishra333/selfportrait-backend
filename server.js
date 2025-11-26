require("dotenv").config();

const express = require('express');
const cors = require('cors');
const conversationRoute = require('./routes/conversation');
const todayRoute = require('./routes/today');
const pastRoute = require('./routes/past');
const historyRoute = require('./routes/history');
const profileRoute = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SelfPortrait API is running' });
});

app.use('/conversation', conversationRoute);
app.use('/today', todayRoute);
app.use('/past', pastRoute);
app.use('/history', historyRoute);
app.use('/profile', profileRoute);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
