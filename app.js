var express=require("express");
var app=express();
var mongoose    = require("mongoose");
var passport    = require("passport");
var LocalStrategy = require("passport-local");
var bodyParser = require("body-parser");
var ALBUM=require("./models/albumList");
var User=require("./models/user");
var flash=require("connect-flash");
var completeUser=require("./models/completeUser");
var methodOverride=require("method-override");
app.set("view engine","ejs");

//mongoose.connect("mongodb://localhost/photo-galleryv1");

mongoose.connect("mongodb://stranger7evilu:nowhere@ds263989.mlab.com:63989/photo-gallery");
app.use(flash());
app.use(require("express-session")({
    secret:"Ayush Pathak",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "/public"));




app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})



function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}


 var albumList=[{name:"Bikes",likes:2,description:"This is a collection of cool Bikes",cover:"http://static0.passel.co/wp-content/uploads/2015/06/27003213/SplitShire-3538-1800x1200-760x507.jpg",tt:"",visibilty:"",pictures:[["http://static0.passel.co/wp-content/uploads/2015/06/27003213/SplitShire-3538-1800x1200-760x507.jpg","pic1","This is a sample testing picture","0"],["http://static0.passel.co/wp-content/uploads/2015/06/27003213/SplitShire-3538-1800x1200-760x507.jpg","pic2","Another picture","0"],["http://static0.passel.co/wp-content/uploads/2018/01/05095720/tumblr_p1wkayx1sA1u7ns0go1_500.jpg","pic3","Another one","0"]],creator:""},{name:"album2",cover:"",description:"",tt:"",visibilty:"",pictures:[["pic3","pic4","randomdesc","0"],["pic5","pic6","randomdesc1","0"]],creator:"",likes:0}];
//console.log(albumList[0]);
/*ALBUM.create(albumList[0],function(err, album){
       if(err){
           console.log(err);
       } else {
           console.log("NEWLY CREATED ALBUM: ");
           console.log(album);
       }
    });*/


app.get("/",function(req,res){
   res.render("landing");
});

app.get("/album",function(req,res){
    //var pictures=[{name:"Picture1",image:"http://static0.passel.co/wp-content/uploads/2015/06/27003213/SplitShire-3538-1800x1200-760x507.jpg"},{name:"Picture2",image:"http://static0.passel.co/wp-content/uploads/2018/01/05095720/tumblr_p1wkayx1sA1u7ns0go1_500.jpg"}];
    ALBUM.find({}, function(err, allAlbums){
       if(err){
           console.log(err);
       } else {
           console.log(allAlbums);
          res.render("album",{albumList:allAlbums});
       }
    });
    //res.render("album",{albumList:albumList});
});
app.get("/album/new",isLoggedIn,function(req,res){
    res.render("newAlbum.ejs");
});
app.post("/album",function(req,res){
    console.log("Hit");
    var name=req.body.name;
    var description= req.body.description;
    //console.log(description);
    var cover=req.body.cover;
    var visibilty=req.body.visibilty;
    var creator= req.user.username;
    var dt=getDateTime();
    console.log(visibilty);
    var d={name:name,description:description,pictures:[],creator:"Anonymous",likes:"0",visibilty:visibilty,tt:"",cover:cover,creator:creator,dt:dt};
    ALBUM.create(d,function(err, album){
       if(err){
           console.log(err);
       } else {
           console.log("NEWLY CREATED ALBUM: ");
           //console.log(album);
       }
    });
    completeUser.findOne({username:req.user.username},function(err,foundUser){
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log("Found user");
            console.log(foundUser["username"]);
            foundUser["createdAlbums"].push(req.body.name);
            foundUser.save(function(err,data){
                if(err)
                console.log(err);
                else
                {
                    console.log("Save successfule"+data);
                }
            })
        }
    });
    //albumList.push({name:name,description:description,pictures:[],creator:"",likes:"0",visibilty:visibilty,tt:"",cover:cover});
    req.flash("success","Successfully created");
    res.redirect("/album/"+name);
});

app.get("/album/:name",isLoggedIn,function(req,res){
    
    
    var foundIndex=-1;
    
    
    
    ALBUM.find({}, function(err, albumList){
       if(err){
           console.log(err);
       } else {
            for(var i=0;i<albumList.length;i++)
    {
        if(albumList[i]["name"]==req.params.name)
        {
            foundIndex=i;
            break;
        }
    }
    if(typeof albumList[foundIndex]!== 'undefined')
    {
    if(albumList[foundIndex]["creator"]!=req.user.username && albumList[foundIndex]["visibilty"]=="private")
    {
        //req.flash("error","You can't view a private album");
     res.render("errorPage",{error:"You can't view a private album"});
    }
    
    else if(foundIndex!=-1)
    res.render("pictures",{album:albumList[foundIndex]});
    else
    res.send("No album with this name found");
       }
        else
       {
        res.send("Can't find the request album,May have been deleted by the creator");  
       }
       }
      
    });
    
    
   
    
    
    
});

