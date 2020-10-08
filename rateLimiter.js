const moment = require('moment');
const { users, user_logs } = require("./models");


module.exports = async (req,res,next) => {
    users.find({api_key:req.query.api_key}, async (err,response) => {
    if(err) {
      console.log("user not found")
    //  .exit(0)
    }
    if(response.length !== 0) {
        let [usersFindResponse] = response;
        const {MAX_REQUEST_COUNT} = usersFindResponse

        if(MAX_REQUEST_COUNT === 0) {
            return res.status(400).send({
                success: false,
                message: "Limit exceeded",
                data: {MAX_REQUEST_COUNT}
            })
        }
        let userLogsData = await user_logs.find({api_key: req.query.api_key}, async (err, doc) => {
            if(!err) {
                user_logs.findOneAndUpdate({api_key: req.query.api_key}, {$inc: {REQUEST_COUNT: 1}}, (err, userLogsResponse) => {
                    console.log(userLogsResponse);
                    if(!err){
                        users.findOneAndUpdate({api_key: req.query.api_key}, {$inc: {MAX_REQUEST_COUNT: -1}}, (err, response) => {
                            if(err){
                                console.error(err);
                            }

                            return res.status(200).send({
                                success: true,
                                data: response
                            })
                        })
                    }
                })
                let [data] = doc
                return data

            } else {
                throw new Error(err);
            }
        });
    
    } else {
        let newUsersDoc  = {
            api_key: req.query.api_key,
            MAX_REQUEST_COUNT: 25
        }
        let newUser = new users(newUsersDoc);
        newUser.save(saveErr => {
            console.log(saveErr);
            if(!saveErr){
                let newUserLogsDoc = {
                    api_key: req.query.api_key,
                    REQUEST_COUNT: 1,
                    REQUEST_START_TIME: moment().unix()
                }
                let newUserLogs = new user_logs(newUserLogsDoc);
                newUserLogs.save((err, response) => {
                    if(err){
                        throw new Error(err);
                    }
                })
            } else {
                console.error(saveErr);
            }
        })
    }
  })
}