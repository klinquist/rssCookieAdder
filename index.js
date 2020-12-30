const http = require('http');
const url = require('url');
const request = require('request');
const querystring = require('querystring');
const host = 'http://192.168.0.109:6500';

function replaceTitles(body, query) {
    let i = 0;
    return body.replace(/\<link\>(.*?)\<\/link\>/g, (n, x) => {
        i++;
        //Don't replace the first link
        if (i > 1) return `<link>${host}/?data=${Buffer.from(`url=${x}&f=true&${query}`).toString('base64')}</link>`;
        else return `<link>${x}</link>`;
    });
}

http.createServer((req, res) => {
    const query = querystring.parse(url.parse(req.url).query),
        cookies = [],
        titleCookies = [];
    if (!query.data) {
        console.log('No data');
        return res.end();
    }
    const dataString = querystring.parse(Buffer.from(query.data, 'base64').toString());
    for (const k in dataString) {
        if (k.indexOf('c.') > -1) {
            cookies.push(`${k.substr(k.indexOf('.') + 1)}=${dataString[k]}`);
            titleCookies.push(`${k}=${dataString[k]}`);
        }
    }
    const cookieHeader = cookies.join('; ');
    if (!dataString.f) {
        console.log(`Getting RSS feed@ ${dataString.url}`);
        request.get({
            url: dataString.url,
            strictSSL: false,
            headers: {
                Cookie: cookieHeader
            },
        }, (error, response, body) => {
            body = replaceTitles(body, titleCookies.join('&'));
            res.writeHead(200, { 'Content-Type': response.headers['content-type'] });
            res.end(body);
        });
    } else {
        console.log(`Getting LINK @ ${dataString.url}`);
        request.get({
            url: dataString.url,
            strictSSL: false,
            headers: {
                Cookie: cookieHeader
            },
            encoding: 'binary'
        }, (error, response, body) => {
            res.writeHead(200, { 'Content-Type': response.headers['content-type'] });
            res.end(body, 'binary');
        });
    }
}).listen(6500);
