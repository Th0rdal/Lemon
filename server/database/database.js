const Datastore = require("nedb");
const mutex = require("./mutex");

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
            Database.database = new Datastore({"filename": path, "autoload": true});    //connect to database
            Database.instance = this;
        }

        return Database.instance;
    }

    async insert(rawData) {
        /*
        insert object into the database
        param rawData: the object to be inserted
        return resolve(): after the data has been inserted
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
            return "expected " + expectedKeysAmount.toString() + " keys, but got "
                + dataKeysAmount.toString();
        }

        //check if each value is in rawData
        let dataKeys = Object.keys(checkData);
        for (let key of Object.keys(Database.validDataFormat)) {
            if (!dataKeys.includes(key)) {
                return "key \"" + key.toString() + "\" is not defined";
            }
            if (!(typeof checkData[key] === Database.validDataFormat[key])) {
                return "The value \"" + checkData[key].toString() + "\" of the key \""
                    + key.toString() + "\" should be of type \"" + Database.validDataFormat[key].toString()
                    + "\", but is of type \"" + (typeof checkData[key]).toString() + "\"";
            }
        }
        return "";
    }
}

class recipeDB extends Database {   //class for the recipe database
    constructor() {
        const temp = {"title":"string", "ratingStars":"number"}
        super('./resources/database/recipe.db', temp);
    }
}

module.exports = recipeDB;

/*d = new recipeDB();
d.insert({'title':'recipeTitle', 'ratingStars':9.8}).then(resolve => {
    console.log("DONE");
}).catch(err => console.log(err));*/
/*d.findOne({"title":/Tit/}).then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
})*/

/*d = new recipeDB();
//d.checkData({"title": "test", "rating":55}).then(resolve => console.log(resolve));

d.insert({'title':'testTitle', 'ratingStars':9.7}).then(resolve => {
    console.log("DONE");
});

d.find({'test':'data'}).then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
})

d.update({'test': 'data'}, {'$set':{'test':'asdf'}}, {}).then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
});

d.remove({'test':"asdf"}, {}).then(resolve => {
    console.log(resolve);
}).catch(err => {
    console.log(err);
})*/