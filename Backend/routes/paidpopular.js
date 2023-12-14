import express from 'express'
const router = express.Router()
import Paidpopular from '../models/paidpopular.js'
import sequelize from '../config/database.js';
import { isAdmin } from '../middleware.js';

router.get('/allpaidpopular', async (req, res) => {
        try{
        const paidpopulars = await Paidpopular.findAndCountAll()
        return res
        .status(200)
        .json(paidpopulars)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/:id', async (req, res) => {
    try{
        const paidpopular = await Paidpopular.findByPk(req.params.id)
        return res
        .status(200)
        .json(paidpopular)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/createpaidpopular', isAdmin, async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const paidpopular = await Paidpopular.findOne({where:{displayName:req.body.displayName},transaction})
        if(paidpopular){
            throw new Error('Paidpopular already exists');
        }
        const newPaidpopular = await Paidpopular.create(req.body,{transaction})
        await transaction.commit();
        return res
        .status(200)
        .json(newPaidpopular)
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

router.post('/updatepaidpopular', isAdmin, async (req, res) => {
    const transaction = await sequelize.transaction();
    try{
        const paidpopular = await Paidpopular.findByPk(req.body.id,{transaction})
        if(!paidpopular){
            throw new Error('Paidpopular does not exist');
        }
        const updatedPaidpopular = await Paidpopular.update(req.body,{where:{id:req.body.id},transaction})
        await transaction.commit();
        return res
        .status(200)
        .json(updatedPaidpopular)
    }
    catch (err) {
        await transaction.rollback();
        return res
        .status(500)
        .json({ message: err.message });
      }
});

router.delete('/deletepaidpopular/:id', isAdmin, async (req, res) => {
    try{
        const id = req.params.id;
        const deletedPaidpopular = await Paidpopular.destroy({where:{id}})
        if(deletedPaidpopular === 0){
            throw new Error('Paidpopular could not be deleted');
        }
        return res
        .status(200)
        .json(deletedPaidpopular)
    }catch(err){
        return res
        .status(500)
        .json({ message: err.message });
    }
});

export default router;
