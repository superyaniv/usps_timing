const sqlite3 = require('sqlite3').verbose()
var express = require('express')
var app = express()
const hostname = '127.0.0.1';
const port = 3000;

app.get("/data", function (req, res) {
		// -- Query database
		let db = new sqlite3.Database('/Users/Yaniv/Library/Messages/chat.db', (err) => { // location of chat.db
			if (err) {console.error(err.message)}
			console.log('Connected to the chat database.')
		})
 
		db.serialize(() => {
			
			// let sql = 	`SELECT destination_caller_id,text,
			// datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime") as dt,
			// strftime("%H",datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime"))*100 + strftime("%M",datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime"))*100/60 as h,
			// strftime("%w",datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime")) as DOW 
			// FROM "main"."message"
			// WHERE "text" LIKE '%usps%delivered%' and DOW="5"
			// ORDER by message.date`
			
			let sql = 	`SELECT destination_caller_id,text,
			datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime") as dt,
			strftime("%H",datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime"))*100 + strftime("%M",datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime"))*100/60 as h,
			strftime("%w",datetime(message.date/1000000000 + strftime("%s", "2001-01-01") ,"unixepoch","localtime")) as DOW 
			FROM "main"."message"
			WHERE "text" LIKE '%usps%delivered%'`
			
				sql = sql + `and DOW LIKE "%${req.query.dow?req.query.dow:""}%"`
			sql = sql + ` ORDER by message.date`
			console.log(sql)

			db.all(sql, (err, rows) => {
				if (err) {console.error(err.message)}
				//res.send(`<td>${row.destination_caller_id}</td>  <td>${row.time}</td>`)
				res.json(rows)
				//res.write(`<table><tr><td>${row.destination_caller_id}</td><td>${row.h}</td></tr></table>`)
				//console.log(row)
				db.closes
			})
			
		})
})

app.get('/test', async (req,res)=> {
	res.sendFile(__dirname +'/test.html')
})	
// -- Open Server	
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/ - use http://127.0.0.1:3000/test?dow= (blank for all, 0-6 for M-Sun)` );
})


