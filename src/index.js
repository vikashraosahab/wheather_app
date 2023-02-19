const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');


const readFile = fs.readFileSync(path.join(__dirname,"../public/index.html"),'utf8');

const server = http.createServer();

const replaceVal = (objVal,orgVal)=>{
	let temperatures = objVal.replace("{%temperatures%}",orgVal.main.temp);

  return temperatures;
};
//write methods
server.on('request',(req,res)=>{
	const requests = require('requests');
  if(req.url =='/'){
    res.writeHead('200',{"Content-type":"text/html"});
    requests('https://api.openweathermap.org/data/2.5/weather?q=kanpur&appid=417dc38c7ad5972640d046213594af22')
    .on('data',function (chunk){
         const arrayData = JSON.parse(chunk);
         const realData = [arrayData];
         const realTimeData = realData.map(val => replaceVal(readFile,val)).join('');
          console.log(realTimeData);
          res.write(realTimeData);
    }).on('end',function(err){
    	res.end();
    }).on('error',function(err){
    	if(err) throw err;
    });
  };

});

// server listen
server.listen('8000');