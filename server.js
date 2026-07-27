const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
//import bcrypt from 'bcryptjs'
const express = require('express');
const papa = require('papaparse');
const csvLoader = require('csv-loader');
const csvParse = require('csv-parse');
const fs = require('fs')
dotenv.config();
//const fs = require('fs');

const app = express();
const router = express.Router();
const PORT = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const password = process.env.DB_PASSWORD;
const db_username = "JohnTest"
const cors = require('cors');
const mongoose = require('mongoose');
const e = require('express');
const { fail } = require('assert');



const uri = "mongodb+srv://" + db_username + ":" + "93QZffbBMv4nRWrm" + "@testbmr.xxaaupd.mongodb.net/appName=TestBmr";
//mongodb+srv://<db_username>:<db_password>@testbmr.xxaaupd.mongodb.net/

const urlPathBookRec = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFIugHc6pLg5BtCDtuODXtWvZkIczhW625WtsqW7mixKf1S2DigKdTltVbVR7cFBL1XiWSCyaja1kG/pub?gid=0&single=true&output=csv"
const urlPathCalendarData = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTrboDnifGpDieESIad74yaV2NTGxJfsA4GjKUZz7SmX2w6h9nfiDKnftTYIEmS6BUg-svsom4VBiv7/pub?output=csv"
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
/*const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
*/

const userSchema = new mongoose.Schema({
    name: String,
    email: String,

});
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});
const User = mongoose.model('User', userSchema);


async function connectClientToMongoDB(client = new MongoClient) {

    try {
        // Connect the client to the server	(optional starting in v4.7)

        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("test").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log('dissconnected')
    }
}

async function run() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    console.log('try Connect')
    try {
        // Connect the client to the server	(optional starting in v4.7)

        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("test").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log('dissconnected')
    }
}

