const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
 
// Connection configurations
const mc = mysql.createConnection({
  host: 'cs358.cis.valpo.edu',
  user: 'hesse',
  password: '358hesse',
  database: 'hesse'
});
 
// Connect to database
mc.connect(); 

// For getting post data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Default route
app.get('/api/', function (req, res) {
  return res.json({ message: 'hello' })
});
 
// Retrieve all shifts
// Date is formatted like "Wednesday March 20 2019"
app.get('/api/shifts', function (req, res) {
  mc.query('SELECT id, createdAt, DATE_FORMAT(shiftDate, "%W %M %e %Y") AS shiftDate, shiftTime, postedBy, coveredBy, helpSession, majorPreference, yearPreference, comments FROM shifts', function (error, results, fields) {
    if (error) { throw error; }
    return res.json({ data: results });
  });
});

// Retrieve shift by id
// Date is formatted like "Wednesday March 20 2019"
app.get('/api/shift/:id', function (req, res) {
  var shiftId = req.params.id;

  mc.query('SELECT id, createdAt, DATE_FORMAT(shiftDate, "%W %M %e %Y") AS shiftDate, shiftTime, postedBy, coveredBy, helpSession, majorPreference, yearPreference, comments FROM shifts WHERE id=?', [shiftId], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results[0] });
  });
});

// Add a new shift
app.post('/api/shift', function (req, res, next) {
  var shiftDate = req.body.shiftDate;
  var shiftTime = req.body.shiftTime;
  var postedBy = req.body.postedBy;
  var helpSession = req.body.helpSession;
  var majorPreference = req.body.majorPreference;
  var yearPreference = req.body.yearPreference;
  var comments = req.body.comments;

  if (!shiftDate || !shiftTime || !postedBy || !helpSession || !majorPreference || !yearPreference) {
    return res.status(400).json({ message: 'Missing information.' });
  }

  mc.query('INSERT INTO shifts (shiftDate, shiftTime, postedBy, helpSession, majorPreference, yearPreference, comments) VALUES (?,?,?,?,?,?,?)', [shiftDate, shiftTime, postedBy, helpSession, majorPreference, yearPreference, comments], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'New shift has been created successfully.' });
  });
});

// Cover a shift
// Updates the shift's "covered by" field
app.put('/api/shift', function (req, res) {
  var shiftId = req.body.id;
  var coveredBy = req.body.coveredBy;
  
  if (!shiftId || !coveredBy) { 
    return res.status(400).json({ message: 'Missing information.' });
  }
  
  mc.query('UPDATE shifts SET coveredBy=? WHERE id=?', [coveredBy, shiftId], function (error, results, fields) {
    if (error) throw error;
    return res.json({ data: results, message: 'Shift has been updated successfully.' });
  });
}); 

// Listen
const port = process.env.PORT || 3001;
app.listen(port, function () {
  console.log('Node app is running on port ' + port);
});
 
