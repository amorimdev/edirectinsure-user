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
  ...((process.env.USER_TRANSPORT === 'amqp' && {
    type: process.env.USER_TRANSPORT,
    url: process.env.AMQP_URL
  }) || {
    type: process.env.USER_TRANSPORT || 'http',
    host: process.env.USER_HOST || '0.0.0.0',
    port: process.env.USER_PORT || process.env.PORT || 8202,
    protocol: process.env.USER_PROTOCOL || 'http'
  }),
  pin: { role: 'user', cmd: '*' }
})

seneca.client({
  ...((process.env.AUTH_TRANSPORT === 'amqp' && {
    type: process.env.AUTH_TRANSPORT,
    url: process.env.AMQP_URL
  }) || {
    type: process.env.AUTH_TRANSPORT || 'http',
    host: process.env.AUTH_HOST || '0.0.0.0',
    port: process.env.AUTH_PORT || 8201,
    protocol: process.env.AUTH_PROTOCOL || 'http'
  }),
  pin: { role: 'auth', cmd: 'encrypt-password' }
})

seneca.ready(() => {
  const { mongoClient } = require('edirectinsure-mongo-client')
  return mongoClient(seneca).catch(() => seneca.close())
})

module.exports = seneca
