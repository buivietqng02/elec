Warning: Make sure you're using the latest version of Node.js and NPM


### Quick start
# clone our repo
$ git clone https://{{username}}@git.iptp.dev/andre/xm-web.git

# change directory to your app
$ cd xm-web-client

# install the dependencies with npm
$ npm install

# start the server
$ npm start

# open browser and access http://localhost:8080/

# generate stats.json
Build with stats.json. This allows us to pass this to our bundle analyzer and start the process.
`npm run build:stats`

# run the analyzer
$ npm run watch:stats

## Production
To build your application, run:
* `npm run build:prod`
