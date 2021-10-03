const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const server = http.createServer();

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
	} else if (req.url === "/addcontactdata") {
		let body = '';
		req.on('data', chunk => {
			console.log('chunk',chunk.toString());
			
		    body += chunk.toString();
		});
		let json = {};

		req.on('end', () => {
		    console.log(body);

			let bodyarray = body.split('&');
			
			bodyarray.map((value)=>{
				const keayValue = value.split('=');
				json[keayValue[0]] = keayValue[1];
			});

			console.log(json);

			const ws = fs.createWriteStream(path.join(__dirname, "contact.json"), {flags: 'a'});

			ws.on("error", (error) => {
				console.log(error.message);
			});
	
			ws.write( JSON.stringify(json, undefined, 2) );
			ws.end();

			res.writeHead(301, {'Location' : '/'});
       		res.end();
		});
		
	
		// req.on('')
		// req.pipe(ws);
		// console.log(req);

        
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