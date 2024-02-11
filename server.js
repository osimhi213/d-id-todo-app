import { createServer } from "http";
import { promises as fs } from 'fs';

const __dirname = new URL('.', import.meta.url).pathname;

const [host, port] = (() => {
    return process.argv.slice(2).length > 1 ? process.argv.slice(2) : ['localhost', 8000]
})();

const requestListener = function (req, res) {
    const url = req.url;
    let file_path;
    let file_type;
    if (url.endsWith(".css")) {
        file_path = __dirname + url;
        file_type = 'css';
    } else {
        file_path = __dirname + "/index.html";
        file_type = 'html';
    }
    fs.readFile(file_path)
        .then(contents => {
            res.setHeader("Content-Type", `text/${file_type}`);
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
            return;
        });

};

const server = createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
});


