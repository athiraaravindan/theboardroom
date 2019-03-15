var express = require('express');
var router = express.Router();
var userServ = require('../service/user.service')

const bcrypt = require('bcrypt');
const saltRounds = process.env.saltRounds

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
// router.post('/getuser', async function (req, res, next) {
//   console.log(req.body)
//   let user = await userServ.getUser({ _id: req.body.uid });
//   console.log(user)
//   if (user)
//     res.json({ success: 1, response: user })
//   else
//     res.json({ success: 0, response: null })
// });

router.post('/updateUser', async function (req, res, next) {
  // let user = await userServ.updateUser(req.body);
  console.log(req.body)
  try{
    userServ.updateUser({
      _id:req.body._id
    },{
      $set: 
      { name: req.body.name,
        emailAddress: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
        company_size: req.body.company_size,
        country: req.body.country,
        time_zone: req.body.time_zone
       } 
    }).then((_doc)=>{
      console.log(_doc)
      res.status(200).json({
        success: 1,
        response: "status updated"
      });
    })
  }
  catch(e){
    res.json({res:e})

  }

})
router.post('/updateUserEmail', async function (req, res, next) {
  // let user = await userServ.updateUser(req.body);
  let checkGmail = await userServ.getUser({ emailAddress:req.body.email });

  console.log(req.body,checkGmail)
  
  try{
    if(checkGmail == null){ 
     userServ.updateUser({
      _id:req.body._id
    },{
      $set: 
      { emailAddress: req.body.email
       } 
    }).then((_doc)=>{
      console.log(_doc)
      res.status(200).json({success: 1,response: "email updated"
      });
    })
  }else{
    res.json({success:0,response:"exist"})
  }
  }
  catch(e){
    res.json({res:e})

  }

})

// router.post('/signup', async function (req, res, next) {
//   // res.json({ body: req.body })
//   let user = {
//     emailAddress: req.body.email,
//     name: req.body.fname + ' ' + req.body.lname,
//     password: req.body.password
//   }
//   let checkGmail = await userServ.getUser({ emailAddress: user.emailAddress });
//   // console.log(checkGmail,"checkGmail")
//   if (checkGmail != null) {
//     res.json({success:0, response:"mail exist"})
//   } else{
//     var saveUser = await userServ.createUser(user);
//     if(saveUser)
//     res.json({success:1, response:saveUser})
//   }
//   // let user = await userServ.createUser({ _id: req.body.uid });
//   // if (user)
//   //   res.json({ success: 1, response: user })
//   // else
//   //   res.json({ success: 0, response: null })
// });


// router.post('/login', async function (req, res, next) {
// // console.log(req.body)
// let getUser = await userServ.getUser({ emailAddress: req.body.email,password: req.body.password });
// if(getUser)
// res.json({success:1,response:getUser})
// else
// res.json({success: 0,response:null})

// })

router.post('/updatePassword', async function (req, res, next) {
  console.log(req.body)
  let getUser = await userServ.getUser({ _id: req.body._id});
  let hashNewPassword =  await bcrypt.hashSync(req.body.new_password, parseInt(saltRounds, 10))
  let check = bcrypt.compareSync(req.body.oldPassword, getUser.password); // true

    if(check){

      userServ.updateUser({
        _id:req.body._id
      },{
        $set: 
        {
          password: hashNewPassword
         } 
      }).then((_doc)=>{
        res.status(200).json({
          success: 1,
          response: "password updated"
        });
        console.log("here",_doc)
      }).catch(()=>{
        console.log("here",_doc)

        res.status(400).json({
          success: 0,
          response: "error "
        });
      })
    }else{
      res.status(400).json({
        success: 0,
        response: "error "
      });
    }
  
})


module.exports = router;
