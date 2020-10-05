const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3k5mk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;





const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const events = client.db("volunteerWorld").collection("event");
  const newVolunteer = client.db("volunteerWorld").collection("volunteer");
    app.post('/addEvent', (req, res) => {
        const event = req.body;
        events.insertOne(event)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/events', (req, res) => {
        events.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addVolunteer', (req, res) => {
        const volunteer = req.body;
        newVolunteer.insertOne(volunteer)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/loadEvent', (req, res) => {
        
        newVolunteer.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
        console.log(req.params.id);
    })
    
});



//for server run check
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port)