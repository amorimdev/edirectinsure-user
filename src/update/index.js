'use strict'

const role = 'user'
const { user } = require('edirectinsure-mongo-client/models')
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

module.exports = function Update () {
  const seneca = this

  seneca.add({ role, cmd: 'update' }, cmdUpdate)

  async function cmdUpdate (args, done) {
    const params = pick(args, PICK_FIELDS)
    params.updatedAt = new Date()

    return selectUser(params)
      .then(params => encryptPassword(params))
      .then(params => updateUser(params))
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
        if (!params.email) {
          return resolve(params)
        }

        const pattern = defineSelectUserPattern()
        const payload = defineSelectUserPayload(params)
        return seneca.act(pattern, payload, (err, response) => {
          if (err) {
            seneca.log.fatal(LOG_TAG, err)
            return reject(err)
          }

          if (response.result &&
            response.result._id !== params._id) {
            return reject(new Error('Email already exists'))
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
        if (!params.password) {
          return resolve(params)
        }

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

  function updateUser (params) {
    return new Promise((resolve, reject) => {
      user.findOneAndUpdate(pick(params, [ '_id' ]), {
        $set: omit(params, [ '_id' ])
      }, (err, entity) => {
        if (err) {
          seneca.log.fatal(LOG_TAG, err.message || err)
          return reject(err)
        }

        if (!entity) {
          return reject(new Error('User not found'))
        }

        entity = { ...entity.toObject(), ...params }
        seneca.log.info(LOG_TAG, { entity })
        return resolve(entity && omit(entity, [ 'password' ]))
      })
    })
  }

  return {
    name: role
  }
}
