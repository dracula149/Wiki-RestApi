const express=require("express");
const app=express();
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine",ejs);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb",{ useNewUrlParser: true,useUnifiedTopology: true  });

const wikischema=new mongoose.Schema({
  title:String,
  content:String

});
const Article=new mongoose.model("Article",wikischema);

//chained route handler !!!app.route("/articles").get().post().delete()!!!

app.route("/articles")
.get(function(req,res){//get all articles
  Article.find({},function(err,found){
    if(!err){
      res.send(found);
    }
    else{
      res.send(err);
    }

  })
})
.post(function(req,res){//add new article
  const newarticle=new Article({
    title:req.body.title,
    content:req.body.content
  })
  newarticle.save(function(err){
    if(!err){
      res.send("added sucessfully");
    }
    else{
      res.send(err);
    }
  })
})
.delete(function(req,res){//delete all article
  Article.deleteMany({},function(err){
    if(!err){
      res.send("deleted");
    }
    else{
      res.send(err);
    }
  })
});

app.route("/articles/:topic")//getting a specific article=
.get(function(req,res){
  var name=req.params.topic;
  Article.findOne({title:name},function(err,found){
    if(!err){
      res.send(found);
    }
    else{
      res.send(err);
    }
  })
})
.put(function(req,res){//updating a specific article
  Article.update(
    {title:req.params.topic},
    {title:req.body.title,content:req.body.content},
  {overwrite: true},
  function(err){
    if(!err){
      res.send("sucessfully updated");
    }
    else{
      res.send(err);
    }

  })

})
.patch(function(req,res){//updating specific part of article
  Article.update(
    {title:req.params.topic},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("sucessfully updated");
      }
      else{
        res.send(err);
      }
    }

  );
})
.delete(function(req,res){//delete a specific article
  Article.deleteOne({title:req.params.topic},  function(err){
      if(!err){
        res.send("sucessfully deleted");
      }
      else{
        res.send(err);
      }
    })
});









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