app.get("/album/:name/new",isLoggedIn,function(req,res){
    console.log("Hit " +req.params.name);
     
    
    res.render("newPicture",{album:req.params.name});
});

app.post("/album/:name",isLoggedIn,function(req,res){
    var album=req.params.name;
    var url=req.body.url;
    var caption=req.body.caption;
    var desc=req.body.desc;
    var likes="0";
    
    
    ALBUM.find({}, function(err, albumList){
       if(err){
           console.log(err);
       } else {
           
           var foundIndex=-1;
    for(var i=0;i<albumList.length;i++)
    {
        
        if(albumList[i]["name"]==album)
        {
            foundIndex=i;
        }
    }
    if(foundIndex!=-1)
    {
        var tmp=[];
        tmp.push(url);
        tmp.push(caption);
        tmp.push(desc);
        tmp.push(likes);
        console.log(tmp);
        
        
        albumList[foundIndex]["pictures"].push(tmp);
        ALBUM.update({name:album},albumList[foundIndex],function(err,newVal){
            if(err)
            console.log(err)
            else
            {
                console.log("Updated value");
                console.log(newVal);
            }
            
        });
        
        
    }
    var redirectAddress="/album/"+album;
    res.redirect(redirectAddress);
          
       }
    });
    
    
    
});


app.put("/album/:id",isLoggedIn,function(req,res){
    
   
    
    ALBUM.findOne({name:req.params.id},function(err,foundAlbum){
        if(err)
        {
            console.log(err);
            res.send("Error encountered");
        }
        else
        {
             if(req.user.username==foundAlbum["creator"])
             {
            foundAlbum["description"]=req.body.description;
            foundAlbum["cover"]=req.body.cover;
            foundAlbum.save(function(err,data){
                if(err)
                {
                    console.log("Data couldn't be saved");
                    res.send("Couldn't update");
                }
                
                else
                {
                    req.flash("success","Successfully updated");
                    res.redirect("/album/"+req.params.id);
                }
            }); }
            else
            {
                res.send("You are not authorized for this operation");
            }
        }
             
           
            
        
        
    });
    //res.send("Update route");
});

app.get("/album/:id/edit",isLoggedIn,function(req,res){
    
    
    ALBUM.findOne({name:req.params.id},function(err,foundalbum){
        if(err)
        {
            res.send("No album found for edit");
        }
        else
        {
             if(req.user.username==foundalbum["creator"])
             res.render("edit",{album:foundalbum});
             else
             res.send("You are not authorized");
        }
        
    });
   
    
});

app.get("/album/:id1/:id2",isLoggedIn,function(req,res){
    
    ALBUM.find({name:req.params.id1},function(err,foundAlbum){
        if(err)
        {
            console.log(err);
            res.send("Error,Not found");
        }
        else
        {
            console.log(foundAlbum[0]["pictures"]);
            var xx=-1;
            for(var i=0;i<foundAlbum[0]["pictures"].length;i++)
            {
                if(foundAlbum[0]["pictures"][i][1]==req.params.id2)
                {
                    xx=i;
                }
            }
            if(xx!=-1)
            res.render("pictureInfo",{picture:foundAlbum[0]["pictures"][xx],albumname:foundAlbum[0]["name"]});
            else
            res.send("Oops not found,Picture may have been deleted");
            
      
        }
            
       
        
                //res.render("pictureInfo",{album:foundAlbum});
        
    });
    
});

//DELETE ROUTES

app.delete("/album/:id",isLoggedIn,function(req,res){
   ALBUM.findOne({name:req.params.id},function(err,foundAlbum){
       if(err)
       {
           console.log("Couldn't delete");
       }
       else
       {
           if(foundAlbum["creator"]==req.user.username)
           {
                foundAlbum.remove(function(err){
                    if(err)
                    {
                        res.send("Couldn't remove");
                    }
                    else
                    {
                        completeUser.findOne({username:req.user.username},function(err,foundUser){
                            if(err)
                            {
                                console.log("Couldn't remove the album from user list");
                            }
                            else
                            {
                                var tmp=[];
                                for(var i=0;i<foundUser["createdAlbums"].length;i++)
                                {
                                    if(foundUser["createdAlbums"][i]==req.params.id)
                                    {
                                        
                                    }
                                    else
                                    {
                                        tmp.push(foundUser["createdAlbums"][i]);
                                    }
                                }
                                foundUser["createdAlbums"]=tmp;
                                foundUser.save(function(err,data){
                                    if(err)
                                    console.log("cant save");
                                    else
                                    console.log("Saved");
                                });
                            }
                        });
                        
                        req.flash("success","Successfully deleted");
                        res.redirect("/album");
                    }
                })
           }
           else
           {
               res.send("You are not authorized to delete this album");
           }
       }
   })
});


