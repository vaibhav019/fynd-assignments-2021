const http = require("http");
const dns = require("dns");
var { nanoid } = require("nanoid")
const server = http.createServer();
let URLStore = [];

let checkIfIdExists = (id) => {
    return URLStore.find((value)=>{
        return value.id === id;
    });
};

let getUniqueId = () =>{
    let id = nanoid(7);
    if(checkIfIdExists(id) === undefined){
        return id;
    }
    else{
        return getUniqueId();
    }
}

server.on("request", (req, res) => {
	if (req.url === "/shortenUrl" && req.method === "POST") {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString("utf-8");
		});
		res.setHeader("Content-Type", "application/json");
		req.on("end", () => {

			let originalUrl;
			try {
				const requestJson = JSON.parse(body);
                
				if ("URL" in requestJson) {
					originalUrl = new URL(requestJson.URL);
                    const URLIFExists = URLStore.find((value)=>{
                        return value.OriginalUrl === originalUrl.toString();
                    });

                    if (URLIFExists === undefined){
                        dns.lookup(originalUrl.hostname, (error) => {
                            if (error && error.code === "ENOTFOUND") {
                                res.statusCode = 404;
                                res.end(JSON.stringify({ error: "Invalid URL" }));
                            }
                        });
                        serverUrl = new URL("http://localhost:3000");
                        const id = getUniqueId();
                        serverUrl.pathname = id;
                        
                        UrlJson = {
                            id: id,
                            OriginalUrl: originalUrl.toString(),
                            ShortUrl: serverUrl.toString(),
                        };
                        URLStore.push(UrlJson);
                        res.end(JSON.stringify(UrlJson));
                    }
                    else{
                        res.end(JSON.stringify(URLIFExists));
                    }
				}
			} catch (err) {
				res.statusCode = 404;
				res.end(JSON.stringify({ error: "Invalid Input data" }));
			}
		});
	} else if (req.url.slice(0,1)  === "/" && req.method === "GET") {
        const id = req.url.slice(1)
        const URLStoreObject = checkIfIdExists(id);
        if(URLStoreObject === undefined){
            res.statusCode = 200;
            res.end(JSON.stringify({ Success: "Cant find specified URL." }));
        }
        else{
            res.writeHead(302, {
                location: URLStoreObject.OriginalUrl,
              });
            res.end();
        }
       
	}
});

server.on("error", (error) => {
	console.error(error.message);
});

server.listen(3000);