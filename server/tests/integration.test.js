const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma'); // Assuming standard prisma export, or we just rely on API response

describe('Integration Test: API to DB Interaction', () => {
    it('should retrieve a list of products from the database', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
