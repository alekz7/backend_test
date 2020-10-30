const nodemon = require('nodemon');
const request = require('supertest');
const app = require('../app');
const db = require('../database/database');

describe('este test nos va a ayudar a probar el GET /users/:username, POST /users',()=>{

  before((done)=>{
    db.connect(() => {
      done();
    });
  })

  after((done)=>{
    db.close();
    done();
  })

  /*
  * Test the /GET route
  */

  it(' GET/:username respond with json containing a single user',done=>{
    request(app)
      .get('/users/alekz')
      .set('Accept', 'application/json')
      .expect('Content-Type',/json/)
      .expect(201, done);
  })

  /*
  * Test the /GET route
  */

  it(' GET/:username respond with json "user found" when the user exist',done=>{
    request(app)
      .get('/users/alekz')
      .set('Accept', 'application/json')
      .expect('Content-Type',/json/)
      .expect(201)
      .expect('"user found"')
      .end((err)=>{
        if(err) return done(err);
        done();
      })
  })

  /*
  * Test the /GET route
  */

  it(' GET/:username respond with json "user not found" when the user doesnt exist',done=>{
    request(app)
      .get('/users/xxxxxx')
      .set('Accept', 'application/json')
      .expect('Content-Type',/json/)
      .expect(404)
      .expect('"user not found"')
      .end((err)=>{
        if(err) return done(err);
        done();
      })
  })

  /*
  * Test the /POST route
  */

  it(' POST/:username respond with 201 when created',done=>{
    const data = {
      username :'alekz',
      password : 'alekz'
    }
    request(app)
      .post('/users')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type',/json/)
      .expect(201)
      .end(err=>{
        if(err) return done(err);
        done();
      })
  })

  /*
  * Test the /POST route
  */

  it(' POST/:username respond with 400 on bad request',done=>{    
    const data = {};
    request(app)
      .post('/users')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type',/json/)
      .expect(400)
      .expect('"usuario no creado"')
      .end(err=>{
        if(err) return done(err);
        done();
      })
  })

})