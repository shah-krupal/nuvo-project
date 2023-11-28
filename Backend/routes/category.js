import express from 'express'
const router = express.Router()
import Category from '../models/category.js'
import { isAdmin } from '../middleware.js'

router.post('/addcategory',isAdmin, async (req, res) => {  // add new category
    try{
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
// { Structure of input object
//     "categoryId": 1,
//     "isPreferred": TRUE
// }
router.patch('/updatepreferredcategory', isAdmin,async (req, res) => {  // update category preferred status
    try{
        const id = req.body.categoryId;
        const isPreferred = req.body.preferred ;
        const result = await Category.update({preferred: isPreferred}, {
            where: {
                categoryId:id
            }
        }) 
        if(result[0] == 0)
        {
            return res
            .status(400)
            .json({message: "Category not found"})
        }
        return res
        .status(200)
        .json({message: "Category updated"})
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});


// put in any number of fields you want to update in category
router.patch("/updatecategory", isAdmin, async (req, res) => {  // update category
    try{
        const id = req.body.categoryId;
        if(!id)
        {
            throw error("Category id not provided")
        }
        const oldObject = await Category.findOne({
            where: {
                categoryId:id
            }
        })
        if(!oldObject)
        {
            return res
            .status(400)
            .json({message: "Category not found"})
        }
        const mergedObject = {...oldObject, ...req.body}
        mergedObject.categoryId = id;       // For safety reasons to not change id by mistake
        const result = await Category.update(mergedObject, {
            where: {
                categoryId:id
            }
        })
        if(result[0] == 0)
        {
            return res
            .status(400)
            .json({message: "Category not found"})
        }
        return res
        .status(200)
        .json({message: "Category updated"})
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/deletecategory', isAdmin, async (req, res) => {  // delete category
    try{
        const id = req.body.categoryId;
        const result = await Category.destroy({
            where: {
                categoryId:id
            }
        })
        if(result == 0)
        {
            return res
            .status(400)
            .json({message: "Category not found"})
        }
        return res
        .status(200)
        .json({message: `Category ${result.categoryName} deleted`})
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});


export default router