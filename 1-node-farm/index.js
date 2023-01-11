const fs = require('fs');
const http = require('http');
const url = require('url');

///////////////////////////////
//FILES

//Blocking, sync way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File written!');

//Non-blocking, async way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('ERROR! 🤯');
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written 😁');
//             });
//         });
//     });
// });
// console.log('Will read file');

///////////////////////////////
//SERVER
const createHtml = (tHtml, data) => {
  let html = tHtml.replace(/{%id%}/g, data.id);
  html = html.replace(/{%productName%}/g, data.productName);
  html = html.replace(/{%image%}/g, data.image);
  html = html.replace(/{%from%}/g, data.from);
  html = html.replace(/{%nutrients%}/g, data.nutrients);
  html = html.replace(/{%quantity%}/g, data.quantity);
  html = html.replace(/{%price%}/g, data.price);
  if (!data.organic) html = html.replace(/{%not-organic%}/g, 'not-organic');
  return html.replace(/{%description%}/g, data.description);
};

//load data and templates
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const tOverview = fs.readFileSync(
  `${__dirname}/starter/templates/tOverview.html`,
  'utf-8'
);
const tCard = fs.readFileSync(
  `${__dirname}/starter/templates/tCard.html`,
  'utf-8'
);
const tProduct = fs.readFileSync(
  `${__dirname}/starter/templates/tProduct.html`,
  'utf-8'
);

const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url);
  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj.map((e) => createHtml(tCard, e)).join('');
    const overviewHtml = tOverview.replace('{%cards%}', cardsHtml);
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(overviewHtml);
  } else if (pathname === '/product') {
    const product = data[query.id];
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end('This is the product response');
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' }).end(data);
  } else {
    res
      .writeHead(404, {
        'Content-type': 'text/html',
        'my-own-header': 'hello-world',
      })
      .end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening for requests on port 8000.');
});
