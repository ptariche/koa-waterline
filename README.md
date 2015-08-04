# koa-waterline
  Middleware for your hose
  
  
[![NPM](https://nodei.co/npm/koa-waterline.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koa-waterline/) [![NPM](https://nodei.co/npm-dl/koa-waterline.png?months=6&height=3)](https://nodei.co/npm/koa-waterline/)



    npm install koa-waterline

## Usage

    //see example.js

    function* (){
      var ctx            = this;
      var message        = 'This is an example';
      var commentCreated = yield ctx._waterline.collections.comments.create({message: message});
      // You can yield to the CRUD waterline functions because they are written as promises.
      console.log(commentCreated);
    }

    // OR

    function* () {
      var waterline      = Waterline.init(injection);
      var message        = 'This is an example';
      var commentCreated = yield waterline.collections.comments.create({message: message});
    }

   * The model attributes of connection and adp must match the connection and adapter naming conventions when setting up your environment to inject into the middleware.

## Example

    var connections= {
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
      }
    };

    var adapters= {
      couch: require('sails-couchdb-orm'),
      mongo: require('sails-mongo')
    };

    var models = {
      "comments": {
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
        "adp": "mongo",
        "connection": "mongo",
        "properties": {
          "activity_id": {
            "type": "number",
            "enum": [
                "unique"
            ]
          }
        }
      }
    };

    var injection               = {};
    injection.methods           = false;
    injection.models            = models;
    injection.adapters          = adapters;
    injection.connections       = connections

    app.use(waterline(injection));


##Attributes
*Models* - Required

    - Models must have an adp, connection, and the properties attributes with the same design pattern in the example above.

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

## Authors

  - [Peter A Tariche](https://github.com/ptariche)

# License

  MIT

