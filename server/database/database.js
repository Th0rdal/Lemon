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
            Database.database = new Datastore(path);    //connect to database
            Database.database.loadDatabase();   //load values from the database
            Database.instance = this;
        }

        return Database.instance;
    }

    async insert(rawData) {     //insert value into the database
        this.checkData(rawData).then(data => {
            return new Promise((resolve) => {
                Database.mutex.acquire().then(() => {
                    Database.database.insert(data);
                    Database.mutex.release();
                    resolve();
                });
            })
        })
    }

    async find(searchDict) {    //get values from the database
        return new Promise((resolve) => {
            Database.mutex.acquire().then(() => {
                Database.database.find(searchDict, function(err, docs) {
                    Database.mutex.release();
                    if (err) reject(err);
                    resolve(docs);
                });
            })
        })
    }

    async update(searchDict, updateDict, options) { //updates values from the database
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

    async remove(searchDict, options) { //remove value from the database
        return new Promise((resolve, reject) => {
            Database.mutex.acquire().then(() => {
                Database.database.remove(searchDict, {}, function (err, numRemoved) {
                    Database.database.loadDatabase();
                    Database.mutex.release();
                    if (err) reject(err);
                    resolve(numRemoved);
                })
            })
        })
    }

    async checkData(checkData) {    //check if the data is acceptable for the database
        return new Promise((resolve) => {

            //check if the amount of keys matches with teh validDataFormat
            let dataKeysAmount = Object.keys(checkData).length;
            let expectedKeysAmount = Object.keys(Database.validDataFormat).length;
            if (dataKeysAmount !== expectedKeysAmount) {
                throw new Error("expected " + expectedKeysAmount.toString() + " keys, but got "
                    + dataKeysAmount.toString());
            }

            //check if each value is in rawData
            let dataKeys = Object.keys(checkData);
            for (let key of Object.keys(Database.validDataFormat)) {
                if (!dataKeys.includes(key)) {
                    throw new Error("key \"" + key.toString() + "\" is not defined");
                }
                if (!(typeof checkData[key] === Database.validDataFormat[key])) {
                    let message = "The value \"" + checkData[key].toString() + "\" of the key \""
                        + key.toString() + "\" should be of type \"" + Database.validDataFormat[key].toString()
                        + "\", but is of type \"" + (typeof checkData[key]).toString() + "\"";
                    throw new Error(message);
                }
            }
            resolve(checkData);
        })
    }
}

class recipeDB extends Database {   //class for the recipe database
    constructor() {
        const temp = {"title":"string", "ratingStars":"number"}
        super('recipe.db', temp);
    }
}


/*
d = new recipeDB("database.db");
d.checkData({"title": "test", "rating":55}).then(resolve => console.log(resolve));

d.insert({'test':'data'}).then(resolve => {
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