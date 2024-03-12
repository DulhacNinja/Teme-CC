var http = require('http'); //  Import Node.js core module
const sqlite3 = require('sqlite3').verbose()
var bodyParser = require('body-parser')
const path = require('path')


let sql



//connect to DB
const db = new sqlite3.Database('./test.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
});

//create table
// sql =  'CREATE TABLE users(id INTEGER PRIMARY KEY, first_name, last_name, username, password, email)';
// db.run(sql)
// drop table

// sql = 'DROP TABLE students'
// db.run(sql)

// sql = 'CREATE TABLE students(id INTEGER PRIMARY KEY, first_name, last_name, email)';
// db.run(sql)
// sql = 'DELETE FROM students WHERE 1=1'
// db.run(sql, [], (err) => {
//     if (err) return console.error(err.message)
// })

// sql = 'DELETE FROM grades WHERE 1=1'
// db.run(sql, [], (err) => {
//     if (err) return console.error(err.message)
// })

// sql = 'INSERT INTO students(first_name, last_name, email) VALUES (?,?,?)';
// db.run(sql,['Mike', 'Hawk', 'mikehawk@gmail.com'],(err)=> {
//     if (err) return console.error(err.message)
// })
// db.run(sql,['Ben', 'Dover', 'bendover@gmail.com'],(err)=> {
//     if (err) return console.error(err.message)
// })
// db.run(sql,['Mike', 'Hunt', 'mikehunt@gmail.com'],(err)=> {
//     if (err) return console.error(err.message)
// })

// sql = 'CREATE TABLE grades(id INTEGER PRIMARY KEY, id_student INTEGER, subject, value INTEGER)';
// db.run(sql)

// sql = 'DROP TABLE grades'
// db.run(sql)

// sql = 'CREATE TABLE grades(id INTEGER PRIMARY KEY, id_student INTEGER, subject, value INTEGER)';
// db.run(sql)

// sql = 'INSERT INTO grades(id_student, subject, value) VALUES (?,?,?)';
// db.run(sql,[1, 'Romanian', 7],(err)=> {
//     if (err) return console.error(err.message)
// })
// db.run(sql,[1, 'Maths', 10],(err)=> {
//     if (err) return console.error(err.message)
// })

// db.run(sql,[2, 'History', 8],(err)=> { 
//     if (err) return console.error(err.message)
// })
// db.run(sql,[2, 'Chemistry', 5],(err)=> {
//     if (err) return console.error(err.message)
// })

// db.run(sql,[3, 'Spanish', 7],(err)=> {
//     if (err) return console.error(err.message)
// })
// db.run(sql,[3, 'Sports', 7.5],(err)=> {
//     if (err) return console.error(err.message)
// })
//Insert data into table



