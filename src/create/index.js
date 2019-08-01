'use strict'

const role = 'user'
const { user } = require('mongo-client/models')
const { pick, omit } = require('lodash')
const { PICK_FIELDS, LOG_TAG } = require('./fields')
const {
  defineSelectUserPattern,
  defineEncryptPasswordPattern
} = require('./patterns')
const {
  defineSelectUserPayload,
  defineEncryptPasswordPayload
} = require('./payloads')

module.exports = function Create () {
  const seneca = this

  seneca.add({ role, cmd: 'create' }, cmdCreate)

  async function cmdCreate (args, done) {
    const params = pick(args, PICK_FIELDS)

    if (Object.keys(params).length !== 3) {
      return done(null, {
        status: false,
        message: 'Invalid arguments'
      })
    }

    return selectUser(params)
      .then(params => encryptPassword(params))
      .then(params => createUser(params))
      .then(result => done(null, {
        status: true,
        result
      }))
      .catch(err => done(null, {
        status: false,
        message: err && err.message || err
      }))
  }

  function selectUser (params) {
    return new Promise((resolve, reject) => {
      try {
        const pattern = defineSelectUserPattern()
        const payload = defineSelectUserPayload(params)
        return seneca.act(pattern, payload, (err, response) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err)
            return reject(err)
          }

          if (response.result) {
            return reject(new Error('User already exists'))
          }

          return resolve(params)
        })
      } catch (err) {
        seneca.log.fatal(LOG_TAG, err.message || err)
        return reject(err)
      }
    })
  }

  function encryptPassword (params) {
    return new Promise((resolve, reject) => {
      try {
        const pattern = defineEncryptPasswordPattern()
        const payload = defineEncryptPasswordPayload(params)
        return seneca.act(pattern, payload, (err, response) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err)
            return reject(err)
          }

          if (!response.status || !response.result) {
            seneca.log.error(LOG_TAG, response)
            return reject(response)
          }

          const { result: password } = response
          return resolve({ ...params, password })
        })
      } catch (err) {
        seneca.log.fatal(LOG_TAG, err.message || err)
        return reject(err)
      }
    })
  }

  function createUser (params) {
    return new Promise((resolve, reject) => {
      user.create(params, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        entity = {
          ...entity.toObject(),
          _id: entity._id.toString()
        }

        seneca.log.info(LOG_TAG, { entity })
        return resolve(omit(entity, [ 'password' ]))
      })
    })
  }

  return {
    name: role
  }
}
