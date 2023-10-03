import express from 'express'
const router = express.Router()
import Paidpopular from '../models/paidpopular.js'
import sequelize from '../config/database.js';

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

router.post('/createpaidpopular', async (req, res) => {
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

export default router;
