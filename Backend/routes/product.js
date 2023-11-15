import express from 'express'
const router = express.Router()
import Product from '../models/product.js'
import sequelize from '../config/database.js';
import {Op, Sequelize} from 'sequelize'
import { isAdmin, isLoggedin } from '../middleware.js';
import Person from '../models/person.js'

router.post('/addproduct', isLoggedin, async (req, res) => {  // add new product
    try{
        const product = await Product.create(req.body) ;
        return res
        .status(200)
        .json(product)
    }catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }

    // const transaction = await sequelize.transaction();
    // try{
    //     const product = await Product.findOne({where:{name:req.body.name},transaction})
    //     if(product){
    //         throw new Error('Product already exists');
    //     }
    //     const newProduct = await Product.create(req.body,{transaction})
    //     await transaction.commit(); 
    //     return res
    //     .status(200)
    //     .json(newProduct)
    // }
    // catch (err) {
    //     await transaction.rollback();
    //     if (err.name === 'SequelizeUniqueConstraintError') {
    //       return res
    //       .status(409)
    //       .json({ message: 'Product already exists' });
    //     } else {
    //       return res
    //       .status(500)
    //       .json({ message: err.message });
    //     }
    //   }
});

router.get('/getproducts', async (req, res) => {  // get all products
    try{
        const products = await Product.findAll()
        return res
        .status(200)
        .json(products)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/getproducts/:pageno', async (req, res) => {  // paginated products
    const pageSize = process.env.PRODUCTPAGESIZE || 20 ;
    const currentPage = req.params.pageno || 1; // Default to page 1
    try{
        const products = await Product.findAndCountAll({
                offset: (currentPage-1)*pageSize,
                limit: pageSize
            })
        const numberofproducts = products.count ;

        const numberofpages = Math.ceil(numberofproducts/pageSize) ;
        const hasnextpage = (req.params.pageno < numberofpages) ;

        return res
        .status(200)
        .json({currentPage,
            numberofpages,
            hasnextpage,
            products})
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/searchproduct', async (req, res) => {  // search products by name Search criteria is kept liberal
    const { query } = req.query;
    try{
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.ilike]: `%${query}%`
                        },
                    },
                    {
                        shortDescription: {
                            [Op.ilike]: `%${query}%`
                        }
                    }
                ]
            }
        })
        return res
        .status(200)
        .json(products)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/getproduct/:id', async (req, res) => {  // get product by id
    try{
        await Product.increment('counter', { where: { productId: req.params.id } })
        const product = await Product.findByPk(req.params.id)
        const person = await fetchPersons(product.teamMembers)
        product.teamMembers = person
        return res
        .status(200)
        .json(product)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/productsbycategoryid/:categoryid/:pageno', async (req, res) => {  // get products by categoryid default sort by popularity
    const pageSize = process.env.PRODUCTPAGESIZE || 20 ;
    const categoryId = req.params.categoryid;
    const currentPage = req.params.pageno || 1; // Default to page 1
    try{
        const products = await Product.findAll({
                where: {categoryId: categoryId},
                order: [['counter', 'DESC']],
                offset: (currentPage-1)*pageSize,
                limit: pageSize
            })
        const numberofproducts = await Product.count({
                where: {categoryId: categoryId}
            })

        const numberofpages = Math.ceil(numberofproducts/pageSize) ;
        const hasnextpage = (req.params.pageno < numberofpages) ;

        return res
        .status(200)
        .json(currentPage,  
            numberofpages,
            hasnextpage,
            products)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/productsbycategoryname/:categoryname/:pageno', async (req, res) => {  // get products by category name default sort by popularity
    const {query} = req.query;
    let sortBy = 'counter' // default
    if(query == 'newest'){
        sortBy = 'createdAt'
    }
    const pageSize = process.env.PRODUCTPAGESIZE || 20 ;
    const categoryname = req.params.categoryname;
    const currentPage = req.params.pageno || 1; // Default to page 1
    try{
        const products = await Product.findAndCountAll({
                where: {category: {
                    [Sequelize.Op.contains]:[categoryname]
                }},
                order: [[sortBy, 'DESC']],
                offset: (currentPage-1)*pageSize,
                limit: pageSize
            })
        const numberofproducts = products.count
        const numberofpages = Math.ceil(numberofproducts/pageSize) ;
        console.log(numberofpages)
        const hasnextpage = (req.params.pageno < numberofpages) ;
        console.log(hasnextpage)
        return res
        .status(200)
        .json({currentPage,
            numberofpages,  
            hasnextpage,
            products})
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

const fetchPersons = async (personIds) => {
    try {
      const persons = await Person.findAll({
        where: {
          personId: personIds, // Use personIds array to filter by IDs
        },
      });
      return persons;
    } catch (error) {
      console.error('Error fetching persons:', error);
      throw error;
    }
  };

// Under scrutiny !!!!
router.get('/:productid/team', async (req, res) => {  // get team members of a product
    try{
        const product = await Product.findByPk(req.params.productid)
        const teamMembers = await product.teamMembers ;
        const team = await fetchPersons(teamMembers) ;
        return res
        .status(200)
        .json(team)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});


router.get('/:productid/overview', async (req, res) => {  // get overview of a product
    try{
        const product = await Product.findByPk(req.params.productid)
        const overview = await product.overviews
        return res
        .status(200)
        .json(overview)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.get('/featuredproducts', async (req, res) => {  // get featured products
    try{
        const products = await Product.findAll({
            where: {
                featured: true
            }
        })
        return res
        .status(200)
        .json(products)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/changefeatured', isAdmin, async (req, res) => {  // change featured status of a product 1 for featured 0 for not featured
    try{
        const option = req.body.featured ;
        const id = req.body.productId ;
        const product = await Product.findByPk(id)
        if(option)
            product.featured = true ;
        else
            product.featured = false ;
        await product.save()
        return res
        .status(200)
        .json(product)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});



export default router;

