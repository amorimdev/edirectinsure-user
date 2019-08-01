'use strict'

module.exports.definePayload = params => ({
  model: 'root',

  method: (params.id || params.email) &&
  'findOne' || 'findAndCountAll',

  options: {
    where: {
      deleted: false,

      ...(params.id &&
        { _id: params.id }
      ),

      ...(params.email &&
        { email: params.email, enabled: true }
      )
    }
  },

  ...(!params.id && params.requestOptions &&
    { requestOptions: params.requestOptions }
  )
})
