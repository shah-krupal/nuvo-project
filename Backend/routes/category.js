import express from 'express'
const router = express.Router()
import Category from '../models/category.js'

router.post('/addcategory', async (req, res) => {  // add new category
    try{
        const category = await Category.create(req.body)
        return res
        .status(200)
        .json(category)
    }
    catch(err){
        throw new Error('Error adding category '+err.message);
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
        throw new Error('Error getting categories '+err.message);
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
        throw new Error('Error getting categories '+err.message);
    }
});

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
        throw new Error('Error updating category '+err.message);
    }
});
