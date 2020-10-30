const request = require('supertest');
const app = require('../app');

// testing get all users endpoint
describe('testing initial route hello world',()=>{
  it('respond with hello world',done=>{
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type',/json/)      
      .expect('"Hello World"')
      .expect(200, done);
  });
});