function servFunction(req, res) {
    var URL = (req.url.split('/')) // ->['', 'students', '1']
    URL = URL.filter(element => element != '')
    console.log(req.method + "\t" + req.url)

    console.log(URL)
    if (URL[0] == 'students') {
        if (URL.length == 1) {
            //      /students
            if (req.method == 'GET') {
                sql = 'SELECT * FROM students'
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.error(err.message)
                        res.writeHead(500, { 'Content-Type': 'text/plain' })
                        res.write("Something went wrong while querying the database.")
                        res.end();return
                    }
                    if (rows.length == 0) {
                        res.writeHead(204, { 'Content-Type': 'application/json' })
                        res.write(JSON.stringify(rows))
                        res.end();return
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        console.log(rows)
                        res.write(JSON.stringify(rows))
                        res.end();return
                    }
                })
            return}
            if (req.method == 'POST') {
                body = undefined
                let chunks = [];
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                req.on("end", () => {
                    const data = Buffer.concat(chunks);
                    const querystring = data.toString();
                    body = querystring
                    // console.log(body)
                    try {
                        obj = JSON.parse(body)
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' })
                        res.write("Unable to parse your bad JSON")
                        console.log('Unable to parse your bad JSON')
                        res.end();return
                        return
                    }
                    // console.log(obj)
                    // flag = 0
                    // for(var i = 0; i < obj.length; i++){
                    //     sql = 'SELECT * FROM students where first_name LIKE ? AND last_name LIKE ? AND email LIKE ?'
                    //     db.all(sql,[obj[i]["first_name"], obj[i]["last_name"], obj[i]["email"]],(err, rows)=> {
                    //         if (err) return console.error(err.message)
                    //         // console.log(rows)
                    //         if(rows.length != 0){
                    //             res.writeHead(409, { 'Content-Type': 'text/plain'})
                    //             res.write("One or multiple students already exist, only post non-existent students")
                    //             res.end();return
                    //             flag = 1
                    //             return
                    //         }
                    //         })
                    //         if(flag == 1)
                    //             break
                    // }
                    for (var i = 0; i < obj.length; i++) {
                        // console.log(obj[i]["first_name"], obj[i]["last_name"], obj[i]["email"])
                        sql = 'INSERT INTO students(first_name, last_name, email) VALUES (?,?,?)'
                        db.run(sql, [obj[i]["first_name"], obj[i]["last_name"], obj[i]["email"]], (err) => {
                            if (err) return console.error(err.message)
                        })

                    }
                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                    res.write(body)
                    res.end();return
                    // console.log(body)
                    return
                });
            return}
            if (req.method == 'PUT') {
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.write("you can only put for only 1 student /student/{id}")
                res.end();return
            return}
            if (req.method == 'DELETE') {
                sql = 'DELETE FROM students WHERE 1=1'
                db.run(sql, [], (err) => {
                    if (err) return console.error(err.message)
                })
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.write("Deleted all students")
                res.end();return

            return}
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.write("Bad path/method")
            console.log("Bat path/method")
            res.end();return
        }
        if (URL.length >= 2) {
            if (parseInt(URL[1]).toString() == URL[1]) {
                if (URL.length == 2) {
                    id = parseInt(URL[1])
                    //      /students/id
                    if (req.method == 'GET') {
                        sql = 'SELECT * FROM students WHERE id = ?'
                        db.all(sql, [id], (err, rows) => {
                            if (err) {
                                console.error(err.message)
                                res.writeHead(500, { 'Content-Type': 'text/plain' })
                                res.write("Something went wrong while querying the database.")
                                res.end();return
                                return
                            }
                            if (rows.length == 0) {
                                res.writeHead(204, { 'Content-Type': 'application/json' })
                                res.write(JSON.stringify(rows))
                                res.end();return
                                return
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' })
                                console.log(rows)
                                res.write(JSON.stringify(rows))
                                res.end();return
                                return
                            }
                        })

                    return}
                    if (req.method == 'POST') {
                        res.writeHead(200, { 'Content-Type': 'text/plain' })
                        res.write("you can't post a student by ID since IDs are give automatically")
                        res.end();return
                    return}
                    if (req.method == 'PUT') {
                        body = undefined
                        let chunks = [];
                        req.on("data", (chunk) => {
                            chunks.push(chunk);
                        });
                        req.on("end", () => {
                            const data = Buffer.concat(chunks);
                            const querystring = data.toString();
                            body = querystring
                            // console.log(body)
                            try {
                                obj = JSON.parse(body)
                            } catch (error) {
                                res.writeHead(400, { 'Content-Type': 'text/plain' })
                                res.write("Unable to parse your bad JSON")
                                console.log('Unable to parse your bad JSON')
                                res.end();return
                                return
                            }
                            sql = 'INSERT OR REPLACE INTO students (id, first_name, last_name, email) VALUES(?, ?, ?, ?)'
                            console.log(id, obj['first_name'], obj['last_name'], obj['email'])
                            db.run(sql, [id, obj['first_name'], obj['last_name'], obj['email']], (err) => {
                                if (err) {
                                    console.error(err.message)
                                    res.writeHead(500, { 'Content-Type': 'text/plain' })
                                    res.write("Something went wrong while querying the database.")
                                    res.end();return
                                    return
                                }
                                else{
                                res.writeHead(200, { 'Content-Type': 'text/plain' })
                                res.write("Student with ID " + id.toString() + " putted")
                                res.end();return
                                }
                            }
                            )
                        })
                    return}
                    if (req.method == 'DELETE'){
                        db.run("delete from students where ID = " + id); 
                        // db.run("UPDATE students set id = id - 1 WHERE id > ROWID");
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.write("Deleted student with id "+ id.toString())
                        res.end();return

                    return}
                    res.writeHead(400, { 'Content-Type': 'text/plain' })
                    res.write("Bad path/method")
                    console.log("Bat path/method")
                    res.end();return
                }
                if (URL.length == 3) {
                    if (URL[2] == 'grades') {
                        id = parseInt(URL[1])
                        if (req.method == 'GET') {
                            sql = 'SELECT * FROM grades WHERE id_student = ?'
                            db.all(sql, [id], (err, rows) => {
                                if (err) {
                                    console.error(err.message)
                                    res.writeHead(500, { 'Content-Type': 'text/plain' })
                                    res.write("Something went wrong while querying the database.")
                                    res.end();return
                                    return
                                }
                                if (rows.length == 0) {
                                    res.writeHead(204, { 'Content-Type': 'application/json' })
                                    res.write(JSON.stringify(rows))
                                    res.end();return
                                    return
                                }
                                else {
                                    res.writeHead(200, { 'Content-Type': 'application/json' })
                                    console.log(rows)
                                    res.write(JSON.stringify(rows))
                                    res.end();return
                                    return
                                }
                            })
    
                        return}
                        if(req.method == 'POST'){
                            body = undefined
                let chunks = [];
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                req.on("end", () => {
                    const data = Buffer.concat(chunks);
                    const querystring = data.toString();
                    body = querystring
                    // console.log(body)
                    try {
                        obj = JSON.parse(body)
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' })
                        res.write("Unable to parse your bad JSON")
                        console.log('Unable to parse your bad JSON')
                        res.end();return
                        return
                    }
                    for (var i = 0; i < obj.length; i++) {
                        // console.log(obj[i]["first_name"], obj[i]["last_name"], obj[i]["email"])
                        sql = 'INSERT INTO grades(id_student, subject, value) VALUES (?,?,?)'
                        db.run(sql, [id, obj[i]["subject"], obj[i]["value"]], (err) => {
                            if (err) return console.error(err.message)
                        })

                    }
                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                    res.write(body)
                    res.end();return
                    // console.log(body)
                    return
                });
                        return}
                        if(req.method == 'PUT'){
                            res.writeHead(404, { 'Content-Type': 'text/plain' })
                            res.write("You'll have to modify the grade itself by PUT /grades/{id} (id of the grade)")
                            res.end();return
                        return}
                        if(req.method == 'DELETE'){
                            db.run("delete from grades where id_student = " + id);
                            res.writeHead(200, { 'Content-Type': 'application/json' })
                            res.write("Deleted grades from student with id " + id.toString())
                            res.end();return
                        return}
                        res.writeHead(400, { 'Content-Type': 'text/plain' })
                        res.write("Bad path/method")
                        console.log("Bat path/method")
                        res.end();return
                    }
                    res.writeHead(400, { 'Content-Type': 'text/plain' })
                    res.write("Bad path/method")
                    console.log("Bat path/method")
                    res.end();return
                }
                }
                res.writeHead(400, { 'Content-Type': 'text/plain' })
                res.write("Bad path/method")
                console.log("Bat path/method")
                res.end();return
            }
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.write("Bad path/method")
            console.log("Bat path/method")
            res.end();return
        }
    if (URL[0] == 'grades') {
            if (URL.length == 1) {
            if (req.method == 'GET') {
                sql = 'SELECT * FROM grades'
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.error(err.message)
                        res.writeHead(500, { 'Content-Type': 'text/plain' })
                        res.write("Something went wrong while querying the database.")
                        res.end();return
                        return
                    }
                    if (rows.length == 0) {
                        res.writeHead(204, { 'Content-Type': 'application/json' })
                        res.write(JSON.stringify(rows))
                        res.end();return
                        return
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        console.log(rows)
                        res.write(JSON.stringify(rows))
                        res.end();return
                        return
                    }
                })
            return}
            if (req.method == 'POST') {
                body = undefined
                let chunks = [];
                req.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                req.on("end", () => {
                    const data = Buffer.concat(chunks);
                    const querystring = data.toString();
                    body = querystring
                    // console.log(body)
                    try {
                        obj = JSON.parse(body)
                    } catch (error) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' })
                        res.write("Unable to parse your bad JSON")
                        console.log('Unable to parse your bad JSON')
                        res.end();return
                        return
                    }
                    // console.log(obj)
                    // flag = 0
                    // for(var i = 0; i < obj.length; i++){
                    //     sql = 'SELECT * FROM students where first_name LIKE ? AND last_name LIKE ? AND email LIKE ?'
                    //     db.all(sql,[obj[i]["first_name"], obj[i]["last_name"], obj[i]["email"]],(err, rows)=> {
                    //         if (err) return console.error(err.message)
                    //         // console.log(rows)
                    //         if(rows.length != 0){
                    //             res.writeHead(409, { 'Content-Type': 'text/plain'})
                    //             res.write("One or multiple students already exist, only post non-existent students")
                    //             res.end();return
                    //             flag = 1
                    //             return
                    //         }
                    //         })
                    //         if(flag == 1)
                    //             break
                    // }
                    for (var i = 0; i < obj.length; i++) {
                        // console.log(obj[i]["first_name"], obj[i]["last_name"], obj[i]["email"])
                        sql = 'INSERT INTO grades(id_student, subject, value) VALUES (?,?,?)'
                        db.run(sql, [obj[i]["id_student"], obj[i]["subject"], obj[i]["value"]], (err) => {
                            if (err) return console.error(err.message)
                        })

                    }
                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                    res.write(body)
                    res.end();return
                    // console.log(body)
                    return
                });
            return}
            if (req.method == 'PUT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' })
                res.write("you can only put for only 1 grade /grade/{id} (the id of the grade)")
                res.end();return
            return}
            if (req.method == 'DELETE') {
                sql = 'DELETE FROM grades WHERE 1=1'
                db.run(sql, [], (err) => {
                    if (err) return console.error(err.message)
                })
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.write("Deleted all grades")
                res.end();return

            return}
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.write("Bad path/method")
            console.log("Bat path/method")
            res.end();return
            }
            if (parseInt(URL[1]).toString() == URL[1]) {
                if (URL.length == 2) {
                    id =  parseInt(URL[1])
                    if (req.method == 'GET') {
                        sql = 'SELECT * FROM grades WHERE id = ?'
                        db.all(sql, [id], (err, rows) => {
                            if (err) {
                                console.error(err.message)
                                res.writeHead(500, { 'Content-Type': 'text/plain' })
                                res.write("Something went wrong while querying the database.")
                                res.end();return
                                return
                            }
                            if (rows.length == 0) {
                                res.writeHead(204, { 'Content-Type': 'application/json' })
                                res.write(JSON.stringify(rows))
                                res.end();return
                                return
                            }
                            else {
                                res.writeHead(200, { 'Content-Type': 'application/json' })
                                console.log(rows)
                                res.write(JSON.stringify(rows))
                                res.end();return
                                return
                            }
                        })

                    return}
                    if (req.method == 'POST') {
                        res.writeHead(200, { 'Content-Type': 'text/plain' })
                        res.write("you can't post a grade by ID since IDs are give automatically")
                        res.end();return
                    return}
                    if (req.method == 'PUT') {
                        body = undefined
                        let chunks = [];
                        req.on("data", (chunk) => {
                            chunks.push(chunk);
                        });
                        req.on("end", () => {
                            const data = Buffer.concat(chunks);
                            const querystring = data.toString();
                            body = querystring
                            // console.log(body)
                            try {
                                obj = JSON.parse(body)
                            } catch (error) {
                                res.writeHead(400, { 'Content-Type': 'text/plain' })
                                res.write("Unable to parse your bad JSON")
                                console.log('Unable to parse your bad JSON')
                                res.end();return
                                return
                            }
                            sql = 'INSERT OR REPLACE INTO grades (id, id_student, subject, value) VALUES(?, ?, ?, ?)'
                            console.log(id, obj['id_student'], obj['subject'], obj['value'])
                            db.run(sql, [id, obj['id_student'], obj['subject'], obj['value']], (err) => {
                                if (err) {
                                    console.error(err.message)
                                    res.writeHead(500, { 'Content-Type': 'text/plain' })
                                    res.write("Something went wrong while querying the database.")
                                    res.end();return
                                    return
                                }
                                else{
                                    res.writeHead(200, { 'Content-Type': 'text/plain' })
                                    res.write("Grade with ID " + id.toString() + " putted")
                                    res.end();return
                                    }
                            }
                            )
                        })
                    return}
                    if (req.method == 'DELETE'){
                        db.run("delete from grades where ID = " + id); 
                        // db.run("UPDATE students set id = id - 1 WHERE id > ROWID");
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.write("Deleted grade with id " + id.toString())
                        res.end();return

                    return}
                    res.writeHead(400, { 'Content-Type': 'text/plain' })
                    res.write("Bad path/method")
                    console.log("Bat path/method")
                    res.end();return
                }
                res.writeHead(400, { 'Content-Type': 'text/plain' })
                res.write("Bad path/method")
                console.log("Bat path/method")
                res.end();return
            }
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.write("Bad path/method")
            console.log("Bat path/method")
            res.end();return
        }
        res.writeHead(400, { 'Content-Type': 'text/plain' })
        res.write("Bad path/method")
        console.log("Bat path/method")
        res.end();return
    }



var server = http.createServer(servFunction);
server.listen(5000);
//in browser try http://localhost:5000/admin
console.log('Node.js web server at port 5000 is runnning...')
