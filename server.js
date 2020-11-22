const express = require("express")
const app = express()
const PORT = 3000
const MongoClient = require('mongodb').MongoClient
const connectionString = "mongodb+srv://admin1234:admin1234@cluster0.w9bef.mongodb.net/star-wars-quotes?retryWrites=true&w=majority"


MongoClient.connect(connectionString, {
    useUnifiedTopology: true
  })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')


    //Parsing
    app.use(express.static("public"));
    app.use(express.urlencoded({
      extended: true
    }));
    app.use(express.json());

    app.use(express.static('public'))

    //GET request
    app.get("/", (req, res) => {
      db.collection('quotes').find().toArray()
        .then(results => {
          res.render('index.ejs', {
            quotes: results
          })
        })

    })

    //POST requestc
    app.post('/quotes', (req, res) => {
      quotesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })


    app.put('/quotes', (req, res) => {
      quotesCollection.findOneAndUpdate({
          name: 'Yoda'
        }, {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        }, {
          upsert: true
        })
        .then(result => {
          res.json('Success')
        })
        .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) => {
      quotesCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vadar's quote`)
        })
        .catch(error => console.error(error))
    })


    app.listen(3000, () => {
      console.log(`Listening on port ${PORT}`)
    })

  })
