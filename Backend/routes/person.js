import express from 'express'
const router = express.Router()
import Person from '../models/person.js'

router.get('/', async (req, res) => {
    const persons = await Person.findAll()
    res.json(persons)
}
)

export default router
