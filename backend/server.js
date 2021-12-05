const express = require('express')
const app = express()
var faker = require("faker");
const morgan = require("morgan")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const cors = require("cors")
const { v4: uuidv4 } = require('uuid');

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded())
app.use(express.json())

const secret = 'shhh'

var admin = require("firebase-admin");

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { firestore, doc, getFirestore, Timestamp } = require('firebase-admin/firestore');
const serviceAccount = require('./firebase_credentials/proiect-vue-firebase-adminsdk-bqran-07e856986f.json');
const { fake } = require('faker');
initializeApp({
    credential: cert(serviceAccount)
});
const db = getFirestore();
let users = [];
let tipPlataList = [];
let cheltuieliList = [];

// Verifica daca utilizatorul e logat
function checkAuthorization(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, secret, (err, decoded) => {
            if (err) {
                if (err.expiredAt) {
                    res.json({ "message": "Your token expired!" });
                } else {
                    res.json({ "message": "Decoding error!" });
                }
            } else {
                console.log(decoded.email);
                next();
            }
        })
    } else {
        res.json({ "message": "Missing token!" })
    }
}

//genereaza inregistrari in baza de date
app.get('/generateRandomData/:noOfRecords', async (req, res) => {
    let number = req.params.noOfRecords

    for (let i = 0; i < number; i++) {
        let date = {
            tipPlata: faker.finance.accountName(),
            data: faker.datatype.datetime(),
            suma: faker.finance.amount(),
            detalii: faker.finance.transactionDescription()
        }
        let tipPlati = {
            nume: date.tipPlata
        }
        let plataExistenta = false;
        const usersRef = db.collection('tipPlata');
        const snapshot = await usersRef.where('nume', '==', tipPlati.nume).get();
        if (!snapshot.empty) {
            plataExistenta = true;
        }
        if (plataExistenta == false) {
            const res1 = await db.collection('tipPlata').add(tipPlati);
            console.log('Added document with ID: ', res1.id, "in tipPlata");
        }
        else {
            console.log("am intrat pe plateExistenta = ", plataExistenta)
        }
        const res = await db.collection('cheltuieli').add(date);
        console.log('Added document with ID: ', res.id);
    }

    res.send('Vrei sa introduci ' + number + ' date random')
})

app.get('/', (req, res) => {
    res.send("hello world");
})

app.get('/users', (req, res) => {
    res.json(users);
})
//Inregistrarea unui utilizator
app.post('/user', async (req, res) => {
    let data = req.body;
    let emailExist = false;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', data.email).get();

    if (!snapshot.empty) {
        emailExist = true;
    }

    if (emailExist) {
        res.send('User already registered.')
    }
    else {
        bcrypt.hash(data.password, saltRounds).then(async function (hash) {
            data.password = hash;
            const response = await db.collection('users').add(data);
            console.log("You've just registered with the following id:  ", response.id);
            res.send('Succesfull registration');
        })
    }
})

//get pentru lista de cheltuielii
app.get('/cheltuieli', async (req, res) => {
    cheltuieliList = [];
    const response = await db.collection('cheltuieli').get();
    response.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        let cheltuiala = {};
        cheltuiala.id = doc.id;
        cheltuiala.data = doc.data().data;
        cheltuiala.detalii = doc.data().detalii;
        cheltuiala.tipPlata = doc.data().tipPlata;
        cheltuiala.suma = doc.data().suma;
        cheltuieliList.push(cheltuiala);
    });
    cheltuieliList.sort(function(a, b) {          
        if (a.tipPlata === b.tipPlata) {
           // Price is only important when cities are the same
           return b.suma - a.suma;
        }
        return a.tipPlata > b.tipPlata ? 1 : -1;
     });
    res.json(cheltuieliList);
})

app.get('/cheltuieli/:id', (req, res) => {
    res.send('Vrei sa primesti detalii despre cheltuiala cu id-ul: ' + req.params.id);
})

//actualizeaza o cheltuiala
app.put('/cheltuieli/:id', checkAuthorization, async (req, res) => {
    console.log('Actualizare cheltuiala cu id ' + req.params.id);
    req.body.data = Timestamp.fromDate(new Date(req.body.data));
    const response = await db.collection('cheltuieli').doc(req.params.id).update(req.body);

    res.json({ 'message': 'Cheltuiala cu id-ul ' + req.body.id + ' s-a modificat de pe server!' });
})

