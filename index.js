const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();



const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xkmwi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run (){
    try{
        await client.connect();
        const database = client.db('online_Toue');
        const productCollection = database.collection('products');
        const userCollection = database.collection('user');

        //Get products Api
        app.get('/products', async(req, res) =>{

            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });


        app.post('/products', async(req, res) =>{

            const product = req.body;
            console.log('hit the post api', product);

            const result = await productCollection.insertOne(product);
            console.log(result);


            res.json(result)

        });

        // user post api
        app.post('/user', async(req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);

            // console.log('got new user', req.body);
            // console.log('added user', result);

            res.json(result);


        });

        // user get api
        app.get('/user', async(req, res) => {
            const cursor = userCollection.find({});
            const user = await cursor.toArray();
            res.send(user);
        });

        // Updete user api
        app.get('/user/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await userCollection.findOne(query);
            console.log('load user with :id', id);
            res.send(user);
        })

        // user Delete api
        app.delete('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            console.log('deleting user', result);

            res.json(result);
        })


        //Get Single Service
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            console.log('gattin service', id);
            const query = {_1d: ObjectId(id)};
            const service = await productCollection.findOne(query);
            res.json(service);
        } )

        // Delete api
        app.delete('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Atrii world server is running');

});

app.listen(port, () => {
    console.log('server running at port', port);
})
