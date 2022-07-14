const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const tariffsRouter = require('./routes/tariffs-router');

const app = express();

const apiPort = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());


app.use('/api', tariffsRouter); 

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
      console.log(r.route.path)
    }
  })
  
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));