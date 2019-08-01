/* eslint-env mocha */
/* eslint no-debugger: off */

const { expect } = require('chai')
const { Seneca } = require('./helpers')

const Mock = require('./mock/select')
const { getId } = require('./mock/user')

describe('User Select Tests', () => {
  let seneca = null

  before(done => {
    Seneca()
      .then(instance => {
        seneca = instance
        return done(null)
      })
      .catch(done)
  })

  beforeEach(() => { debugger })

  it('Expect seneca instance not equal to null', done => {
    try {
      expect(seneca).not.to.equal(null)
      done(null)
    } catch (err) {
      done(err)
    }
  })

  it('Expect to select all user', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.all
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(true)
        expect(Array.isArray(response.result)).to.be.equal(true)
        expect(response.result.length).to.be.at.least(1)
        expect(typeof response.result[0]).to.be.equal('object')
        expect(typeof response.result[0]._id).to.be.equal('string')
        expect(typeof response.result[0].name).to.be.equal('string')
        expect(typeof response.result[0].email).to.be.equal('string')
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to not select one user because user not found', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.notFound
      const expectMessageError = 'User not found'
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(false)
        expect(response.message).to.be.equal(expectMessageError)
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })

  it('Expect to select one user', done => {
    try {
      const pattern = Mock.pattern
      const payload = Mock.payload.one(getId())
      seneca.act(pattern, payload, (err, response) => {
        if (err) {
          return done(err)
        }

        expect(typeof response).to.be.equal('object')
        expect(response.status).to.be.equal(true)
        expect(typeof response.result).to.be.equal('object')
        expect(typeof response.result._id).to.be.equal('string')
        expect(typeof response.result.name).to.be.equal('string')
        expect(typeof response.result.email).to.be.equal('string')
        done(null)
      })
    } catch (err) {
      done(err)
    }
  })
})
