import express from 'express'
const router = express.Router()
import Person from '../models/person.js'

router.get('/:id', async (req, res) => {
    try{
        const person = await Person.findByPk(req.params.id)
        return res
        .status(200)
        .json(person)
    }
    catch(err){
        throw new Error('Error getting person');
    }
});

router.post('/addperson', async (req, res) => {
    try{
        const person = await Person.create(req.body)
        return res
        .status(200)
        .json(person)
    }
    catch(err){
        throw new Error('Error adding person');
    }   
});

router.delete('/deleteperson/:id', async (req, res) => {
    try{
        const person = await Person.findByPk(req.params.id)
        await person.destroy()
        return res
        .status(200)
        .json(person)
    }
    catch(err){
        throw new Error('Error deleting person');
    }
});

export default router
