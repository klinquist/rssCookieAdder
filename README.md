## RSS Cookie Adder


### Installation

I wrote this for Synology "Download Station" torrent client which does not support cookies.  This is a proxy which allows you to specify the torrent URL & cookies on a query string which gets passed to the tracker.


To run this app, you first need nodejs installed.

git clone this repository, and run `npm install` to install the one dependency.

run `node index.js` to start the app.   I like using `pm2` to run processes persistently.  This app runs on port 6500.



### Usage

First, form a URL query string with the following elements:

* url=(your private tracker URL, starting with https://)
* c.name1=value1
* c.name2=value2
`
Concatnate them with & as you would a normal query string.  The final string should look like this:

```
url=https://www.mytracker.com/329483274&c.uid=myCookie&c.idh=myCookie
```

Now, paste that line into https://www.base64decode.org/ to encode it in base64 format.

Finally, form your RSS url.  You include the base64 as the "data" query string parameter. 

```
http://192.168.0.102:6500/?data=BASE64-STRING
```


