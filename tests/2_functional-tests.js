const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { suite, test } = require('mocha');
const Issue = require('../models/issue');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let id1;
    let id2;
    let id3;

    this.beforeEach(async() => {
        await Issue.deleteMany({});

        const test1 = new Issue({
            issue_title: 'test1 title',
            issue_text: 'test1 text',
            created_by: 'test1 user',
            assigned_to: 'test1 assignee',
            status_text: 'test1 status',
            project: 'apitest',
            open: true,
        });

        const test2 = new Issue({
            issue_title: 'test2 title',
            issue_text: 'test2 text',
            created_by: 'test2 user',
            assigned_to: 'test2 assignee',
            status_text: 'test2 status',
            project: 'apitest',
            open: true,
        });

        const test3 = new Issue({
            issue_title: 'test3 title',
            issue_text: 'test3 text',
            created_by: 'test3 user',
            assigned_to: 'test3 assignee',
            status_text: 'test3 status',
            project: 'apitest',
            open: false,
        });

        const saved1 = await test1.save();
        const saved2 = await test2.save();
        const saved3 = await test3.save();

        id1 = saved1._id;
        id2 = saved2._id;
        id3 = saved3._id;
    });

    suite('Create issues', () => {
        test('Create issue with every field: POST request to /api/issues/{project}', async() => {
            const res = await chai.request(server).post('/api/issues/apitest').send({
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Every field',
                assigned_to: 'Chai and Mocha',
                status_text: 'In QA',
            });
            assert.equal(res.status, 201);
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'text');
            assert.equal(res.body.created_by, 'Functional Test - Every field');
            assert.equal(res.body.assigned_to, 'Chai and Mocha');
            assert.equal(res.body.status_text, 'In QA');
        });

        test('Create an issue with only required fields: POST request to /api/issues/{project', async() => {
            const res = await chai.request(server).post('/api/issues/apitest').send({
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Required fields',
            });

            assert.equal(res.status, 201);
            assert.equal(res.body.issue_title, 'Title');
            assert.equal(res.body.issue_text, 'text');
            assert.equal(res.body.created_by, 'Functional Test - Required fields');
            assert.equal(res.body.assigned_to, '');
            assert.equal(res.body.status_text, '');
        });

        test('Create an issue with missing required fields: POST request to /api/issues/{project}', async() => {
            const res = await chai.request(server).post('/api/issues/apitest').send({
                issue_title: 'Title',
                issue_text: 'text',
            });

            assert.equal(res.body.error, 'required field(s) missing');
        });
    });

    suite('View issues', () => {
        test('View issues on a project: GET request to /api/issues/{project}', async() => {
            const res = await chai.request(server).get('/api/issues/apitest');

            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
        });

        test('View issues on a project with one filter: GET request to /api/issues/{project}', async() => {
            const res = await chai
                .request(server)
                .get('/api/issues/apitest?open=true');

            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.equal(res.body[0].open, true);
            assert.equal(
                res.body.length,
                res.body.filter((issue) => issue.open).length
            );
        });

        test('View issues on a project with multiple filters: GET request to /api/issues/{project}', async() => {
            const res = await chai
                .request(server)
                .get('/api/issues/apitest?open=true&assigned_to=test1 assignee');

            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_on');
            assert.property(res.body[0], 'updated_on');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'assigned_to');
            assert.property(res.body[0], 'open');
            assert.property(res.body[0], 'status_text');
            assert.property(res.body[0], '_id');
            assert.equal(res.body[0].open, true);
            assert.equal(
                res.body.length,
                res.body.filter(
                    (issue) => issue.open && issue.assigned_to === 'test1 assignee'
                ).length
            );
        });
    });

    suite('Update issues', () => {
        test('Update one field on an issue: PUT request to /api/issues/{project}', async() => {
            const before = await Issue.findById(id3);

            const res = await chai.request(server).put('/api/issues/apitest').send({
                _id: id3,
                issue_title: 'Updated title',
            });

            const after = await Issue.findById(id3);

            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, id3);
            assert.equal(after.issue_title, 'Updated title');
            assert.notEqual(before.updated_on, after.updated_on);
            assert.notDeepEqual(before, after);
        });

        test('Update multiple fields on an issue: PUT request to /api/issues/{project}', async() => {
            const res = await chai.request(server).put('/api/issues/apitest').send({
                _id: id2,
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Required fields',
                assigned_to: 'Chai and Mocha',
                status_text: 'In QA',
                open: false,
            });

            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, id2);
        });

        test('Update an issue with missing _id: PUT request to /api/issues/{project}', async() => {
            const res = await chai.request(server).put('/api/issues/apitest').send({
                issue_title: 'Title',
                issue_text: 'text',
            });
            assert.equal(res.body.error, 'missing _id');
        });

        test('Update an issue with no fields to update: PUT request to /api/issues/{project}', async() => {
            const res = await chai.request(server).put('/api/issues/apitest').send({
                _id: id3,
            });

            assert.equal(res.body.error, 'no update field(s) sent');
            assert.equal(res.body._id, id3);
        });

        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', async() => {
            const res = await chai.request(server).put('/api/issues/apitest').send({
                _id: '123',
                issue_title: 'Title',
                issue_text: 'text',
                created_by: 'Functional Test - Required fields',
                assigned_to: 'Chai and Mocha',
                status_text: 'In QA',
            });
            assert.equal(res.body.error, 'could not update');
            assert.equal(res.body._id, '123');
        });
    });

    suite('Delete issues', () => {
        test('Delete an issue: DELETE request to /api/issues/{project}', async() => {
            const res = await chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: id1,
                });
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');
            assert.equal(res.body._id, id1);
        });

        test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', async() => {
            const res = await chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: '123',
                });
            assert.equal(res.body.error, 'could not delete');
            assert.equal(res.body._id, '123');
        });

        test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', async() => {
            const res = await chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({});
            assert.equal(res.body.error, 'missing _id');
        });
    });
});