const express=require('express');
const app =express();
const path=require('path');
var fs = require('fs');
var FormData = require('form-data');
var fetch =require('node-fetch');
var upload=require('express-fileupload');

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))
app.get('/',(req,res)=>{
    res.render('index');

})

app.get('/random',(req,res)=>{
    res.render('random',{name:null});

})

app.listen(8000,()=>{
    console.log('yayay');
})

var up ='./uploads/';
var pic;
var fil = fs.readdirSync(up);
for(var i in fil) {
  if(path.extname(fil[i]) === ".jpg") {
      pic=fil[i];
      break;
  }
 else{
   console.log('there is no .jpg file in the folder');
 }
}
const pict=up+pic;


var formdata = new FormData();
formdata.append('image',fs.createReadStream(pict));

var requestOptions = {
 method: 'POST',
 headers: {
      'Authorization': ' project cedc79d5ef94b7ecca34b6087f72c43ab697613f'
        } ,
 body: formdata,
 redirect: 'follow'
};



app.use(upload());
    var file;
    var filenm;
    app.post('/random', (req, res) => {
         if(req.files){
          file =req.files.image
           filenm=file.name;
          file.mv('./uploads/'+filenm,function(err){
              if(err)
              {
                  res.send(err);
              }
              else{
                 console.log('image uploaded');
                    fetch("https://api.logmeal.es/v2/recognition/complete/v0.9", requestOptions)
                     .then(response => response.json())
                     .then(result =>{
                         console.log(result);
                        var name=result.recognition_results[0].name;
                         res.render('random',{name});
                    })

              }
          })
         }
    })
