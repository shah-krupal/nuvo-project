import express from 'express'
const router = express.Router()
import Review from '../models/review.js'
import sequelize from '../config/database.js';
import { isLoggedin } from '../middleware.js';

router.get('/getreviews/:productid/:pageno', async (req, res) => {  // get all reviews of a product id
    const pageSize = process.env.REVIEWPAGESIZE || 7 ;
    const productId = req.params.productId;
    const currentPage = req.params.pageno || 1; // Default to page 1
    try{
        const reviews = await Review.findAll({
                where: {productId: productId},
                order: [['createdAt', 'DESC']],
                offset: (currentPage-1)*pageSize,
                limit: pageSize
            })
        const numberofreviews = await Review.count({
                where: {productId: productId}
            })

        const numberofpages = Math.ceil(numberofreviews/pageSize) ;
        const hasnextpage = (req.params.pageno < numberofpages) ;

        return res
        .status(200)
        .json(currentPage,
            numberofpages,
            hasnextpage,
            reviews)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/addreview', isLoggedin, async (req, res) => {  // add new review
    try{
        const review = await Review.create(req.body);
        return res
        .status(200)
        .json(review)
    }catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

export default router;