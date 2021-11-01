'use strict'

const Select = require('../src/select')
const Create = require('../src/create')
const Update = require('../src/update')
const Delete = require('../src/delete')

const seneca = require('seneca')()

seneca.use(Select)
seneca.use(Create)
seneca.use(Update)
seneca.use(Delete)

seneca.listen({
  type: process.env.USER_PROTOCOL || 'http',
  host: process.env.USER_HOST || '0.0.0.0',
  port: process.env.USER_PORT || process.env.PORT || 8202,
  pin: { role: 'user', cmd: '*' }
})

seneca.client({
  type: process.env.AUTH_PROTOCOL || 'http',
  host: process.env.AUTH_HOST || '0.0.0.0',
  port: process.env.AUTH_PORT || 8201,
  pin: { role: 'auth', cmd: 'encrypt-password' }
})

seneca.ready(() => {
  const { mongoClient } = require('edirectinsure-mongo-client')
  return mongoClient(seneca).catch(() => seneca.close())
})

module.exports = seneca
