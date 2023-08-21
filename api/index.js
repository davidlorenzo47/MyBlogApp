const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');  
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Post = require('./models/Post');

const salt = bcrypt.genSaltSync(10);
const secret = 'hggfkdndjg67fvfhy889gvcb9fxdvfngkdfjn';


//whatever we want to use in react app, we have to tell our express app here.

app.use(cors({credentials: true, origin:'http://localhost:3000'}));    //if we are using credentials we need to specify information. Origin is host of react app.
app.use(express.json());
app.use(cookieParser());  //adding cookie parser 
app.use('/uploads', express.static(__dirname + '/uploads'));    //Creating an end point. //for linking uploads folder to express app so that it can be used by react app.


mongoose.connect(' PASTE YOUR MONGODB ATLAS LINK HERE ') 

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try {
        const UserDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt),
        }); 
        res.json(UserDoc);
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
    
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username}); //taking user document from our Database.
    const passOk = bcrypt.compareSync(password, userDoc.password);  //passOk will have value true if password matches.
    if (passOk) {
        //user will be able to login as password matches
        //here we will get error if there is error, and we ge token if there is no error.
        
        //signinng token asynchronously
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err; //throwing an error
            res.cookie('token',token).json({
                id:userDoc._id,
                username,
            });
            // res.cookie('token',token).json({
            //     id:userDoc._id,
            //     username,
            //   });    //else respond with token which is sent as cookie. Inside Headers, in Response Headers, Set-Cookie will have our cookie value.
        });

    } else {
        //user enteres incorrect password
        res.status(400).json('Wrong Credentials');
    }
});

//checking if user is logged in or not
//we check cookie, but anybody can have cookie, hence we verify if cookie is valid or not
app.get('/profile', (req, res) => {
    const {token} = req.cookies; // grabbing the cookie
    jwt.verify(token, secret, {}, (err, info) => {  //verifying valid jwt or not.
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');  //parts has filename
    const ext = parts[parts.length - 1];    //ext has extension of the file
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  
    const {token} = req.cookies;    //grabbing the json web token cookie here.

    // after we verify the token, we get info. Inside the token we have id.
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {title,summary,content} = req.body;
      const postDoc = await Post.create({   //creating the post
        title,
        summary,
        content,
        cover:newPath,
        author:info.id,
      });
      res.json(postDoc);
    });
});

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You aren\'t the author!!');
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,   //we will update cover i.e. image, only if we have new path.
      });
  
      res.json(postDoc);
    });
  
}); 


app.delete('/', async (req,res) => {
    // let newPath = null;
    // if (req.file) {
    //   const {originalname,path} = req.file;
    //   const parts = originalname.split('.');
    //   const ext = parts[parts.length - 1];
    //   newPath = path+'.'+ext;
    //   fs.renameSync(path, newPath);
    // }
  
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {id,title,summary,content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You aren\'t the author!!');
      }
      await postDoc.deleteOne({
        title,
        summary,
        content,
        cover: postDoc.cover,   //we will update cover i.e. image, only if we have new path.
      });
  
      res.json(postDoc);
    });
  
}); 


// get is default that's why we don't need to define method on fetch inside our react app.
app.get('/post', async (req,res) => {
    res.json(
      await Post.find() //we add await because its an async function, near the arrow function.
        .populate('author', ['username'])   //we get username of author
        .sort({createdAt: -1})
        .limit(20)
    );
});

//getting id of the post
app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
})
  

app.listen(4000);