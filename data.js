require('dotenv').config();
const bcrypt = require('bcrypt');
const sql= require('mssql') ;

const { DB_USER, DB_PSW, DB_NAME} = process.env;

const sqlConfig = {
    user: DB_USER,
    password: DB_PSW,
    database: DB_NAME,
    server: 'localhost',
    pool: {
        max:10,
        min:0,
        // IdleTimeoutMillis:300000
    },
    options:{
        trustServerCertificate: true
    }
}

const queries ={

    getAll: async(req,res) => {
        try{
            await sql.connect(sqlConfig)
            const result= await sql.query `SELECT * FROM users`

            console.log(result)
            if (result) {
                res.sendStatus(200)
            }
        }catch (err) {
            console.error(err);
            res.sendStatus(404)
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params; 
            await sql.connect(sqlConfig);

            const result = await sql.query `SELECT * FROM users WHERE users_id = ${id}` 
            console.log(result)
            if (result) {
                res.sendStatus(200);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    }, 

    addUser: async (req, res) => {
        try {
            await sql.connect(sqlConfig);

            const { password, email, firstname, lastname, birth_date, adress, num_tel, } = req.body;

            console.log(password)
            const hashedPassword = bcrypt.hashSync(password, 10) 

            

            const result = await sql.query `INSERT INTO users (first_name, last_name, email, birth_date, adress, num_tel, users_password)
                                            VALUES (${firstname}, ${lastname}, ${email}, ${birth_date}, ${adress}, ${num_tel}, ${hashedPassword} )`
            console.log(result)
            if (result) {
                res.send('Ajout effectué').status(200);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },

    updateUser: async (req, res) => {
        try {
            await sql.connect(sqlConfig);

            const { id } = req.params;
            const { firstname, lastname, email, newPassword, oldPassword, birth_date, adress, num_tel } = req.body;

            const userQuery = await sql.query `SELECT * FROM users WHERE users_id = ${id}`
            const user = userQuery.recordset[0]; 

            let hashedPassword;
            if (newPassword && oldPassword) { 

                const isPasswordValid = bcrypt.compareSync(oldPassword, user.password) 

                if (!isPasswordValid) { 
                    return res.status(401).send('Invalid password');
                }

                else {
                    hashedPassword = bcrypt.hashSync(newPassword, 10); 
                }
            }

            if (!user) {
                console.log('No suche user exist');
                res.sendStatus(404);
            }

            let update;
            if (firstname && lastname && email && hashedPassword) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email},
                WHERE users_id = ${id}`
            } else if (firstname && lastname && hashedPassword) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, user_password = ${hashedPassword}
                WHERE users_id = ${id}`
            } else if (firstname && lastname) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname},
                WHERE users_id = ${id}`
            } else if (firstname && email && hashedPassword) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, email = ${email}, users_password = ${hashedPassword}
                WHERE users_id = ${id}`
            } else if (firstname && email) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, email = ${email}
                WHERE users_id = ${id}`
            } else if (lastname && email && hashedPassword) {
                update = sql.query `UPDATE users SET last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}
                WHERE users_id = ${id}`
            } else if (lastname && email) {
                update = sql.query `UPDATE users SET last_name = ${lastname}, email = ${email}
                WHERE users_id = ${id}`
            } else if (firstname && hashedPassword) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, users_password = ${hashedPassword}
                WHERE users_id = ${id}`
            } else if (firstname) {
                update = sql.query `UPDATE users SET first_name = ${firstname}
                WHERE users_id = ${id}`
            } else if (lastname && hashedPassword) {
                update = sql.query `UPDATE users SET last_name = ${lastname}, user_password = ${hashedPassword}
                WHERE users_id = ${id}`
            } else if (lastname) {
                update = sql.query `UPDATE users SET last_name = ${lastname}
                WHERE users_id = ${id}`
            } else if (email && hashedPassword) {
                update = sql.query `UPDATE users SET email = ${email}, users_password = ${hashedPassword} 
                WHERE users_id = ${id}`
            } else if (email) {
                update = sql.query `UPDATE users SET email = ${email} 
                WHERE id = ${id}`
            } else if (hashedPassword) {
                update = sql.query `UPDATE users SET users_password = ${hashedPassword} 
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && hashedPassword && birth_date && adress ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && hashedPassword && birth_date && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && hashedPassword && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email},  
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname  && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && email && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname},  email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( lastname && email && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && hashedPassword && birth_date ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email  && birth_date && adress ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email},  
                birth_date = ${birth_date}, adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (firstname && lastname  && hashedPassword && birth_date && adress ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname},  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (firstname  && email && hashedPassword && birth_date && adress ) {
                update = sql.query `UPDATE users SET first_name = ${firstname},  email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (lastname && email && hashedPassword && birth_date && adress ) {
                update = sql.query `UPDATE users SET last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && birth_date  && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, , 
                birth_date = ${birth_date}, ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && hashedPassword && birth_date && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname},  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && email && hashedPassword && birth_date && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( lastname && email && hashedPassword && birth_date  && num_tel ) {
                update = sql.query `UPDATE users SET last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email &&  adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && hashedPassword  && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, users_password = ${hashedPassword}, 
                adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname  && email && hashedPassword && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname},  email = ${email}, users_password = ${hashedPassword}, 
                 adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (lastname && email && hashedPassword && adress && num_tel ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email  && birth_date ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email},
                birth_date = ${birth_date}
                WHERE users_id = ${id}`
            } else if (firstname && lastname  && hashedPassword && birth_date  ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date},
                WHERE users_id = ${id}`
            } else if (firstname  && email && hashedPassword && birth_date ) {
                update = sql.query `UPDATE users SET first_name = ${firstname},  email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, 
                WHERE users_id = ${id}`
            } else if ( lastname && email && hashedPassword && birth_date  ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, 
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email  && adress  ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email},  adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (firstname && lastname  && hashedPassword  && adress  ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, users_password = ${hashedPassword}, 
                 adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (firstname  && email && hashedPassword && adress  ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, email = ${email}, users_password = ${hashedPassword}, 
                adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (lastname && email && hashedPassword && adress  ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                 adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email  && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname  && hashedPassword  && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname},  users_password = ${hashedPassword}, 
                num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname  && email && hashedPassword  && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname},  email = ${email}, users_password = ${hashedPassword}, 
                num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( lastname && email && hashedPassword && num_tel ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( lastname && email && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname  && email && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname  && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname},  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && email && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, email = ${email}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && lastname && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, last_name = ${lastname}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && email  && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, email = ${email},
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (lastname && email && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname}, email = ${email},  
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname},  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (lastname  && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname},  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (firstname && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET first_name = ${firstname}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (lastname  && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET  last_name = ${lastname},
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (email &&  birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET  email = ${email},
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( email && hashedPassword && birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users SET  email = ${email}, users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (email && adress && num_tel ) {
                update = sql.query `UPDATE users SET  email = ${email}, 
                adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( email && birth_date && num_tel ) {
                update = sql.query `UPDATE users SET  email = ${email},  
                birth_date = ${birth_date}, ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( email && hashedPassword && birth_date && adress ) {
                update = sql.query `UPDATE users SET  email = ${email},  
                birth_date = ${birth_date}, adress = ${adress} 
                WHERE users_id = ${id}`
            } else if ( email  && birth_date ) {
                update = sql.query `UPDATE users SET  email = ${email}, 
                birth_date = ${birth_date}
                WHERE users_id = ${id}`
            } else if ( email  && adress ) {
                update = sql.query `UPDATE users SET email = ${email}, 
                 adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (email  && num_tel ) {
                update = sql.query `UPDATE users SET  email = ${email}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (hashedPassword && adress && num_tel ) {
                update = sql.query `UPDATE users SET users_password = ${hashedPassword},  adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( hashedPassword && birth_date  && num_tel ) {
                update = sql.query `UPDATE users SET  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( hashedPassword && birth_date && adress  ) {
                update = sql.query `UPDATE users SET  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}, adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (hashedPassword && birth_date  ) {
                update = sql.query `UPDATE users SET  users_password = ${hashedPassword}, 
                birth_date = ${birth_date}
                WHERE users_id = ${id}`
            } else if (hashedPassword && adress ) {
                update = sql.query `UPDATE users SET  users_password = ${hashedPassword}, 
                 adress = ${adress} 
                WHERE users_id = ${id}`
            } else if (hashedPassword  && num_tel ) {
                update = sql.query `UPDATE users SET  users_password = ${hashedPassword}, 
                num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( birth_date && adress && num_tel ) {
                update = sql.query `UPDATE users  birth_date = ${birth_date}, adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( birth_date  && num_tel ) {
                update = sql.query `UPDATE users SET 
                birth_date = ${birth_date}, num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if (birth_date ) {
                update = sql.query `UPDATE users SET 
                birth_date = ${birth_date}
                WHERE users_id = ${id}`
            } else if (adress && num_tel ) {
                update = sql.query `UPDATE users SET  adress = ${adress} ,num_tel ${num_tel}
                WHERE users_id = ${id}`
            } else if ( adress  ) {
                update = sql.query `UPDATE users SET  adress = ${adress}
                WHERE users_id = ${id}`
            } else if ( num_tel ) {
                update = sql.query `UPDATE users SET num_tel ${num_tel}
                WHERE users_id = ${id}`
            }

            if (update) {
                const result = await update;
                if (result) {
                    res.send('Modification effectuée').status(200);
                }
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },

    deleteUser: async (req, res) => {
        try {
            await sql.connect(sqlConfig);
            const { id } = req.params; 

            const result = await sql.query `DELETE FROM users WHERE users_id = ${id}` 
            console.log(result)
            if (result) {
                res.send('Suppression effectuée').status(204);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },

    getAllEvent: async(req,res) => {
        try{
            await sql.connect(sqlConfig)

            const result= await sql.query `SELECT * FROM usersEvent`

            console.log(result)
            if (result) {
                res.sendStatus(200)
            }
        }catch (err) {
            console.error(err);
            res.sendStatus(404)
        }
    },
    getEventById: async (req, res) => {
        try {
            const { id } = req.params; 

            await sql.connect(sqlConfig);

            const result = await sql.query `SELECT * FROM usersEvent WHERE event_id = ${id}` 
            console.log(result)
            if (result) {
                res.sendStatus(200);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    }, 
    addEvent: async (req, res) => {
        try {
            await sql.connect(sqlConfig);

            const { event_name , event_start , event_fin , event_descrip } = req.body;

            const result = await sql.query `INSERT INTO usersEvent (event_name, event_start, event_fin , event_descript, username)
                                            VALUES (${event_name}, ${event_start}, ${event_fin}, ${event_descrip})`
            console.log(result)
            if (result) {
                res.send('Ajout effectué').status(200);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },
    updateEvent: async (req, res) => {
        try {
            await sql.connect(sqlConfig);

            const { id } = req.params;
            const { event_name, event_start, event_fin, event_descrip} = req.body;

            const userQuery = await sql.query `SELECT * FROM usersEvent WHERE event_id = ${id}`
            
            let update;
            if (event_name && event_start && event_fin && event_descrip) {
                update = sql.query `UPDATE usersEvent SET event_name = ${event_name}, event_start = ${event_start}, event_fin = ${event_fin}, event_descrip = ${event_descrip}
                WHERE event_id = ${id}`
            } else if (event_name && event_start && event_fin) {
                update = sql.query `UPDATE users SET event_name = ${event_name}, event_start = ${event_start}, event_fin = ${event_fin},
                WHERE event_id = ${id}`
            }
            else if (event_name && event_start ) {
                update = sql.query `UPDATE users SET event_name = ${event_name}, event_start = ${event_start}, 
                WHERE event_id = ${id}`
            }
            else if (event_name ) {
                update = sql.query `UPDATE users SET event_name = ${event_name}
                WHERE event_id = ${id}`
            }
            else if (event_name && event_fin) {
                update = sql.query `UPDATE users SET event_name = ${event_name}, event_fin = ${event_fin},
                WHERE event_id = ${id}`
            }
            else if (event_name && event_descrip) {
                update = sql.query `UPDATE users SET event_name = ${event_name}, event_descrip = ${event_descrip}
                WHERE event_id = ${id}`
            }else if (event_start && event_fin) {
                update = sql.query `UPDATE users SET event_start = ${event_start}, event_fin = ${event_fin}
                WHERE event_id = ${id}`
            }else if (event_start && event_descrip) {
                update = sql.query `UPDATE users SET  event_start = ${event_start}, event_descrip = ${event_descrip},
                WHERE event_id = ${id}`
            }else if (event_fin && event_descrip ) {
                update = sql.query `UPDATE users SET event_fin = ${event_fin}, event_descrip = ${event_descrip}
                WHERE event_id = ${id}`
            }
            else if ( event_start ) {
                update = sql.query `UPDATE users SET  event_start = ${event_start}
                WHERE event_id = ${id}`
            }
            else if (event_fin) {
                update = sql.query `UPDATE users SET  event_fin = ${event_fin}
                WHERE event_id = ${id}`
            }
            else if (event_descrip ) {
                update = sql.query `UPDATE users SET event_descrip = ${event_descrip}
                WHERE event_id = ${id}`
            }
            
            if (update) {
                const result = await update;
                if (result) {
                    res.send('Modification effectuée').status(200);
                }
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        
        }
    },

    deleteEvent: async (req, res) => {
        try {
            await sql.connect(sqlConfig);
            const { id } = req.params; 

            const result = await sql.query `DELETE FROM usersEvent WHERE event_id = ${id}` 
            console.log(result)
            if (result) {
                res.send('Suppression effectuée').status(204);
            }
        } catch (err) {
            console.error(err);
            res.sendStatus(404);
        }
    },
}


module.exports = queries