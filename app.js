//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://basit:ItptWeb1@cluster0.kvh3s.mongodb.net/todolistDB?retryWrites=true&w=majority');

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item(
                      {name: "Welcome to your todolist!"}
                    );

const item2 = new Item(
                      {name: "Hit the + button to add a new item."}
                    );

const item3 = new Item(
                      {name: "<-- Hit this to delete an item"}
);

const defaultItems = [item1, item2, item3];

var flag = 1;


// const items = [];

app.get("/", function(req, res) {
  const day = date.getDate();

  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0 && flag === 1){
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        }
        else{
          console.log("Successfully added default items to DB.");
          flag = 0;
        }
      });
      res.redirect("/");
    }
    // console.log(foundItems);
      res.render("list", {listTitle: day, items: foundItems});
  });


});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    // items.push(item);
    const item = new Item({name: itemName});

    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
  checkedItemID = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID, function(err){
    if(!err){
      console.log("Successfully deleted checked item");
      res.redirect("/");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
  console.log("Server started successfully");
});
