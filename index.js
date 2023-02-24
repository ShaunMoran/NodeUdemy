const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');
const replaceTemplate = require('./module/replaceTemplate.js')



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html` , 'utf-8') ;
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html` , 'utf-8') ;
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html` , 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json` , 'utf-8') 
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower:true}));
console.log(slugs);

//console.log(slugify('Fresh Avocados', { lower: true}));
const server = http.createServer ((req, res) => {

    const {query, pathname } = url.parse(req.url, true)
    

    //overview page
    if(pathname ===  '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});
        //res.end(tempOverview);

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(`{%PRODUCT_CARDS%}` , cardsHtml)
        res.end(output)

        //product page
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj [query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
        //API
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application-json'})
        res.end(data);
        //Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>')
        }
});


server.listen(8000, '127.0.0.1' , () => {;
    console.log('listening to requests on port 8000');
});