async function getUsers() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    console.log('try Connect')
    try {
        // Connect the client to the server	(optional starting in v4.7)

        await client.connect();

        // Send a ping to confirm a successful connection
        users = await client.db("test").collection('Test').find({}).toArray()
        console.log(users)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
function addPasswordFlair() {

}
// Middleware


const LogStructure = {
    Date: new Date,
    Time: 1.0,
    PageFirst: 1,
    PageLast: 2,
    Notes: ''

}


async function hashString(toHash = '') {

    //const salt = await bcrypt.genSaltSync(10)
    //console.log(salt)
    //const hashedPassword = await bcrypt.hash(toHash, salt);
    const hashedPassword = await bcrypt.hashSync(toHash, '$2b$10$ZyKUCt7.9NhyUWWejCu1IO');
    //console.log(hashedPassword)
    return await hashedPassword


}




async function getUrlData(url = '') {

    try {
        // Connect the client to the server	(optional starting in v4.7)

        await client.connect();

        // Send a ping to confirm a successful connection
        const users = await client.db("OnlineData").collection('webvalues').find({ urlName: url }).toArray()
        //console.log(users[0])
        //console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return users[0]
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}

async function getUserUsingEmailAndPassword(email = '', passwordInst = '', userType = '') {
    const password = await hashString(passwordInst)
    if (userType == 'Student' || userType == 'Parent' || userType == 'Tutor') {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        //console.log('try Connect')
        try {
            // Connect the client to the server	(optional starting in v4.7)

            await client.connect();

            // Send a ping to confirm a successful connection
            const users = await client.db("UserData").collection(userType + 'Users').find({ Email: email.toLowerCase(), Password: await password }).toArray()
            //console.log(users[0])
            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return users[0]
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
}

async function removeUserLogData(logData, logToRemove) {
    const arrayData = await logData


    if (arrayData.includes(logToRemove)) {
        arrayData.pop(logToRemove)
    }

    return await arrayData;


}

async function getUserUsingObjectId(email = '', id = '', userType = '') {
    if (userType == 'Student' || userType == 'Parent' || userType == 'Tutor') {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log('try Connect')
        try {
            // Connect the client to the server	(optional starting in v4.7)

            await client.connect();

            // Send a ping to confirm a successful connection
            const users = await client.db("UserData").collection(userType + 'Users').find({ Email: email.toLowerCase(), _id: new ObjectId(id) }).toArray()

            console.log(users[0])
            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return users[0]
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
}


async function AddNewUser(email = '', passwordInst = '', username = '', acountType = '') {

    const password = await hashString(passwordInst)
    if (acountType == 'Student' || acountType == 'Parent' || acountType == 'Tutor') {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log('try Connect')
        try {
            // Connect the client to the server	(optional starting in v4.7)

            await client.connect();

            // Send a ping to confirm a successful connection
            await client.db("UserData").collection(acountType + 'Users').insertOne({ Email: email.toLowerCase(), Password: await password, UserName: username, UserType: acountType, DateCreated: new Date })
            await client.db("UserData").collection('UsedEmails').insertOne({ Email: email.toLowerCase() })
            //console.log(users[0])
            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }

}
async function changeUserData(email = '', id, dataToChange = '', changeDataTo, acountType = 'Tutor') {
    if (acountType == 'Student' || acountType == 'Parent' || acountType == 'Tutor') {
        changeDataTo['_id'] = id;
        changeDataTo['Email'] = email.toLowerCase();

        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log('try Connect')
        try {
            // Connect the client to the server	(optional starting in v4.7)
            console.log(changeDataTo)
            await client.connect();
            const data = await client.db("UserData").collection(acountType + 'Users').find({ Email: email.toLowerCase(), _id: new ObjectId(id) }).toArray()

            var gottendata = data[0]
            gottendata[dataToChange] = changeDataTo
            console.log(gottendata)
            // Send a ping to confirm a successful connection
            await client.db("UserData").collection(acountType + 'Users').replaceOne({ Email: email.toLowerCase(), _id: new ObjectId(id) }, gottendata)

            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
            return await gottendata;
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
}


async function updateUserReaddingData(email = '', id, acountType = 'Student') {
    if (acountType == 'Student' || acountType == 'Parent' || acountType == 'Tutor') {


        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log('try Connect')
        try {
            // Connect the client to the server	(optional starting in v4.7)
            //console.log(changeDataTo)
            await client.connect();
            const data = await client.db("UserData").collection(acountType + 'Users').find({ Email: email.toLowerCase(), _id: new ObjectId(id) }).toArray()

            var gottendata = data[0]

            console.log(gottendata)
            if (gottendata['ReadingStats']) {
                console.log('Stats Exist')
                var addData = gottendata;

                if (gottendata['Logs']) {
                    var uniqueBooks = [];
                    var timeBooks = {};
                    for (let index = 0; index < gottendata['Logs'].length; index++) {
                        if (uniqueBooks.includes(gottendata['Logs'][index]['Book'])) {
                            var curentTime = timeBooks[gottendata['Logs'][index]['Book']];
                            var curentTimeAray = curentTime.split('/')
                            var addTime = gottendata['Logs'][index]['Time'];
                            var addTimeAray = addTime.split('/')


                            var totalHour = 0
                            var totalMin = 0
                            var totalSec = 0
                            var selectedTime = 0;
                            if (parseInt(curentTimeAray[selectedTime]) && parseInt(addTimeAray[selectedTime])) {
                                totalHour = parseInt(curentTimeAray[selectedTime]) + parseInt(addTimeAray[selectedTime])
                            }
                            selectedTime = 1
                            if (parseInt(curentTimeAray[selectedTime]) && parseInt(addTimeAray[selectedTime])) {
                                totalMin = parseInt(curentTimeAray[selectedTime]) + parseInt(addTimeAray[selectedTime])
                            }
                            selectedTime = 2
                            if (parseInt(curentTimeAray[selectedTime]) && parseInt(addTimeAray[selectedTime])) {
                                totalSec = parseInt(curentTimeAray[selectedTime]) + parseInt(addTimeAray[selectedTime])
                            }


                            if (totalSec > 60) {
                                var minOverflow = Math.floor(totalSec / 60)
                                totalSec = totalSec - (minOverflow * 60)
                                totalMin += minOverflow
                            }
                            if (totalMin > 60) {
                                var hourOverflow = Math.floor(totalMin / 60)
                                totalMin = totalMin - (hourOverflow * 60)
                                totalHour += hourOverflow
                            }




                            timeBooks[gottendata['Logs'][index]['Book']] = totalHour + '/' + totalMin + '/' + totalSec
                        } else {
                            uniqueBooks[uniqueBooks.length] = gottendata['Logs'][index]['Book']
                            timeBooks[gottendata['Logs'][index]['Book']] = gottendata['Logs'][index]['Time']
                        }
                        const element = gottendata['Logs'][index];

                        console.log(element);
                    }
                    console.log(uniqueBooks);
                    console.log(timeBooks);

                    var totalHour = 0
                    var totalMin = 0
                    var totalSec = 0
                    var selectedTime = 0;

                    for (let index = 0; index < uniqueBooks.length; index++) {
                        const element = uniqueBooks[index];

                        var timeInst = timeBooks[element]

                        var addTimeAray = timeInst.split('/')

                        var selectedTime = 0;
                        if (parseInt(addTimeAray[selectedTime])) {
                            totalHour = totalHour + parseInt(addTimeAray[selectedTime])
                        }
                        selectedTime = 1
                        if (parseInt(addTimeAray[selectedTime])) {
                            totalMin = totalMin + parseInt(addTimeAray[selectedTime])
                        }
                        selectedTime = 2
                        if (parseInt(addTimeAray[selectedTime])) {
                            totalSec = totalSec + parseInt(addTimeAray[selectedTime])
                        }

                        if (totalSec > 60) {
                            var minOverflow = Math.floor(totalSec / 60)
                            totalSec = totalSec - (minOverflow * 60)
                            totalMin += minOverflow
                        }
                        if (totalMin > 60) {
                            var hourOverflow = Math.floor(totalMin / 60)
                            totalMin = totalMin - (hourOverflow * 60)
                            totalHour += hourOverflow
                        }

                    }

                    var totalTimeReadInst = totalHour + '/' + totalMin + '/' + totalSec
                    console.log(totalTimeReadInst)
                    addData["ReadingStats"] = { BooksRead: timeBooks, TotalTimeRead: totalTimeReadInst };
                }


                await client.db("UserData").collection(acountType + 'Users').replaceOne({ Email: email.toLowerCase(), _id: new ObjectId(id) }, addData)
            }
            else {
                console.log('Stats Do not Exist')
                //await client.db("UserData").collection(acountType + 'Users').insertOne({ Email: email, _id: new ObjectId(id) }, { ReadingStats: {} })
                //await client.db("UserData").collection(acountType + 'Users')
                var addData = gottendata;
                if (gottendata['Logs']) {

                    for (let index = 0; index < gottendata['Logs'].length; index++) {
                        const element = gottendata['Logs'][index];
                        console.log(element);
                    }

                }
                addData["ReadingStats"] = { BooksRead: {}, TotalTimeRead: '' };
                await client.db("UserData").collection(acountType + 'Users').replaceOne({ Email: email.toLowerCase(), _id: new ObjectId(id) }, addData)

            }
            // Send a ping to confirm a successful connection
            //await client.db("UserData").collection(acountType + 'Users').replaceOne({ Email: email, _id: new ObjectId(id) }, gottendata)

            //console.log("Pinged your deployment. You successfully connected to MongoDB!");
            //return await gottendata;
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }
    }
}



async function addUserLogDataToData(data, log) {
    var modifiedData = await data

    if (!modifiedData['Logs']) {
        modifiedData['Logs'] = data['Logs']

        modifiedData['Logs'] = []
        //console.log(modifiedData)
    }
    modifiedData['Logs'][modifiedData['Logs'].length] = log


    return modifiedData['Logs'];

}

async function connectAcountDataToNewData(connectToData, toConnectData) {
    var modifiedData = await connectToData


    if (!modifiedData['ConnectedAcounts']) {
        modifiedData['ConnectedAcounts'] = connectToData['ConnectedAcounts']

        modifiedData['ConnectedAcounts'] = []
        console.log(modifiedData)
    }
    modifiedData['ConnectedAcounts'][modifiedData['ConnectedAcounts'].length] = { UserName: toConnectData['UserName'], Email: toConnectData['Email'].toLowerCase(), id: toConnectData['_id'] }


    return modifiedData['ConnectedAcounts'];

}


async function removeAcountDataToNewData(removeFromData, toRemoveData) {
    var modifiedData = await removeFromData


    if (!modifiedData['ConnectedAcounts']) {
        modifiedData['ConnectedAcounts'] = connectToData['ConnectedAcounts']

        modifiedData['ConnectedAcounts'] = []
        console.log(modifiedData)
    }
    var data = []

    console.log(modifiedData['ConnectedAcounts'])
    var connectedAcounts = modifiedData['ConnectedAcounts'];
    var connectedRemoved = [];
    //console.log({ UserName: toRemoveData['UserName'], Email: toRemoveData['Email'].toLowerCase(), id: toRemoveData['_id'] });
    for (element of connectedAcounts) {
        //console.log(element);

        if (element["UserName"] == toRemoveData['UserName'] && element['Email'].toLowerCase() == toRemoveData['Email'].toLowerCase() && element['id'].toString() == toRemoveData['_id'].toString()) {

        }
        else {
            connectedRemoved[connectedRemoved.length] = element
        }
    }
    //console.log(connectedRemoved);
    modifiedData['ConnectedAcounts'] = connectedRemoved;
    //console.log(modifiedData)


    return modifiedData['ConnectedAcounts'];

}



async function getUserData(userData) {
    try {

        const rawdata = await userData



        var modifiedData = rawdata

        console.log(rawdata)
        //const data = { _id: rawdata['_id'], Email: rawdata['Email'], UserName: rawdata['UserName'], Logs: rawdata['Logs'] }

        modifiedData['Password'] = ''

        if (userData['UserType'] == 'Tutor' || userData['UserType'] == 'Parent') {
            if (userData['ConnectedAcounts']) {


                var connectedValidList = []
                for (element of userData['ConnectedAcounts']) {
                    const fullData = await getUserUsingObjectId(element['Email'].toLowerCase(), element['id'], 'Student')
                    if (await fullData) {
                        console.log(await fullData)
                        connectedValidList[connectedValidList.length] = { UserName: fullData['UserName'], Email: fullData['Email'].toLowerCase(), id: fullData['_id'] }

                    }

                }
                modifiedData['ConnectedAcounts'] = connectedValidList










            }
        }
        //console.log(modifiedData)
        return modifiedData
    }
    catch {
        console.log('dataGetFail')
        return { Fail: true }
    }

}



async function isEmailUsed(email = '') {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    console.log('try Connect')
    try {
        // Connect the client to the server	(optional starting in v4.7)

        await client.connect();

        // Send a ping to confirm a successful connection
        users = await (await client.db("UserData").collection('UsedEmails').find({ Email: email.toLowerCase() }).toArray() != 0)

        console.log(users)
        return users
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);


//const data = getUserUsingEmailAndPassword('johntest@gmail.com', 'Password', 'Tutor');
//removeUserLogData('johntest@gmail.com', 'Password', 'Tutor');
//getUserUsingEmailAndPassword('johntest@gmail.com', 'Password', 'Tutor');



//const logtest = addUserLogDataToData(data, {})


//getUserData(data)


//AddNewUser('email@email.com', 'HelloBuddy', 'DavidTest', 'Tutor')

//const thedocument = { UserName: 'GoaneTest' }
//changeUserData('rontest@gmail.com', new ObjectId('692b5e038481b1812a6281e5'), 'UserName', 'GoneTest', 'Tutor')






app.use(cors())
app.use(express.json());

// MongoDB Connection


app.get('/notes', (req, res) => {
    console.log('getNotes')
    res.send('notes');

});
app.post('/isEmailUsed', (req, res) => {

    res.send(isEmailUsed(req.body.user.email));


});
app.post('/LoginForm', async (req, res) => {
    try {


        const data = await getUserUsingEmailAndPassword(req.body.user.email.toLowerCase(), req.body.user.password, req.body.user.usertype);
        const interpratedData = await getUserData(await data)
        //sendUserData(res, getUserData(data))

        //console.log(interpratedData)
        res.send(interpratedData)

    }
    catch (error) {
        console.log('login Error:' + error)

        res.send({
            Fail: true
        })
    }



});
app.post('/AddNewUserForm', async (req, res) => {
    if (await isEmailUsed(req.body.user.email.toLowerCase()) == false) {
        await AddNewUser(req.body.user.email.toLowerCase(), req.body.user.password, req.body.user.username, req.body.user.usertype);
        const newuser = await getUserUsingEmailAndPassword(req.body.user.email.toLowerCase(), req.body.user.password, req.usertype)
        const interpratedData = await getUserData(await newuser)
        res.send(interpratedData)
    }
    else {
        res.send({
            LogIn: false,
            LogInError: 'Failed to Access the internet'
        })
    }




    //sendUserData(res, getUserData(data))


});

app.post('/AddUserLog', async (req, res) => {
    console.log('data added')
    try {
        const data = await getUserUsingObjectId(req.body.user.email.toLowerCase(), req.body.user.id, req.body.user.usertype);




        const interpratedData = await addUserLogDataToData(await data, req.body.user.log)

        const changedData = await changeUserData(req.body.user.email.toLowerCase(), req.body.user.id, 'Logs', await interpratedData, req.body.user.usertype)
        await updateUserReaddingData(req.body.user.email.toLowerCase(), req.body.user.id, req.body.user.usertype);
        //sendUserData(res, getUserData(data))

        //console.log(await changedData)
        res.send(await changedData)

    }
    catch {
        console.log('log Error')
    }



});


app.post('/RemoveLog', async (req, res) => {
    console.log('data added')
    try {
        const data = await getUserUsingObjectId(req.body.user.email.toLowerCase(), req.body.user.id, req.body.user.usertype);




        const interpratedData = await removeUserLogData(data.Logs, req.body.user.log)
        const changedData = await changeUserData(req.body.user.email.toLowerCase(), req.body.user.id, 'Logs', await interpratedData, req.body.user.usertype)
        await updateUserReaddingData(req.body.user.email.toLowerCase(), req.body.user.id, req.body.user.usertype);
        //sendUserData(res, getUserData(data))

        //console.log(await changedData)
        res.send(await changedData)

    }
    catch {
        console.log('log Error')
    }



});
app.post('/GetConnectedUser', async (req, res) => {

    try {
        const data = await getUserUsingObjectId(req.body.user.email.toLowerCase(), req.body.user.id, req.body.user.usertype);

        const interpratedData = await getUserData(await data)
        //sendUserData(res, getUserData(data))

        //console.log(await changedData)
        res.send(await data)

    }
    catch {
        console.log('log Error')
    }



});


//https://docs.google.com/spreadsheets/d/e/2PACX-1vTNS-SplelcH-2i2lU9pF7zD9Yh0Ktkp9Wt9FKtOuKd62Y1iTDbuIHOnfX9j94AoGgFKVSqlcoBrpil/pub?gid=0&single=true&output=csv
//https://docs.google.com/spreadsheets/d/e/2PACX-1vSFIugHc6pLg5BtCDtuODXtWvZkIczhW625WtsqW7mixKf1S2DigKdTltVbVR7cFBL1XiWSCyaja1kG/pub?gid=0&single=true&output=csv

const getCalanderData = async () => {
    try {
        const response = await fetch(urlPathCalendarData)
        //console.log(await caldata)

        const csvText = await response.text();
        const parsed = await papa.parse(csvText, {



            header: true,
            skipEmptyLines: true




        })

        //console.log(parsed.data)
        return parsed.data
    }
    catch {
        console.log('CalanderDataGetFail')
    }

}
//getCalanderData()
const checkConnectedAcounts = async (array = [{}], email = '') => {
    console.log(array)
    console.log(array.length)
    console.log(email)
    if (array.length > 0) {
        for (element in array) {
            console.log(array[element])
            if (array[element]['Email']) {
                console.log('has Email')
                console.log(array[element]['Email'].toLowerCase())
                if (array[element]['Email'].toLowerCase() == email.toLowerCase()) {
                    return true;
                }
            }


        }
    }
    console.log('Diffrent')

    return false;

}


app.post('/RemoveConnectedUser', async (req, res) => {
    console.log('data added')


    const fromEmail = req.body.user.toEmail;
    const fromId = req.body.user.toId;
    const fromUserType = req.body.user.toUsertype;
    const removeEmail = req.body.user.removeEmail;
    const removeId = req.body.user.removeId;

    console.log("From Email: " + fromEmail)
    console.log("From Id: " + fromId)
    console.log("From User Type: " + fromUserType)
    console.log("Remove Email: " + removeEmail)
    console.log("Remove Id: " + removeId)

    try {


        const connectToData = await getUserUsingObjectId(fromEmail.toLowerCase(), fromId, fromUserType);
        const toRemoveData = await getUserUsingObjectId(removeEmail.toLowerCase(), removeId, 'Student');
        console.log(await connectToData)
        console.log(await toRemoveData)

        if (await checkConnectedAcounts(await connectToData['ConnectedAcounts'], removeEmail)) {

            console.log('Exists')
            //Put Code To Remove Acounts Here
            const interpratedData = await removeAcountDataToNewData(await connectToData, await toRemoveData)
            console.log(await interpratedData)
            const changedData = await changeUserData(req.body.user.toEmail.toLowerCase(), req.body.user.toId, 'ConnectedAcounts', await interpratedData, req.body.user.toUsertype)
            console.log(await changedData)
        }
        else {
            console.log('Does Not Exist')

            /*

            const interpratedData = await connectAcountDataToNewData(await connectToData, await toConnectData)
            console.log(await interpratedData)
            const changedData = await changeUserData(req.body.user.toEmail.toLowerCase(), req.body.user.toId, 'ConnectedAcounts', await interpratedData, req.body.user.toUsertype)

            //sendUserData(res, getUserData(data))

            //console.log(await changedData)
            res.send(await changedData)*/
        }




    }

    catch {
        console.log('log Error')
    }




});



app.post('/ConnectUserTo', async (req, res) => {
    //console.log('data added')


    try {


        const connectToData = await getUserUsingObjectId(req.body.user.toEmail.toLowerCase(), req.body.user.toId, req.body.user.toUsertype);
        const toConnectData = await getUserUsingObjectId(req.body.user.connectEmail.toLowerCase(), req.body.user.connectId, 'Student');
        console.log(await connectToData)
        console.log(await toConnectData)

        if (await checkConnectedAcounts(await connectToData['ConnectedAcounts'], req.body.user.connectEmail.toLowerCase())) {

            console.log('duplicate')

        }
        else {
            console.log(await connectToData)
            console.log(await toConnectData)


            const interpratedData = await connectAcountDataToNewData(await connectToData, await toConnectData)
            console.log(await interpratedData)
            const changedData = await changeUserData(req.body.user.toEmail.toLowerCase(), req.body.user.toId, 'ConnectedAcounts', await interpratedData, req.body.user.toUsertype)

            //sendUserData(res, getUserData(data))

            //console.log(await changedData)
            res.send(await changedData)
        }




    }
    catch {
        console.log('log Error')
    } oC



});


//getBookRec2()

async function getBookRec() {
    const response = await fetch(urlPathBookRec)
    //console.log(await caldata)

    const csvText = await response.text();
    const parsed = await papa.parse(csvText, {



        header: true,
        skipEmptyLines: true




    })
    //console.log(parsed.data)
    return parsed.data
}


const EventStructure = {
    Name: '',
    StartTime: '',
    EndTime: ''

}



app.post('/BookRec', async (req, res) => {
    const bookRec = await getBookRec()
    //console.log(await bookRec)

    res.send(await bookRec);


});

app.post('/CalenderData', async (req, res) => {
    const calData = await getCalanderData()
    //console.log(await bookRec)

    res.send(await calData);


});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
