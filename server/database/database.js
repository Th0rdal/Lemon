const Datastore = require("nedb");
const mutex = require("./mutex");
const path = require('path');
const {getProjectDirectory} = require('../middleware/formatResponse');

// abstract Database class
class Database {
    static instance = {};
    constructor(name, path, validDataFormat) {
        /*
        singleton constructor
        path: string with the path to the database file
        validDataFormat: object with the information of the database (rows as keys and type as value)
        */
        if (new.target === Database) {  //throw an error when Database constructor is called directly
            throw new Error('Cannot instantiate abstract class Database');
        }

        if (!Database.instance.hasOwnProperty(name)) {   //create a new database instance if there is none
            this.validArrayKeys = ["$set", "$push", "$addToSet", "$pop", "$pull", "$where"]
            this.mutex = new mutex();   //create new mutes
            this.validDataFormat = validDataFormat;
            this.protectedKeys = ["_id", "createdAt", "updatedAt"];
            this.database = new Datastore({"filename": path, "autoload": true, "timestampData":true});    //connect to database
            Database.instance[name] = this;
        }

        return Database.instance[name];
    }

    async insert(rawData) {
        /*
        insert object into the database
        param rawData: the object to be inserted
        return resolve(): after the data has been inserted
        return reject(errorMessage): if there was an error with the data
         */
        return new Promise((resolve, reject) => {
            let check = this.checkInsertData(rawData);
            if (check !== "") {
                reject(check);
                return;
            }
            this.mutex.acquire().then(() => {
                this.database.insert(rawData);
                this.database.loadDatabase();
                this.mutex.release();
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
        return new Promise(async (resolve, reject) => {
            await this.mutex.acquire().then(() => {
                let check = this.checkSearchData(searchDict)
                if (check !== "") {
                    reject(check);
                    return;
                }
                this.database.loadDatabase();
                this.database.find(searchDict, function (err, docs) {
                    if (err) reject(err);
                    resolve(docs);
                });
                this.mutex.release();
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
        return new Promise(async (resolve, reject) => {
            await this.mutex.acquire().then(() => {
                let check = this.checkSearchData(searchDict)
                if (check !== "") {
                    reject(check);
                    return;
                }
                this.database.loadDatabase();
                this.database.findOne(searchDict, function (err, docs) {
                    if (err) reject(err);
                    resolve(docs);
                })
                this.mutex.release();
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
            if (!Object.keys(this.validDataFormat).includes(Object.keys(searchDict)[key]) && !this.protectedKeys.includes(Object.keys(searchDict)[key])) {
                throw new Error("database row \"" + Object.keys(searchDict)[key] + "\" does not exist");
            }
        }
        return new Promise(async (resolve, reject) => {
            await this.mutex.acquire().then(() => {
                let check = this.checkSearchData(searchDict);
                if (check !== "") {
                    reject(check);
                    return;
                }
                check = this.checkUpdateData(updateDict)
                if (check !== "") {
                    reject(check)
                    return;
                }
                this.database.update(searchDict, updateDict, options, function (err, numReplaced) {
                    if (err) reject(err);
                    resolve(numReplaced);
                })
                this.database.loadDatabase();
                this.mutex.release()
            })
        })
    }

    async remove(searchDict, options) {
        /*
        remove object from the database
        param searchDict: object with the search params
        param options: optional parameters for the removal
        return resolve(Number): amount of lines deleted
        return reject(err): if the removal failed
         */
        return new Promise(async (resolve, reject) => {
            await this.mutex.acquire().then(async () => {
                let check = this.checkSearchData(searchDict)
                if (check !== "") {
                    reject(check);
                    return;
                }
                await this.database.remove(searchDict, options, function (err, numRemoved) {
                    if (err) reject(err);
                    resolve(numRemoved);
                })
                this.database.loadDatabase();
                this.mutex.release();
            })
        })
    }

    checkData(checkData, updateOrInsert) {
        /*
        this function checks if the data fulfills the requirements to be inserted into the database.
        No missing or extra rows and the values are what is expected
        param checkData: the data to be checked for the requirements
        return: str with the error message. The string is empty if it fulfills all requirements
         */

        //check if each value is in rawData
        let dataKeys = Object.keys(checkData);
        let validKeys = Object.keys(this.validDataFormat);
        for (let key of dataKeys) {

            if (this.protectedKeys.includes(key) || this.validArrayKeys.includes(key)) {
                continue;
            }

            if (validKeys.hasOwnProperty(key)) {
                return `In ${updateOrInsert}: key "${key}" is not defined`
            }

            if (this.validDataFormat[key].startsWith("array")) {//check if the value for this key should be an array
                //check if value for the key of the given object is an array
                if (!Array.isArray(checkData[key])) {
                    return `In ${updateOrInsert}: The value "${checkData[key]}" of the key "${key}" should be an array, but it is of type ${typeof checkData[key]}`
                }

                //get the type that should be inside the array
                let expectedType = this.validDataFormat[key].split("(")[1].slice(0, -1);
                if (expectedType.startsWith("/") && updateOrInsert === "insert" && checkData[key].length === 0) {
                    continue;
                }
                for (let index in checkData[key]) { //check all elements in the array if they match the expected type
                    if (!(typeof checkData[key][index] === expectedType)) {
                        return `In ${updateOrInsert}: The value "${checkData[key][index]}" (index: ${index}) of the key "${key}" should be of type ${expectedType}, but it is of type ${typeof checkData[key]}`
                    }
                }
            }else if (this.validDataFormat[key].startsWith("object")) {
                //check if value for the key of the given object is an object
                if (!(typeof checkData[key] === 'object') || checkData[key] === null) {
                    return `In ${updateOrInsert}: The value "${checkData[key]}" of the key "${key}" should be of type object, but it is of type ${typeof checkData[key]}`
                }

                //get the type that should be inside the array
                let expectedType = this.validDataFormat[key].split("(")[1].slice(0, -1);
                if (expectedType.startsWith("/") && updateOrInsert === "insert" && Object.keys(checkData[key]).length === 0) {
                    continue;
                }
                let tempArray = expectedType.split(",")
                let expectedKey = tempArray[0];
                let expectedValue = tempArray[1];

                for (let index in Object.keys(checkData[key])) { //check all elements in the array if they match the expected type
                    let objectKey = Object.keys(checkData[key])[index];
                    if (!(typeof objectKey === expectedKey)) {
                        return `In ${updateOrInsert}: In key "${key}": The key "${objectKey}" should be of type ${expectedKey}, but is of type ${typeof objectKey}`
                    }else if (!(typeof checkData[key][objectKey] === expectedValue)) {
                        return `In ${updateOrInsert}: In key "${key}": The value "${checkData[key][objectKey]}" of the key "${objectKey}" should be of type ${expectedValue}, but is of type ${typeof checkData[key][objectKey]}`
                    }
                }

            }else if (!(typeof checkData[key] === this.validDataFormat[key])) {
                return `In ${updateOrInsert}: The value "${checkData[key]}" of the key "${key}" should be of type ${this.validDataFormat[key]}, but is of type ${typeof checkData[key]}`
            }
        }
        return "";}

    checkInsertData(checkData) {
        /*
         checks if the data fulfills the requirements for insertion
         */
        //check if the amount of keys matches with teh validDataFormat
        let dataKeysAmount = Object.keys(checkData).length;
        let expectedKeysAmount = Object.keys(this.validDataFormat).length;
        if (dataKeysAmount !== expectedKeysAmount) {
            return `expected ${expectedKeysAmount} keys, but got ${dataKeysAmount} keys`
        }
        return this.checkData(checkData, "insert");
    }

    checkUpdateData(checkData) {
        /*
        checks if the data fulfills the requirements for updating
         */
        return this.checkData(checkData, "update");
    }

    checkSearchData(checkData) {
        /*
        checks if the data fulfills the requirements for searching
         */
        return this.checkData(checkData, "search");
    }

    async isCreator(user, objectID) {
        return new Promise(async (resolve, reject) => {
            await this.findOne({"_id": objectID}).then(result => {
                if (result.creatorID === user.userID) {
                    resolve();
                }
                reject();
            }).catch(err => {
                console.log(err)
                reject();
            })
        })
    }
}

class recipeDB extends Database {   //class for the recipe database
    constructor() {
        const temp = {
            "title":"string", "method":"array(string)", "ingredients":"object(string,string)"
            ,"creatorID":"string", "nutrition":"object(string,number)", "tags":"array(string)", "ratingStars":"number"
            ,"ratingAmount":"number", "comments":"number", "timeToMake":"number", "difficulty":"string", "image":"string"};
        super("recipe", path.join(__dirname, '../resources/database/recipe.db'), temp);
    }
}

class userDB extends Database {
    constructor() {
        const temp = {
            "username": "string", "postedRecipes": "array(/string)", "showNutritionValue":"boolean"};
        super("user", path.join(__dirname, '../resources/database/user.db'), temp);
    }
}

class ratingDB extends Database {
    constructor() {
        const temp = {"creatorID":"string", "ratingStar":"number"};
        super("rating", path.join(__dirname, '../resources/database/ratings.db'), temp);
    }
}

class commentsDB extends Database {
    constructor() {
        const temp = {"recipeID":"string", "creatorID":"string", "comment":"string"};
        super("comments", path.join(__dirname, '../resources/database/comments.db'), temp);
    }
}

class impUserData extends Database {
    constructor() {
        const temp = {"username":"string", "password":"string", "email":"string", "verified":"boolean", "userID":"string"} //<- obviously not save
        super("impData", path.join(__dirname, '../resources/database/impUserData.db'), temp);
    }

    noDuplicate(data) {
        const status = {
            alreadyExists: false
        };
        for (let pair in data) {
            super.findOne({[pair]:data[pair]}).then(resolve => {
                if (!(resolve === null)) {
                    status.alreadyExists = true;
                    status[pair] = true;
                }
            }).catch(err => {
                console.log(err);
            })
        }
        return status;
    }
    insert(data) {
        return new Promise(async (resolve, reject) => {
            let status = this.noDuplicate({"username":data["username"], "email":data["email"]});
            if (!status.alreadyExists) {
                await super.insert(data).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                })
            }
            reject(status)
        })
    }
}

module.exports = {"recipe":recipeDB, "user":userDB, "rating":ratingDB, "comments":commentsDB, "pw":impUserData};

//c = new commentsDB();
//c.insert({"recipeID":"HNZe0IX8nSJbDxw6", "userID":"asdf", "comment":"This is a comment too"}).catch((err) => {console.log(err)})

/*
d = new recipeDB();


d.insert({'title':'testTitle', 'method':["step1", "step2"], "ingredients":{"lemon":1, "apple":4}
    ,'creator':'ASDF', 'nutrition':{"first":2, "second":34}, "tags":["tag1", "tag2"], 'ratingStars':9.7
    ,'ratingAmount':34, 'comments':234}).then(() => {
    console.log("DONE");
}).catch((err) => {
    console.log(err);
})
console.log();*/

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
