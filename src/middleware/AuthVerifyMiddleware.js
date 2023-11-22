// const jwt = require('jsonwebtoken');
// module.exports=(req,res,next)=>{
//     let Token=req.headers['token'];
//     jwt.verify(Token,"ABC-123",function (err,decoded) {
//         if(err){
//             console.log(Token)
//             res.status(401).json({status:"unauthorized"})
//         }
//         else {
//             let email=decoded['data'];
//             // console.log(email)
//             req.headers.email=email //It will auto set the email into the header
//             next();
//         }
//     })
// }


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers['token'];

  jwt.verify(token, "ABC-123", function (err, decoded) {
    if (err) {
      console.log(token);
      res.status(401).json({ status: "unauthorized" });
    } else {
      let email = decoded['data'];
      req.headers.email = email; // It will auto-set the email into the header
      next();
    }
  });
};
