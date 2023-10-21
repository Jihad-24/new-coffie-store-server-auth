const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8urwnno.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const coffieeCollection = client.db('coffieeDB').collection('coffiee');
        const userCollection = client.db('coffieeDB').collection('user');

        // coffiee related apis

        app.get('/coffiee', async (req, res) => {
            const cursor = coffieeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/coffiee/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await coffieeCollection.findOne(quary);
            res.send(result);
        })

        app.post('/coffiee', async (req, res) => {
            const newCoffiee = req.body;
            console.log(newCoffiee);
            const result = await coffieeCollection.insertOne(newCoffiee)
            res.send(result)
        })

        app.put('/coffiee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffiee = req.body;
            const coffiee = {
                $set: {
                    name: updatedCoffiee.name,
                    quantity: updatedCoffiee.quantity,
                    supplier: updatedCoffiee.supplier,
                    taste: updatedCoffiee.taste,
                    category: updatedCoffiee.category,
                    details: updatedCoffiee.details,
                    photo: updatedCoffiee.photo
                }
            }
            const result = await coffieeCollection.updateOne(filter, coffiee, options)
            res.send(result);

        })

        app.delete('/coffiee/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await coffieeCollection.deleteOne(quary);
            res.send(result);
        })

        // user related apis

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.patch('/user', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateUser = {
                $set: {
                    email: user.email,
                    lastSignInTime: user.lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter, updateUser)
            res.send(result);
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(quary);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('coffie server is running')
})


app.listen(port, () => {
    console.log(`server is running on port : ${port}`);
})