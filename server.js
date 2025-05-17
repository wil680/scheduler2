const express = require('express');
const { get } = require('http');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

// Allow your HTML, CSS, JS files to be served

app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));



let data = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: []
};  // In-memory "database" for now

app.post('/submit', (req, res) => {
    console.log("FULL REQUEST BODY:", req.body); // Add this line to debug

    const { comment, day} = req.body; // Destructure comment and day from the request body]
    if (data[day]) {
        data[day].push(comment); // Push the comment to the appropriate day
        console.log(`Comment for ${day}:`);
        res.send(`Saved for ${day}`);
    } else {
        console.log(`Invalid day: ${day}`);
        res.status(400).send('Invalid day');
    }
});

app.get('/data', (req, res) => {
    res.json(data);
});


app.post('/clear', (req, res) => {
  for (let day in data) {
    data[day] = [];
  }
  console.log("All comments cleared");
  res.send("All comments cleared");
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

