import express from 'express'
const router = express.Router()
import Category from '../models/category.js'
import {isLoggedin} from '../middleware.js'

router.post('/addcategory', async (req, res) => {  // add new category
    try{
        console.log(req.body)
        const category = await Category.create(req.body)
        return res
        .status(200)
        .json(category)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/getcategories', async (req, res) => {  // get all categories
    try{
        const categories = await Category.findAll()
        return res
        .status(200)
        .json(categories)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/getpreferredcategory', async (req, res) => {  // get all preferred categories. preferred is a boolean field
    try{
        const categories = await Category.findAll({
            where: {
                preferred: true
            }
        })
        return res
        .status(200)
        .json(categories)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

// need to check on this!!!!
router.patch('/updatecategory/:id', async (req, res) => {  // update category preferred status
    try{
        const isPreferred = req.body.preferred ;
        const category = await Category.findByPk(req.params.id)
        await category.update(req.body)
        await Category.update({preferred: isPreferred}, {
            where: {
                categoryId:req.params.id
            }
        }) 
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});



export default router