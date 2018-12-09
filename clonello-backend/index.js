const express = require('express')
const mongodb = require('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express()

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors())

const dbUrl = 'mongodb://localhost:27017';
const dbName = 'app-db';
const boardsCollection = 'boards';
const boardId = 'boardId';
const countersCollection = 'counters';

let db = null

/************************
*** REST API Handlers ***
************************/
app.get('/boards', function (req, res) {
  db.collection(boardsCollection).find().toArray((err, result) => {
    if (err) {
      return console.log(err);
    }
    res.send(result)
  })
})
app.post('/boards', function (req, res) {
  const body = req.body;
  let validBody = body && body.name;
  if (body.lists && body.lists.length > 0) {
    for (let index = 0; index < body.lists.length; index ++) {
      if (!body.lists[index] || !body.lists[index].name || !body.lists[index].cards) {
        validBody = false;
        break;
      }
    }
  }
  if (!validBody) {
    res.sendStatus(400);
    return console.log('Invalid body');
  }
  try {
    getNextSequenceValue(boardId).then(value => {
      console.log(body);
      db.collection(boardsCollection).insertOne({
        _id: value,
        name: body.name,
        lists: body.lists ? body.lists : []
      }).then(result => {
        res.send(result);
      });
    });
  } catch (e) {
    res.send(e);
  }
})
app.get('/boards/:id', function (req, res) {
  const id = parseInt(req.params.id, 10);
  db.collection(boardsCollection).find({ _id: id}).toArray((err, result) => {
    if (err) {
      return console.log(err);
    }
    res.send(result)
  })
})
app.delete('/boards/:id', function (req, res) {
  const id = parseInt(req.params.id, 10);
  db.collection(boardsCollection).deleteOne(
    { _id: id},
    function (err, result) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        }
        if (result){
          res.send(result);
        }
        
    });
})
app.patch('/boards/:id', function (req, res) {
  const id = parseInt(req.params.id, 10);
  if (req && req.body && req.body.lists && req.body.name) {
    db.collection(boardsCollection).findOneAndUpdate(
      { 
        _id: id
      },
      {  $set : {
          lists: req.body.lists,
          name: req.body.name
        }
      },
      function (err, result) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.send(result);
          }
    });
  } else {
    console.log(req);
    res.sendStatus(400);
  }
})

/*************************
*** MongoDB Connection ***
*************************/
mongodb.MongoClient.connect(dbUrl, (err, client) => {
  if (err) {
    return console.log(err);
  }

  console.log('Connected to database');

  db = client.db(dbName);

  createCollection(countersCollection);
  createCollection(boardsCollection);

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
  })
})

/********************
*** MongoDB Utils ***
********************/
function createCollection(collectionName) {
  try {
    db.listCollections().toArray(function(err, items) {
      let alreadyExisting = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i] && items[i].name == collectionName) {
          alreadyExisting = true;
        }
      }
      if (!alreadyExisting) {
        db.createCollection(collectionName);
      }
    });
  } catch (err) {
    console.log(err);
  }
}
function getNextSequenceValue(sequenceName) {
  try {
    const sequenceValuePromise = new Promise((resolve) => {
      db.collection(countersCollection).findOneAndUpdate(
        {_id: sequenceName }, // filter
        { $inc: {
            sequence_value: 1
          } // update
        },
        {
          returnOriginal: false,
          upsert: true
        },
        (err, sequenceDocument) => {
          if (err) {
            throw err;
          }
          resolve(sequenceDocument.value.sequence_value);
        }
      );
    });
    return sequenceValuePromise;
  } catch (err) {
    console.log(err);
  }
}