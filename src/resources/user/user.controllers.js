import { User } from './user.model'

export const getMany = async (req, res) => {
  const users = await User.find({})
    .lean()
    .exec()

  return res.status(200).json({ data: users })
}

export const createOne = async (req, res) => {
  const user = await User.create({ ...req.body })
  return res.status(200).json({ data: user })
}
