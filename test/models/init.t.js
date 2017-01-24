'use strict';

let mocha = require('mocha');
let como = require('co-mocha');
const request = require('request');
const assert = require('assert');
const couchdb_url = 'http://localhost:5984/';
const users_tbl = 'users_wkoa_test';

como(mocha);

//Erlang init:restart()
function startCouch (done) {
  request.post(`${couchdb_url}_restart`, function (e, r) {
    if (e) {
      console.log('problem restarting couch');
      throw e;
    } else {
      cleanCouch(done);
    }
  });
}

function cleanCouch (done) {
  request.del(couchdb_url + users_tbl, done);
}

function queryCouch (model, query) {
  request.get(couchdb_url + model, function (err, resp) {
    if (err) throw err;
    return query(JSON.parse(resp.body));
  });
}

describe('Instantiation', function () {
  before(function (done) {
    startCouch(done);
  });

  let Waterline = require('../..');

  let models = {
    users_wkoa_test: {
      model: true,
      adp: 'couch',
      connection: 'couch',
      properties: {
        activated: {
          type: 'boolean',
          defaultValue: false
        },
        verified: {
          type: 'boolean',
          defaultValue: false
        },
        verified_on: {
          type: 'string',
          defaultValue: 'timestamp'
        }
      }
    }
  };

  let injection = {
    methods: false,
    models: models,
    connections: {
      couch: {
        adapter: 'couch',
        host: '127.0.0.1',
        port: '5984',
        username: '',
        password: ''
      }
    },
    adapters: {
      couch: require('sails-couchdb-orm')
    }
  };


  describe('#init()', function () {
    let waterline, user_definition;

    it('should initialize successfully', function * () {
      assert(waterline = yield Waterline.init(injection), 'initialized');
    });

    it('should create connections', function (done) {
      queryCouch(users_tbl, function (body) {
        assert(body.doc_count == 0, 'test db cleared');
        assert(body.db_name == users_tbl, 'test db created');
        done();
      });
    });

    it('should create a collection with given schema', function (done) {
      assert(~waterline.connections.couch._collections.indexOf(users_tbl));
      waterline.connections.couch._adapter.describe(null, users_tbl, function (err, def) {
        assert(!err && (user_definition = def));
        assert(user_definition.activated.defaultsTo == false);
        done();
      });
    });

    it('should fill in default values', function * () {
      let user = yield waterline.collections[users_tbl].create();
      assert((user.verified === false), 'Default value created');
      assert((Date.parse(user.verified_on)), 'Default timestamp created');
    });
  });
});
