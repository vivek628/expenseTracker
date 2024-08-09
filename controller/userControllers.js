const express=require('express')
const bcrypt = require('bcryptjs')

const Sequelize=require('sequelize');
const sequelize=require('../utils/database')
const User= require('../model/user')
const expenses=require('../model/expense')
const path=require('path')
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'
const { where } = require('sequelize');
const { group, error } = require('console');
exports.signup = async (req, res, next) => {
    const Method = req.method;
    
    try {
        if (Method === 'GET') {
            res.sendFile(path.join(__dirname, '../public/views/', 'signup.html'));
        } else {
            const name = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({ name: name, email: email, password: hashedPassword });
            console.log("Data saved successfully");

            
            res.sendFile(path.join(__dirname, '../public/views/', 'signup.html'));
 
          
        }
    } catch (error) {
        console.error("Erruor:", error);
        res.status(500).send("Internal Server Error"); 
    }
};
exports.getLogin = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/views/', 'login.html'));
};
exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password); 
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ error: 'Email does not exist' });
        }

        // Compare password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (result) {
                // Passwords match, generate access token
                const accessToken = generateaccesToken(user.id);
                return res.status(200).json({ token: accessToken });
            } else {
               
                return res.status(401).json({ error: 'Password is incorrect' });
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
    
        
exports.postaddexpense = async (req, res, next) => {
    const t = await sequelize.transaction(); 

    try {
        console.log(req.body);
        const authorizationHeader = req.headers['authorization'];
        const id = await getidfromjwt(authorizationHeader); 
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        
        await expenses.create({
            Amount: amount,
            Description: description,
            Category: category,
            UserId: id
        }, { transaction: t });

       
        const user1 = await User.findOne({ where: { id: id } });

        if (!user1) {
            throw new Error('User not found'); 
        }

        console.log("user1", user1);
        const preamount = user1.totalexpense;
        console.log("preamount is ", preamount);

        const total_amount = Number(amount) + Number(preamount);

        await User.update({ totalexpense: total_amount }, {
            where: { id: id },
            transaction: t 
        });

        
        await t.commit();

       
        res.sendFile(path.join(__dirname, '../public/views/', 'login.html'));

    } catch (E) {
        
        await t.rollback();
        console.error(E);
        res.status(500).json({ success: false, error: E.message });
    }
};

/* const Expenses = await expenses.findAll({
            attributes: [
              'userId',
              [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalExpense']
            ],
            group: ['userId']
          });
          console.log("expense",Expenses)
          for (const expense of Expenses) {
            await User.update(
              { totalexpense:expense.get('totalExpense') },
              { where: { id: expense.get('userId') } }
            );
          }*/
exports.getData = async (req, res, next) => {
    try {
        const pageno=Number(req.query.page)
        const gap=Number(req.query.gap)
        console.log("pageno is ",pageno)
        console.log("gap is",gap)
        const offset=(pageno-1)*gap
        const authorizationHeader = req.headers['authorization'];
        console.log("id",authorizationHeader)
       const id= await getidfromjwt(authorizationHeader)
       console.log(id)

        const data = await expenses.findAll({where:{UserId:id},
        offset:offset,
        limit:gap

    }
            
        );
        const totalItems = await expenses.count({ where: { UserId: id } });
        const totalPages = Math.ceil(totalItems / gap);
        console.log("to",totalPages)
        console.log(data)
        res.json({data:data,totalpage:totalPages}); 

    } catch (e) {
        console.log(e);
       res.status(500).json({ error: 'Internal Server Error' });  
    }
}
exports.getUser=async(req,res,next)=>{
    try{
        const authorizationHeader = req.headers['authorization'];
       // console.log("id",authorizationHeader)
       const id= await getidfromjwt(authorizationHeader)
       //console.log(id)
       const data= await User.findOne({where:{id:id}})
       //Console.log(json)
       res.json(data)
    }
    catch(E){
        console.log(E)
    }
}
function generateaccesToken(id)
{
    return jwt.sign({userId:id},secretKey)
}
function getidfromjwt(id)

{   
    const secretKey = 'your_secret_key'
    const userid= (jwt.verify(id,secretKey))
    return userid.userId
}
exports.getaddexpense=(req,res,next)=>{
    console.log("ji2")
    console.log(req.user)
    res.sendFile(path.join(__dirname, '../public/views/', 'addEpense.html'));
}
exports.getleaderboard=async (req,res,next)=>{
   /* const leaderboardexpesne=await User.findAll(
        {
            attributes:['id','name',[Sequelize.fn('sum',Sequelize.col('expenses.Amount')),'total_coast']],
            include:[
                {
                    model:expenses,
                    attributes:[]
                }
            ],
            group:['user.id'],
            order: [[Sequelize.col('total_coast'), 'DESC']]
        }
        
    )*/
    const usersDescending = await User.findAll({
        attributes:['id','name','totalexpense'],
      order: [['totalexpense', 'DESC']] 
      });

      
     // console.log('Users sorted by age (ascending):', usersDescending.map(user => user.toJSON()));
       //console.log(leaderboardexpesne)
      res.json(usersDescending)

}