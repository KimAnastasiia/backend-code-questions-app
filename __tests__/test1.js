const app = require('../app');
const request = require('supertest');
let insertedTestId;

  describe('Insert test', () => {
    it('Get all test of the user"', async () => {
      const response = await request(app).post('/test/createdTest?access_token=1&testName=test1');
      expect(response.statusCode).toBe(200);
      insertedTestId = JSON.parse(response.text).insertId
    });
  });

 
  describe('GET /', () => {
    it('Get all test of the user"', async () => {
      const response = await request(app).get('/test?access_token=1');
      expect(response.statusCode).toBe(200);
      let objResponse = JSON.parse(response.text)
      expect(objResponse.length).toBe(1);
    });
  });
  /*
  describe('GET /', () => {
    it('Get test of the user by id', async () => {
      const response = await request(app).get(`/test/${insertedTestId}?access_token=1`);
      expect(response.statusCode).toBe(200);
      let objResponse = JSON.parse(response.text)
      console.log(objResponse)//[{"email": "test@test.com", "id": 149, "name": "test1"}]
      expect(objResponse).toBe([{"email":"test@test.com","id":insertedTestId,"name":"test1"} ]);
    });
  });
*/
  describe('Delete test', () => {
    it('Delete test"', async () => {
      const response = await request(app).delete('/test?access_token=1&testId='+insertedTestId);
      expect(response.statusCode).toBe(200);
    });
  });

  /**
const response = await request(app)
  .post('/test/createdTest?access_token=1&testName=test1')
  .send({
    key1: 'value1',
    key2: 'value2',
    // Add more key-value pairs as needed
  }); 
    
   */


// https://www.freecodecamp.org/news/end-point-testing/
// npm run test