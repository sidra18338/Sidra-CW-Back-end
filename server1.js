const express = require('express')
// const bodyParser = require('body-parser');


// Create an Express.js instance:
const app = express();
const PORT= 3000;

// config Express.js
app.use(express.json())
app.set('port', 3000)
app.use ((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

// connect to MongoDB
let db;
MongoClient.connect(
  'mongodb+srv://sidratahir145:wednesday@cluster0.1pssr.mongodb.net/',
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.error('Failed to connect to MongoDB:', err);
      process.exit(1);
    }
    console.log('Connected to MongoDB');
    db = client.db('webstore');
  }
);


// dispaly a message for root path to show that API is working
app.get('/', (req, res, next) => {
    res.send('Select a collection, e.g., /collection/messages')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})


// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})



//adding post
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
    if (e) return next(e)
    res.send(results.ops)
    })
    })
    
    // return with object id 
    //adding get
    const ObjectID = require('mongodb').ObjectID;
    app.get('/collection/:collectionName/:id'
    , (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e)
    res.send(result)
    })
    })
    
    
    //update an object 
    //adding put
    app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
    })
    
    
    
    
    //adding delete
    app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
    { _id: ObjectID(req.params.id) },(e, result) => {
    if (e) return next(e)
    res.send((result.result.n === 1) ?
    {msg: 'success'} : {msg: 'error'})
    })
    })
    
    const port = process.env.PORT ||3000
    app.listen(port)


