const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const path = require("path");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

const port = 8080;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'dalta_app',
    password: 'system',
  });



//HOME ROUTE
app.get("/" , (req , res)=>{
  let Q = " select count(*) from user";
  try{
  connection.query(Q, (err , result)=>{
    if(err){
       throw err;
    }
    let usercount = result[0]["count(*)"];
    res.render("home.ejs" , { usercount });
  })
  // connection.end();
}catch(err){
  console.log(err);
  res.send("THERE IS AN ERROR IN [DB]");
}
  // res.send("WELCOME TO HOME");
})


// SHOW ALL USER ROUTE
app.get("/user" , (req, res)=>{
  let Q = `select * from user`;
  try{
    connection.query(Q, (err , result)=>{
      if(err){
         throw err;
      }
      res.render("user.ejs" , {result});
    })
    // connection.end();
  }catch(err){
    console.log(err);
    res.send("THERE IS AN ERROR IN [DB]");
  }

})

//EDIT ROUTE
app.get("/user/:id/edit" , (req, res)=>{
  let {id} = req.params;
  let Q = `select * from user where id = '${id}'`;
  
  try{
    connection.query(Q, (err , result)=>{
      if(err){
         throw err;
      }
      let user = result[0];
      res.render("editform.ejs", {user} );
    })
    // connection.end();
  }catch(err){
    console.log(err);
    res.send("THERE IS AN ERROR IN [DB]");
  }

})

//UPDATE ROUTE in DB
app.patch("/user/:id" , (req,res)=>{
  
      let {id} = req.params;
      console.log(id);
      let Q = `select * from user where id = '${id}'`;
      let {password: newpass , username: newusername} = req.body;
      try{
        connection.query(Q, (err , result)=>{
          if(err){
            throw err;
          }
          let user = result[0];
          if(newpass != user.password){
            res.send("WRONG PASSWORD");
          }else{
            let Q2 = `update user set username = '${newusername}' where id='${id}' `;
            connection.query(Q2 , (err , resule)=>{
              if(err){
                throw err;
              }

              res.redirect("/user");

            })
          }
        });
        // connection.end();
      }catch(err){
        console.log(err);
        res.send("THERE IS AN ERROR IN [DB]");
      }

})

// NEW USER FORM
app.get("/user/new" , (req, res)=>{
      res.render("addform.ejs")
})

// ADD REQ
app.post("/user/new" , (req, res)=>{
  res.send("ADDED");

})





app.listen(port , ()=>{
      console.log(`SERVER IS RUNING ON PORT ${port}`);

});






// let getRandomUser = () => {
//   return [
//         faker.string.uuid(),
//         faker.internet.userName(),
//         faker.internet.email(),
//         faker.internet.password(),
//       ];
// }