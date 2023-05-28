const Datastore = require("nedb");
const mutex = require("./mutex");
const path = require('path');
const {getProjectDirectory} = require('../tools');

// abstract Database class
class Database {
    constructor(path, validDataFormat) {
        /*
        singleton constructor
        path: string with the path to the database file
        validDataFormat: object with the information of the database (rows as keys and type as value)
        */
        if (new.target === Database) {  //throw an error when Database constructor is called directly
            throw new Error('Cannot instantiate abstract class Database');
        }

        if (!Database.instance) {   //create a new database instance if there is none
            Database.mutex = new mutex();   //create new mutes
            Database.validDataFormat = validDataFormat;
            Database.database = new Datastore({"filename": path, "autoload": true, "timestampData":true});    //connect to database
            Database.instance = this;
        }

        return Database.instance;
    }

    async insert(rawData) {
        /*
        insert object into the database
        param rawData: the object to be inserted
        return resolve(): after the data has been inserted
        return reject(errorMessage): if there was an error with the data
         */
        return new Promise((resolve, reject) => {
            let check = this.checkData(rawData);
            if (check !== "") {
                reject(check);
                return;
            }
            Database.mutex.acquire().then(() => {
                Database.database.insert(rawData);
                Database.database.loadDatabase();
                Database.mutex.release();
                resolve();
            });
        })
    }

    async find(searchDict) {
        /*
        get all values matching the searchDict from the database
        param searchDict: object with the search params
        return promise(array): all objects found that matches the searchDict
        return reject(err):  if the database access failed
         */
        return new Promise((resolve, reject) => {
            Database.mutex.acquire().then(() => {
                Database.database.loadDatabase();
                Database.database.find(searchDict, function(err, docs) {
                    Database.mutex.release();
                    if (err) reject(err);
                    resolve(docs);
                });
            })
        })
    }

    async findOne(searchDict) {
        /*
        same as find, but only returns the first ´matching object
        param searchDict: object with the search params
        return promise(object): the first object found that matches the searchDict
        return reject(err): if the database access failed
         */
        return new Promise((resolve, reject) => {
            Database.mutex.acquire().then(() => {
                Database.database.loadDatabase();
                Database.database.findOne(searchDict, function(err, docs) {
                    Database.mutex.release();
                    if (err) reject(err);
                    resolve(docs);
                })
            })
        })
    }

    async update(searchDict, updateDict, options) {
        /*
        updates values from the database
        param searchDict: object with the search params
        param updateDict: object with the data that should be updated
        param options: optional parameters for the update
        return resolve(Number):  amount of the objects updated
        return reject(err): if the database update failed
         */
        for (let key in Object.keys(searchDict)) {
            if (!Object.keys(Database.validDataFormat).includes(key)) {
                throw new Error("database row \"" + key + "\" does not exist");
            }
        }
        return new Promise((resolve, reject) => {
            Database.mutex.acquire().then(() => {
                Database.database.update(searchDict, updateDict, options, function(err, numReplaced) {
                    Database.database.loadDatabase();
                    Database.mutex.release();
                    if (err) reject(err);
                    resolve(numReplaced);
                })
            })
        })
    }

    async remove(searchDict, options) {
        /*
        remove object from the database
        param searchDict: object with the search params
        param options: optional parameters for the removal
        return resolve(Number): amount of lines deleted
        return reject(erro): if the removal failed
         */
        return new Promise((resolve, reject) => {
            Database.mutex.acquire().then(() => {
                Database.database.remove(searchDict, options, function (err, numRemoved) {
                    Database.database.loadDatabase();
                    Database.mutex.release();
                    if (err) reject(err);
                    resolve(numRemoved);
                })
            })
        })
    }

