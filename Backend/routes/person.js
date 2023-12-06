import express from 'express'
const router = express.Router()
import Person from '../models/person.js'
import sequelize from '../config/database.js';
import { isAdmin, isLoggedin } from '../middleware.js';

router.get('/allperson', async (req, res) => {
        try{
        const persons = await Person.findAndCountAll()
        return res
        .status(200)
        .json(persons)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/:id', async (req, res) => {
    try{
        const person = await Person.findByPk(req.params.id)
        return res
        .status(200)
        .json(person)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/createperson', isLoggedin, async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const person = await Person.findOne({where:{email:req.body.email},transaction})
        if(person){
            throw new Error('Person already exists');
        }
        const newPerson = await Person.create(req.body,{transaction})
        await transaction.commit();
        return res
        .status(200)
        .json(newPerson)
    }
    catch (err) {
        await transaction.rollback();
        if (err.name === 'SequelizeUniqueConstraintError') {
          return res
          .status(409)
          .json({ message: 'Email already exists' });
        } else {
          return res
          .status(500)
          .json({ message: err.message });
        }
      }
});

router.delete('/deleteperson/:id', isLoggedin, async (req, res) => {
    try{
        const person = await Person.findByPk(req.params.id)
        await person.destroy()
        return res
        .status(200)
        .json(person)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/updateperson', isAdmin, async (req, res) => {
    try{
        const person = await Person.findByPk(req.body.personId)
        if(!person){
            throw new Error('Person does not exist');
        }
        const updatedPerson = await Person.update(req.body,{where:{personId:req.body.personId}})
        return res
        .status(200)
        .json(updatedPerson)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});



export default router
