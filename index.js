const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

//hridoyadhikari368
//2BBvpDiyRHfD43rB



const uri = "mongodb+srv://hridoyadhikari368:2BBvpDiyRHfD43rB@cluster0.yv9j3nb.mongodb.net/?retryWrites=true&w=majority";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDB");
    const usersCollection = database.collection("users");

    //its using for get the data and send the client side for the read the data
    app.get('/users', async(req,res)=>{
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // for the id ways data
    app.get('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const user = await usersCollection.findOne(query);
      res.send(user)
    })

   // its using for the update the user data
   app.put('/users/:id', async(req, res) =>{
    const id = req.params.id;
    const user = req.body;
    console.log(id, user);
    
    const filter = {_id: new ObjectId(id)}
    const options = {upsert: true}
    const updatedUser = {
        $set: {
            name: user.name,
            email: user.email
        }
    }

    const result = await usersCollection.updateOne(filter, updatedUser, options );
    res.send(result);

})

    // its using for the post data to the client for create data
    app.post('/users', async(req,res)=>{
        const user = req.body;
        console.log('new user : ',user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })

    // its using for the delete the user from database 
    app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      console.log('please delete from database', id);
      const query = { _id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result);
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('simple crud is running...')
  })

  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