    checkData(checkData) {
        /*
        this function checks if the data fulfills the requirements to be inserted into the database.
        No missing or extra rows and the values are what is expected
        param checkData: the data to be checked for the requirements
        return: str with the error message. The string is empty if it fulfills all requirements
         */

        //check if the amount of keys matches with teh validDataFormat
        let dataKeysAmount = Object.keys(checkData).length;
        let expectedKeysAmount = Object.keys(Database.validDataFormat).length;
        if (dataKeysAmount !== expectedKeysAmount) {
            return `expected ${expectedKeysAmount} keys, but got ${dataKeysAmount} keys`
        }

        //check if each value is in rawData
        let dataKeys = Object.keys(checkData);
        for (let key of Object.keys(Database.validDataFormat)) {
            if (!dataKeys.includes(key)) {
                return `key "${key}" is not defined`
            }


            if (Database.validDataFormat[key].startsWith("array")) {//check if the value for this key should be an array
                //check if value for the key of the given object is an array
                if (!Array.isArray(checkData[key])) {
                    return `The value "${checkData[key]}" of the key "${key}" should be an array, but it is of type ${typeof checkData[key]}`
                }

                //get the type that should be inside the array
                let expectedType = Database.validDataFormat[key].split("(")[1].slice(0, -1);
                for (let index in checkData[key]) { //check all elements in the array if they match the expected type
                    if (!(typeof checkData[key][index] === expectedType)) {
                        return `The value "${checkData[key][index]}" (index: ${index}) of the key "${key}" should be of type ${expectedType}, but it is of type ${typeof checkData[key]}`
                    }
                }
            }else if (Database.validDataFormat[key].startsWith("object")) {
                //check if value for the key of the given object is an object
                if (!(typeof checkData[key] === 'object') || checkData[key] === null) {
                    return `The value "${checkData[key]}" of the key "${key}" should be of type object, but it is of type ${typeof checkData[key]}`
                }

                //get the type that should be inside the array
                let expectedType = Database.validDataFormat[key].split("(")[1].slice(0, -1);
                let tempArray = expectedType.split(",")
                let expectedKey = tempArray[0];
                let expectedValue = tempArray[1];
                for (let index in Object.keys(checkData[key])) { //check all elements in the array if they match the expected type
                    let objectKey = Object.keys(checkData[key])[index];
                    if (!(typeof objectKey === expectedKey)) {
                        return `In key "${key}": The key "${objectKey}" should be of type ${expectedKey}, but is of type ${typeof objectKey}`
                    }else if (!(typeof checkData[key][objectKey] === expectedValue)) {
                        return `In key "${key}": The value "${checkData[key][objectKey]}" of the key "${objectKey}" should be of type ${expectedValue}, but is of type ${typeof checkData[key][objectKey]}`
                    }
                }

            }else if (!(typeof checkData[key] === Database.validDataFormat[key])) {
                return `The value "${checkData[key]}" of the key "${key}" should be of type ${Database.validDataFormat[key]}, but is of type ${typeof checkData[key]}`
            }
        }
        return "";
    }
}

class recipeDB extends Database {   //class for the recipe database
    constructor() {
        const temp = {
            "title":"string", "method":"array(string)", "ingredients":"object(string,number)"
            ,"creator":"string", "nutrition":"object(string,number)", "tags":"array(string)", "ratingStars":"number"
            ,"ratingAmount":"number", "comments":"number"};
        super(path.join(getProjectDirectory(), 'resources/database/recipe.db'), temp);
    }
}

class userDB extends Database {
    constructor() {
        const temp = {
            "username": "string", "password": "string", "postedRecipes": "array(string)"
            ,"showNutritionValue":"boolean"};
        super(path.join(getProjectDirectory(), 'resources/database/user.db'), temp);
    }
}

class ratingDB extends Database {
    constructor() {
        const temp = {"userID":"string", "ratingStar":"number"};
        super(path.join(getProjectDirectory(), 'resources/database/ratings.db'), temp);
    }
}

class commentsDB extends Database {
    constructor() {
        const temp = {"recipeID":"string", "userID":"string", "comment":"string"};
        super(path.join(getProjectDirectory(), 'resources/database/comments.db'), temp);
    }
}

module.exports = {"recipe":recipeDB, "user":userDB, "rating":ratingDB, "comments":commentsDB};

//c = new commentsDB();
//c.insert({"recipeID":"HNZe0IX8nSJbDxw6", "userID":"asdf", "comment":"This is a comment too"}).catch((err) => {console.log(err)})


d = new recipeDB();


d.insert({'title':'testTitle', 'method':["step1", "step2"], "ingredients":{"lemon":1, "apple":4}
    ,'creator':'ASDF', 'nutrition':{"first":2, "second":34}, "tags":["tag1", "tag2"], 'ratingStars':9.7
    ,'ratingAmount':34, 'comments':234}).then(resolve => {
    console.log("DONE");
}).catch((err) => {
    console.log(err);
})
console.log();

/*
d.find({'test':'data'}).then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
})
*/

/*
d.update({'test': 'data'}, {'$set':{'test':'asdf'}}, {}).then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
});
*/

/*
d.remove({'test':"asdf"}, {}).then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
})
*/

//d.checkData({"title": "test", "rating":55}).then(resolve => console.log(resolve));
