const express=require("express");
const request=require("request");
const https=require("https");

const app=express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.post("/",(req,res)=>{
    const fName=req.body.firstName;
    const lName=req.body.lastName;
    const email=req.body.email;
    
    const data={
        members:[
            {
                email_address: email,
                status:"subscribed",
                merge_fields:{
                   FNAME: fName,
                   LNAME: lName 
                }

            }
        ]
    };

    const jsonData=JSON.stringify(data);
    const url="https://us1.api.mailchimp.com/3.0/lists/bd0cebd133";
    const options={
        method:"POST",
        auth:"apiKey:c8e463f2d154d4664a6c1801d1e85a79-us1"
    }
    const requestJSON= https.request(url,options,(response)=>{
        response.on("data",(data)=>{
            if(response.statusCode===200)
                res.sendFile(__dirname+"/success.html");
            else
            res.sendFile(__dirname+"/failure.html");
        });
    })
    requestJSON.write(jsonData);
    requestJSON.end();
})

app.post("/failure",(req,res)=>{
    res.redirect("/");
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})





