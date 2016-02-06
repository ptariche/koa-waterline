# koa-waterline
  Middleware for your hose


[![NPM](https://nodei.co/npm/koa-waterline.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-waterline/) [![NPM](https://nodei.co/npm-dl/koa-waterline.png?months=6&height=3)](https://nodei.co/npm/koa-waterline/)



    npm install koa-waterline

## Usage

    //see example.js
  ```js
    function* (){
      let ctx            = this;
      let message        = 'This is an example';
      let commentCreated = yield ctx._waterline.collections.comments.create({message: message});
      // You can yield to the CRUD waterline functions because they are written as promises.
      console.log(commentCreated);
    }
  ```
    // OR
  ```js
    function* () {
      let waterline      = yield Waterline.init(injection);
      let message        = 'This is an example';
      let commentCreated = yield waterline.collections.comments.create({message: message});
    }
  ```
   * The model attributes of connection and adp must match the connection and adapter naming conventions when setting up your environment to inject into the middleware.

## Example
  ```js
    let connections = {
      couch: {
        adapter: "couch",
        host: '127.0.0.1',
        port: '5984',
        username: '',
        password: ''
      },
      mongo: {
        adapter: "mongo",
        host: 'localhost',
        port: '27017',
        user: '',
        password: '',
        database: 'waterline'
      },
      cassandra: {
        adapter: "cassandra",
        host: '',
        password: '',
        contactPoints: ['127.0.0.1'],
        keyspace: 'dev'
      }
    };

    let adapters = {
      couch:     require('sails-couchdb-orm'),
      mongo:     require('sails-mongo'),
      cassandra: require('sails-cassandra')
    };

    let models = {
        "comments": {
          "model": true,
          "adp": "couch",
          "connection": "couch",
          "properties": {
            "archived": {
                "type": "boolean",
                "defaultValue": false
            },
            "message": {
                "type": "string"
            }
          }
        },
        "history": {
          "model" : true,
          "adp": "mongo",
          "connection": "mongo",
          "properties": {
            "year": {
              "type": "string"
            }
          }
        },
        "tweet": {
          "adp": "cassandra",
          "connection": "cassandra",
          "index": ['tweet_body'],
          "properties": {
            "tweet_body": {
              "type": "string"
            }
          }
        },
        "error": {
          "model": false,
          "properties": {
            "erro": {
              "type": "string"
            }
          }
        }
      };

    let injection               = {};
    injection.methods           = false;
    injection.models            = models;
    injection.adapters          = adapters;
    injection.connections       = connections;

    app.use(waterline(injection));
  ```
##Attributes
*Models* - Required

    - Models must have an adp, connection, and the properties attributes with the same design pattern in the example above. There is an optional model flag that can be added inside the model that should be set to true or false; this allows you to not instiatiate specific models in waterline.

*Adapters* - Required

    - The adapters refer to the connection adapters; this is required and while seeming redundant it is required to run waterline

*Connections* - Required

    - The connection attributes are the setting parameters for the data models to create the waterline.
*Methods* - Optional

     - The methods attribute allows the injection of functions for virtual methods inside the model. An example of such an injection would something like this:

Methods Example:

     var methods = {
         history: function(){
         //virtual methods specific to the history model
         },
         comments: function(){
         //virtual methods specific to the comments model
         }
    };

## Notes
    - Sails Cassandra fails the next time it's initialized because it attempts to over-ride; restart the service again until the actual sails-cassandra has been fixed

## Debug
    - DEBUG=koa-waterline node --harmony example.js

## Authors

  - [Peter A Tariche](https://github.com/ptariche)

# License

  MIT
