'use strict';

let koa       = require('koa');
let waterline = require('./lib/koa-waterline.js');

const APP = koa();

let connections = {
  mongo: {
    adapter: 'mongo',
    host: 'localhost',
    port: '27017',
    user: '',
    password: '',
    database: 'waterline'
  }
};

let adapters = {
  // couch:     require('sails-couchdb-orm'),
  mongo:     require('sails-mongo'),
  // cassandra: require('sails-cassandra')
};

let models = {
  // comments: {
  //     model: true,
  //     adp: 'couch',
  //     connection: 'couch',
  //     properties: {
  //       archived: {
  //         type: 'boolean',
  //         defaultValue: false
  //       },
  //       message: {
  //         type: 'string'
  //       }
  //     }
  //   },
  history: {
      model: true,
      adp: 'mongo',
      connection: 'mongo',
      properties: {
        year: {
          lowercase: true,
          type: 'string'
        }
      }
    },
  // tweet: {
  //     adp: 'cassandra',
  //     connection: 'cassandra',
  //     index: ['tweet_body'],
  //     properties: {
  //       tweet_body: {
  //         type: 'string'
  //       }
  //     }
  //   },
  error: {
      model: false,
      properties: {
        erro: {
          type: 'string'
        }
      }
    }
};

let injection               = {};
injection.methods           = false;
injection.models            = models;
injection.adapters          = adapters;
injection.connections       = connections;

APP.use(waterline(injection));

APP.use(function * () {
  let ctx            = this;
  // let message        = 'This is an example';
  // let commentCreated = yield ctx._waterline.collections.comments.create({message: message});
  // // You can yield to the CRUD waterline functions because they are written as promises.
  // console.log(commentCreated);

  let year           = '1976';
  let createHistory  = yield ctx._waterline.collections.history.create({year: year});
  console.log(createHistory);
  //
  // let new_tweet     = 'this is my example tweet!';
  // let createTweet   = yield ctx._waterline.collections.tweet.create({tweet_body: new_tweet});
  // console.log(createTweet);

});

APP.listen(1337);
