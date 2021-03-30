const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z7rjt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello Ema!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("ema-john").collection("products");

  app.post('/addProducts', (req, res) => {
    const product = req.body;
    productsCollection.insertMany(product)
      .then(res => {
        console.log(res.insertedCount)
        res.send(res.insertedCount)
      })
  }
  )

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, document) => {
        res.send(document)
      })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, document) => {
        res.send(document[0])
      })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    console.log(productKeys)
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((err, document) => {
        res.send(document)
      })
  })

});


app.listen(process.env.PORT || port)