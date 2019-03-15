import mongoose from 'mongoose'
import config from '../config'

export const connect = (dbUrl = config.dbUrl, opts = {}) => {
  return (
    mongoose
      .connect(config.dbUrl, {
        ...opts,
        useNewUrlParser: true
      })
      // need to remove this
      .then(() => {
        if (config.isDev) mongoose.connection.db.dropDatabase()
      })
  )
}
