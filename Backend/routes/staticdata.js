import express from 'express';
const router = express.Router();
import { isAdmin } from '../middleware';

const defaultBanner = "Welcome to AI Product Hunt!!" ;
let banner = defaultBanner; 

router.get('/getbanner', async (req, res) => {  // get banner
    try{
        return res
        .status(200)
        .json(banner)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/setbanner', isAdmin, async (req, res) => {  // set banner
    try{
        banner = req.body.banner;
        return res
        .status(200)
        .json(banner)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

router.post('/resetbanner', isAdmin, async (req, res) => {  // reset banner
    try{
        banner = defaultBanner;
        return res
        .status(200)
        .json(banner)
    }
    catch(err){
        return res
        .status(400)
        .json({message: err.message})
    }
});

export default router;