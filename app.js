const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var moment = require('moment');
const app = express();
var admin = require("firebase-admin");

const port = 3000;
app.use(cors());
app.use(bodyParser.json());



//------------ firebase conn ---------------

// Fetch the service account key JSON file contents
var serviceAccount = require("./prueba-b4bbd-firebase-adminsdk-plu6c-e025050ed7.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://prueba-b4bbd.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();


// ------------------- fin firebase conn ---------------------

app.get('/hola', (req, res) => {
	var datemil = Date.now();
	var date = new Date(datemil);
	var dato = {
		date: date,
		datemil: datemil,
		id: datemil,
		scret: 'hola' + datemil.toString(),
		leible: moment(date).format('MMMM Do YYYY, h:mm:ss a')
	};
	db.ref("datos").push(dato).then(() => {
		db.ref('datos').orderByChild('datemil').equalTo(datemil).on('child_added', function (snapshot) {
			var guardado = snapshot.val();
			guardado.obtenidoleible = moment(guardado.datemil).format('MMMM Do YYYY, h:mm:ss a');
			res.send({guardado: guardado, dato: dato});
		});
	});
});


//START SERVER
app.listen(port, () => {
	console.log('Server started on port ' + port);
});

