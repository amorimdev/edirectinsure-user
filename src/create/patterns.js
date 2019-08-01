'use strict'

module.exports.defineSelectUserPattern = () =>
  ({ role: 'user', cmd: 'select' })

module.exports.defineEncryptPasswordPattern = () =>
  ({ role: 'auth', cmd: 'encrypt-password' })
