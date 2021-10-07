const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

//const { Console } = require("console");
const server = http.createServer();

//let arr=[]
server.on("request", (req, res) => {
	if (req.url === "/home") {
		res.setHeader("Content-Type", "text/html");
		const rs = fs.createReadStream(path.join(__dirname, "index.html"));
		rs.on("error", (error) => {
			console.log(error.message);
			return;
		});

		rs.pipe(res);
	} else if (req.url === "/contact") {
		res.setHeader("Content-Type", "text/html");
		const rs = fs.createReadStream(path.join(__dirname, "contact.html"));
		rs.on("error", (error) => {
			console.log(error.message);
			return;
		});

		rs.pipe(res);
	} else if (req.url === "/message") {
		
		let dataitems = '';
		req.on('data', chunk => {
			
			
		    dataitems += chunk.toString();
		});
		let obj = {};
		
		req.on('end', () => {
		    console.log(dataitems);

			let messagearray = dataitems.split('&');
			
			messagearray.map((value)=>{
				const keyValue = value.split('=');
				obj[keyValue[0]] = keyValue[1];
			});

			console.log(obj);
			//arr.push(obj);
			//console.log(arr);
			
			
			const ws = fs.createWriteStream(path.join(__dirname, "messages.txt"), {flags: 'a'});

			ws.on("error", (error) => {
				console.log(error.message);
			});
			
			ws.write( JSON.stringify(obj,undefined,4));
			
			
			ws.end();

			res.writeHead(301, {'Location' : '/'});

			
       		res.end();
			   
		});    

	}
});

server.on("error", (error) => {
	console.error(error.message);
});

server.listen(3000);






















































// const http = require( 'http' );

// const server = http.createServer();

// server.on( 'request', ( req, res ) => {
//     console.log( req.url );
//     if( req.url === '/contact' ) {
//         res.end( '' );
//     } else if( req.url === '/home' ) {
//         res.setHeader( 'Content-Type', 'text/html' );
//         res.end( '<h1>Home page</h1>
//         <p>home page</p>
//         ' );
//     } else {
//         res.end( 'Hello there!' );
//     }
// });

// server.on( 'error', ( error ) => {
//     console.error( error.message );

//     // EXERCISE: generalize this to find the current port being tried and try the next port (eg. if 4500 is being tried, use 4501 instead)
//     server.listen( 3001 ,()=>
//         console.log("server is runnibg at",3001)
//     );
// });



// // (till 1024 port is reserved for standard services) - 65535
// server.listen( 3000 );