app.delete("/album/:id1/:id2",function(req,res){
    
    ALBUM.findOne({name:req.params.id1},function(err,foundAlbum){
        if(err)
        {
            res.send("Couldn't find the album associated with the picture");
        }
        else
        {
           var tmp=[];
            for(var i=0;i<foundAlbum["pictures"].length;i++)
            {
                if(foundAlbum["pictures"][i][1]==req.params.id2)
                {
                    
                }
                else
                {
                    tmp.push(foundAlbum["pictures"][i]);
                }
            }
            foundAlbum["pictures"]=tmp;
            foundAlbum.save(function(err,data){
                if(err)
                {
                    res.send("Some error encountered while deleting picture");
                }
                else
                {
                    req.flash("success","Successfully deleted");
                    res.redirect("/album/"+req.params.id1);
                }
            })
            //res.send(tmp);
        }
        
    });
    
    
    //res.send("Delete route of pic "+req.params.id1+ " ," + req.params.id2);
});

//User ROUTES



app.get("/register",function(req,res){
    res.render("register");
    
});
app.get("/user",function(req,res){
    //PRINT LIST OF ALL USERS
    completeUser.find({},function(err,data){
        if(err)
        {
            res.send("Some error occured");
        }
        else
        {
            res.render("allUsers",{userList:data});
            
        }
        
    });
    
    
});

app.post("/user",function(req,res){
    var newUser=new User({username:req.body.username});
    
    User.register(newUser,req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
        
            return res.render("register",{"error": err.message});
        }
        else
        {
            console.log(user);
            passport.authenticate("local")(req,res,function(){
                var userCompleteDetails = {username:req.body.username,fname: req.body.fname, 
  lname: req.body.lname, 
  email: req.body.email, 
  gender: req.body.gender, 
  profilepicture:req.body.profilepicture,
    createdAlbums:[]
                };
  completeUser.create(userCompleteDetails,function(err,userdetails){
      if(err)
      {
          console.log("Error to be handled");
      }
      else
      {
          console.log("Successfully added "+userCompleteDetails);
      }
  });
                req.flash("successfully registered","Success");
                res.redirect("/user/"+req.body.username);
            })
            
        }
    })
    
});
app.get("/user/:id/edit",isLoggedIn,function(req,res){
    completeUser.findOne({username:req.params.id},function(err,foundUser)
    {
        if(err)
        {
            res.send("User not found");
        }
        else
        {
            if(req.user.username!=req.params.id)
            {
                res.send("You are not authorized to do this operation");
            }
            else
            {
                res.render("editUser",{user:foundUser});
            }
        }
    });
    //res.render("editUser",)
});
app.put("/user/:id",isLoggedIn,function(req,res){
    
    if(req.user.username!=req.params.id)
    {
        return res.send("You are not authorized to do this operation");
    }
    
    completeUser.findOne({username:req.params.id},function(err,foundUser){
        
        if(err)
        {
            console.log(err);
            res.send("Error occured");
        }
        else
        {
            foundUser["fname"]=req.body.fname;
            foundUser["lname"]=req.body.lname;
            foundUser["profilepicture"]=req.body.profilepicture;
            foundUser["email"]=req.body.email;
            foundUser["gender"]=req.body.gender;
            foundUser.save(function(err,data){
                if(err)
                {
                    
                    res.send("Error in saving the edit");
                }
                else
                {
                    var urll="/user/"+req.params.id;
                    console.log(urll);
                    req.flash("success","Successfully modifed your profile");
                    res.redirect(urll);
                }
            });
        }
    });
    
   
});
app.get("/user/:id",function(req,res){
    completeUser.findOne({username:req.params.id},function(err,completeuser){
        if(err)
        {
            res.send("User not found");
        }
        else
        {
            res.render("user",{user:completeuser});
            
        }
    })
});



app.get("/login",function(req,res){
    
   res.render("login"); 
});

app.post("/login",passport.authenticate("local",
{
    successRedirect:"/album",
    failureRedirect: "/login"
}),function(req,res){
    
});

app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Successfully logged out");
    res.redirect("/");
});

app.get("*",function(req,res){
    res.send("Sorry we couldn't find the page,The page may have been deleted or moved to a new source address")
});

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error","Please login first");
    res.redirect("/login");
}


app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("Photo gallery server running");
});