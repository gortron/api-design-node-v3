export const getOne = model => async (req, res) => {
  try {
    const doc = await model.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    })

    if (!doc) return res.status(404).end()

    return res.status(200).json({ data: doc })
  } catch (e) {
    console.log(e)
  }
}

export const getMany = model => async (req, res) => {
  try {
    const docs = await model.find({ createdBy: req.user._id })
    if (!docs) return res.status(404).end()

    return res.status(200).json({ data: docs })
  } catch (e) {
    console.log(e)
  }
}

export const createOne = model => async (req, res) => {
  try {
    const doc = await model.create({ createdBy: req.user._id, ...req.body })
    return res.status(201).json({ data: doc })
  } catch (e) {
    console.log(e)
  }
}

export const updateOne = model => async (req, res) => {
  try {
    const doc = await model.findOneAndUpdate(
      { createdBy: req.user._id, _id: req.params.id },
      req.body,
      { new: true }
    )
    if (!doc) return res.status(400).end()
    return res.status(200).json({ data: doc })
  } catch (e) {
    console.log(e)
  }
}

export const removeOne = model => async (req, res) => {
  try {
    const doc = await model.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id
    })
    if (!doc) return res.status(400).end()
    return res.status(200).json({ data: doc })
  } catch (e) {
    console.log(e)
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model)
})
