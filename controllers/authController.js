const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
exports.signUp = async (req, res) =>{
    const {username , password} = req.body;
    try{
        const hashpassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
        username,
        password : hashpassword
        });
        req.session.user = newUser;
        return res.status(201).json({
            status : "success",
            data : {
                user : newUser
            }
        })
    }
    catch(e){
        res.status(400).json(e);
    }
}

exports.login = async (req, res) =>{
    const {username , password} = req.body;
    try{
        const hashpassword = await bcrypt.hash(password, 12);
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({
                status : 'fail',
                message : 'user not found'
            })
        }
        const isCorrect = await bcrypt.compare(password, user.password);
        if(!isCorrect){
            return res.status(400).json({
                status : 'fail',
                message : 'incorrect password or username'
            })
        }
        req.session.user = user;

        return res.status(201).json({
            status : "success",
            data : {
                user 
            }
        });
    }
    catch(e){
        res.status(400).json(e);
    }
}