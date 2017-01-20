let mocha = require('mocha')
let como = require('co-mocha')
const request = require('request')
const assert = require('assert')

como(mocha)

function startCouch (done) {
  //Erlang init:restart()
  request.post('http://localhost:5984/_restart', function (e, r) {
    if (e) {
      console.log('problem restarting couch')
      throw e
    } else {
      done()
    }
  })
}

describe('Instantiation', function () {
    before(function (done) {
      startCouch(done)
    })

    let Waterline = require('../..')

    let models = {
        users: {
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
    }

    let injection = {
        methods: false,
        models: models,
        connections: {
            couch: {
                adapter: "couch",
                host: '127.0.0.1',
                port: '5984',
                username: '',
                password: ''
            }
        },
        adapters: {
            couch: require('sails-couchdb-orm')
        }
    }


    describe('#init()', function () {
      let waterline, user_definition;

      it('should initialize successfully', function* () {
        assert(waterline = yield Waterline.init(injection), 'initialized')
      })

      it('should create connections', function* () {
      })

      it('should create a collection with given schema', function* (done) {
        assert(~waterline.connections.couch._collections.indexOf('users'))
        waterline.connections.couch._adapter.describe(null, 'users', function (err, def) {
          assert(!err && (user_definition = def))
          assert(user_definition.activated.defaultsTo == false)
          done()
        })
      })

      it('should fill in default values', function* () {
        let user = yield waterline.collections.users.create()
        assert((user.verified === false), 'Default value created')
        assert((Date.parse(user.verified_on)), 'Default timestamp created')
      })
    })
})
