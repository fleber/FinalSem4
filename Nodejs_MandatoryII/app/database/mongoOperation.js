const mongo = require("mongodb").MongoClient;

const path = "mongodb://localhost:27017/node1";

exports.createUser = function(newUser){
    mongo.connect(path, function(err, db){
        if(err){
            console.log("connection err when creare:\n ", err)
        }
    
        let collection = db.collection("mandatoryII");
        
        collection.insert(newUser, function(err, success){
            if(err){
                console.log("can't create user: ", err);
            }
            else{
                console.log(newUser.userName + "is added to database");
            }
        });

        db.close();
    });

}

exports.deleteUser = function(user){
    mongo.connect(path, function(err, db){
        if(err){
            console.log("connection err when delete:\n ", err)
        }

        let collection = db.collection("mandatoryII");

        collection.deleteOne(user, function(err, obj){
            if(err){
                console.log("can't delete user", err)
            }else{
                console.log(user.userName + " is deleted");
            }
            db.close();
        });
        
    });
}

exports.findUser = function(user){  
    let existUser;
    mongo.connect(path, function(err, db){
        if(err){
            console.log("DB: connection err when find:\n", err);
        }

        let collection = db.collection("mandatoryII");

        collection.findOne(user, function(err, result){
            if(err){
                console.log("DB: can't find user: ", err)
            //    existUser = false;
            }else{
                if(user.userName === null){
                    console.log("user null");
                    return false;
                }
                console.log("DB: user is found", result);
                if(user.userName === result.userName ){
                    existUser = true;
                }
                else{
                existUser = false;
                }
            }
            return existUser;
        });
        db.close();      
     });
}


