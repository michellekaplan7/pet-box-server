// const express = require('express');
// const { response } = require('express');
import express, { response } from 'express'
const app = express();
// const cors = require('cors');
import cors from 'cors'
app.use(express.static('public'));
app.use(cors());


app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';

app.get('/', (request, response) => {
  response.send('Oh hey Pet Box');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

app.locals.pets = [
    { id: 'a1', name: 'Rover', type: 'dog' },
    { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
    { id: 'c3', name: 'Craisins', type: 'cat' }
  ];

  app.get('/api/v1/pets', (request, response) => {
    const pets = app.locals.pets;
  
    response.json({ pets });
  });

// Let’s say we wanted to get a specific pet based on its ID. 
// We want anyone to be able to retrieve a single resource by indicating the 
// ID associated with the object they want to retrieve. 
// In order to do this, we must add a dynamic portion to our URL.

// app.get('/api/v1/pets/:id', (request, response) => {
//     response.json({
//       id: request.params.id
//     });
//   });

// Here is the feature we want to implement: when a user requests a 
// pet by its id, we want to return that pet’s pet and id.

//   app.get('/api/v1/pets/:id', (request, response) => {
//     const { id } = request.params;
//     const pet = app.locals.pets.find(pet => pet.id === id);
  
//     response.status(200).json(pet);
//   });

//   Let’s go ahead and take this for a spin. 
//   It kind of works. If they give us the right id, they’ll get the pet. 
//   But they don’t get an error if they give us an invalid id. It would be 
//   preferable to send them a 404 status code, which let’s the browser know 
//   that the resource was not found.

app.get('/api/v1/pets/:id', (request, response) => {
    const { id } = request.params;
    const pet = app.locals.pets.find(pet => pet.id === id);
    if (!pet) {
      return response.sendStatus(404);
    }
  
    response.status(200).json(pet);
  });

  app.use(express.json());

//   app.post('/api/v1/pets', (request, response) => {
//     const id = Date.now();
//     const { name, type } = request.body;
  
//     app.locals.pets.push({ id, name, type });
  
//     response.status(201).json({ id, name, type });
//   });

//   Let’s add some error handling to our previous example. 
//   We are going to assume that both ‘name’ and ‘type’ are 
//   required properties when submitting a new pet, and we want 
//   to respond with an error if one of them is missing:

app.post('/api/v1/pets', (request, response) => {
    const id = (Date.now().toString());
    const pet = request.body;
  
    for (let requiredParameter of ['name', 'type']) {
      if (!pet[requiredParameter]) {
        return response
          .status(422)
          .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` });
      }
    }
  
    const { name, type } = pet;
    app.locals.pets.push({ name, type, id });
    response.status(201).json({ name, type, id });
  });

  //------------------------------------------------------------------------------------
  //DELETE

  app.delete('/api/v1/pets/:id', (request, response) => {
    const { id } = request.params;
    const pets = app.locals.pets
    const pet = app.locals.pets.find(pet => pet.id === id);
    if (!pet) {
      return response
  .status(422)
  .send({ error: `Something is wrong here!` });
  }
    const index = pets.indexOf(pet);
   pets.splice(index, 1);
   response.status(201).json(pet);
  })

    //------------------------------------------------------------------------------------
    //PATCH

    app.patch('/api/v1/pets/:id', (request, response) => {
      const { id } = request.params;
      console.log(request.body)
      const ops = request.body
      const pet = app.locals.pets.find(pet => pet.id === id)
      for(let i = 0; i < ops.length; i++) {
        let operation = ops[i];
        if(operation.op === "replace") {
          let key = operation.path.replace('/','');
          if(!pet[key]){
            return response
    .status(422)
    .send({ error: `Path doesn't exist.` });
    }
     pet[key] = operation.value;
    }
    }
     response.status(201).json(pet);
    })

      //------------------------------------------------------------------------------------
      
      app.get('/', (request, response) => {
        // response is actually handled by static asset express middleware
        // defined by app.use(express.static('public'));
      });