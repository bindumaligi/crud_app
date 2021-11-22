const express = require('express');
const bodyParser = require("body-parser");
const app=express();
app.use(bodyParser.json());
const path = require('path');

const db = require("./db");
//const db = client.db;
const collection = "todo";


app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'));
});


// read
app.get('/getTodos',(req,res)=>{
    // get all Todo documents within our todo collection
    // send back to user as json
    try{
    db.getDB().collection(collection).find({}).toArray((err,documents)=>{
        if(err)
            console.log(err);
        else{
            res.json(documents);
        }
    });
    }
    catch(error){
        res.status(400).json(error.message)
    }
});

// update



app.post('/' , (req, res)=>{

    try{
    const userInput = req.body;
    
    db.getDB().collection(collection).insertOne(userInput, (err, result)=>{
        if(err)
            console.log(err)
        else{
            res.json({result : result});
         }    
    });
    }catch(error){
        res.status(400).json(error.message)
    }
});

// update
app.put('/:id',(req,res)=>{
    try{
    // Primary Key of Todo Document we wish to update
    const todoID = req.params.id;
    // Document used to update
    const userInput = req.body;
    // Find Document By ID and Update
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(todoID)},{$set : {todo : userInput.todo}},{returnOriginal : false},(err,result)=>{
        if(err)
            console.log(err);
        else{
            res.json(result);
        }      
    });
    }catch(error){
        res.status(400).json(error.message)
    }
});


app.delete('/:id',(req,res)=>{
    // Primary Key of Todo Document
    try{
    const todoID = req.params.id;
    // Find Document By ID and delete document from record
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(todoID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
    }
    catch(error){
        res.status(400).json(error.message)
    }
});




db.connect((err)=>{
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    else{
        app.listen(3000,()=>{
            console.log('connected to database, app listening on port 3000');
        });
    }

})