//stergerea unei cheltuieli
app.delete('/cheltuieli/:id', checkAuthorization, (req, res) => {
    console.log('Vrei sa stergi cheltuiala cu id-ul: ' + req.params.id);
    let id = req.params.id
    const ch = db.collection('cheltuieli').doc(id).delete()
    res.json({ 'message': 'Am sters cheltuiala cu id ul' + req.params.id + ' de pe server!' });
})

//Crearea unei cheltuieli
app.post('/cheltuieli', checkAuthorization, async (req, res) => {
    //console.log(req.body.data)
    req.body.data = Timestamp.fromDate(new Date(req.body.data));
    let cheltuiala = req.body;
    // cheltuiala.id = uuidv4();
    // cheltuieliList.push(cheltuiala);
    const insert = await db.collection('cheltuieli').add(cheltuiala);
    res.json({ "S a creat cheltuiala cu id-ul ": cheltuiala.id });
})


//API pentru tip Plata
// get pentru lista de tip plati
app.get('/tipPlata', async (req, res) => {
    tipPlataList = [];
    const response = await db.collection('tipPlata').get();
    response.forEach(doc => {
        let tipPlata = {};
        tipPlata.id = doc.id;
        tipPlata.nume = doc.data().nume;
        tipPlataList.push(tipPlata);
    });
    res.json(tipPlataList);

})

app.get('/tipPlata/:id', (req, res) => {
    res.send('Vrei sa primesti detalii despre plata cu id-ul: ' + req.params.id);
})

//Stergearea unei tip Plati
app.delete('/tipPlata/:id', checkAuthorization, async (req, res) => {
    console.log('Vrei sa stergi tip Plata cu id-ul: ' + req.params.id);
    let id = req.params.id
    
    const tipPl = db.collection('tipPlata').doc(id).delete()
    const usersRef = db.collection('cheltuieli');
    const snapshot = await usersRef.where('tipPlata', '==', req.body.nume).get();
    const batch = db.batch();
    snapshot.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    res.json({ 'message': 'Am sters tip Plata cu id ul' + req.params.id + ' de pe server!' });
})

// Crearea unei tip Plati 
app.post('/tipPlata', checkAuthorization, async (req, res) => {
    let tipPlata = req.body;
    const insert = await db.collection('tipPlata').add(tipPlata);
    res.json({ "S-a adaugat pe server plata": insert.id });
})

//Editarea unei tip Plati
app.put('/tipPlata/:id', checkAuthorization, async (req, res) => {
    const usersRef = db.collection('cheltuieli');
    const dbTipPlata = db.collection('tipPlata');
    const response1 = await dbTipPlata.doc(req.params.id).get();
    console.log(response1.data().nume)
    const snapshot = await usersRef.where('tipPlata', '==', response1.data().nume).get();
    const batch = db.batch();
    let data={
        tipPlata: req.body.nume
    }
    snapshot.forEach(doc => {
        console.log("Cheltuielile se schimba")
        batch.update(doc.ref,"tipPlata",data.tipPlata);
    });
    await batch.commit();


    const response = await db.collection("tipPlata").doc(req.params.id).update(req.body);

    res.json({ 'message': 'Am modificat tip Plata cu id-ul ' + req.body.id + ' de pe server!' });
})


//metoda login
app.post('/login', async (req, res) => {
    let data = req.body;

    let emailFound = false;

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', data.email).get();

    if (snapshot.empty) {
        let response = {};
        response.message = "No such email address.";
        res.json(response);
    } else {
        emailFound = true;
        snapshot.forEach(doc => {
            bcrypt.compare(data.password, doc.data().password).then(async function (result) {
                if (result) {
                    let token = jwt.sign({
                        email: doc.data().email
                    }, secret, { expiresIn: 60 * 60 });

                    let response = {};
                    response.token = token;
                    response.message = 'You have the right to access private resources'

                    res.json(response);
                }
                else {
                    let response = {};
                    response.message = "Password missmatch";
                    res.json(response)
                }
            });
        });
    }

})

app.listen(3001)