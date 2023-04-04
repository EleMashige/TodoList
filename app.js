const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const { render } = require("ejs");
const app = express();
// let ejs = require('ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//So this line of code tells our app which is generated using Express to use EJS as its view engine.
app.set("view-engine", "ejs");

//TO CONNECT MONGOOSE AND CREATE A DATABASE CALLED todoListDB
mongoose.connect("mongodb+srv://EleMashige:Misiyothe145@cluster0.rbyyogg.mongodb.net/todoListDB");
//TO CREATE A SCHEMA OR TABLE
const itemsSchema = {
  name: String
};
//TO CREATE SCHEMA OR TABLE DATA BASED ON THE SCHEMA ABOVE
const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
  name: "Welcome to you todolist"
});

const item2 = new Item({
  name: "Hit the + button to add new item"
});

const item3 = new Item({
  name: "Hit the -  button to remove item"
});

//TO PUT ALL THE ITEMS IN THE ARRAY
const itemsArray = [item1, item2, item3];

//NEW SCHEMA
const listSchema = {
  name: String,
  items: [itemsSchema]
}    

const List = mongoose.model("List",listSchema);

// const day = date();

//GET
app.get("/", (req, res) => {
  Item.find({})
  .then(function(foundItems){
    //NEW
    //THIS IS WHERE YOU INSERT ITEMS FROM ARRAY
if (foundItems.length === 0) {
  Item.insertMany(itemsArray)
.then(function(){
  console.log("Successfully added")
}).catch(function(err){
  console.log(err)
});

res.redirect("/");

}else {
  //THIS IS TO MAKE SURE THE ARRAY ITEMS SHOW ON THE BROWSER OR APP
  res.render("list.ejs", { typeOfDay: "Today", toDo: foundItems});
}
 //NEW

   //THIS .catch IS FOR THE FIRST .then THAT IS UNDER Item.find()
  }).catch(function(err){
    console.log(err)
  })

});

//POST
app.post("/", (req, res) => {
const newTodoItem = req.body.list;

const addedItem = new Item({
name: newTodoItem
})

addedItem.save()

// To make sure the browser doesn't keep reloading ot make sure the item is imediately added
res.redirect("/")
  
})

//DELETE
app.post("/delete", (req, res) => {
  const deleteItem = (req.body.checkbox);
  Item.findByIdAndRemove(deleteItem)
  .then(function(err){
console.log(err)
  })
  res.redirect("/")
});

app.get("/:customListName", (req, res) => {
const customListName = req.params.customListName

List.findOne({ name: customListName })
    .then(function (foundList) {
      //If there was no list with the same name, then create a new list
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: itemsArray,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show an existing list
        res.render("list.ejs", {
          typeOfDay: foundList.name,
          toDo: foundList.items,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });

});

app.get("/about", (req, res) => {
 res.render("about.ejs");
})



app.listen(3000, function () {
  console.log("App is up and running on port 3000");
});

