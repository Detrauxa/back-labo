const express= require('express');
const queries = require('./data');


const app = express();
const port= 42;

app.use(express.json());

app.get('/users', queries.getAll);
app.get('/event', queries.getAllEvent);

app.get('/users/:id', queries.getUserById);
app.get('/event/:id', queries.getEventById);

app.post('/users', queries.addUser);
app.post('/addevent',queries.addEvent);

app.patch('/users/:id', queries.updateUser);
app.patch('/event/:id', queries.updateEvent);

app.delete('/users/:id', queries.deleteUser);
app.delete('/event/:id', queries.deleteEvent);


app.listen(port,()=> {
    console.log(`la reponse est toujours: ${port}`)
});
