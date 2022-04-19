const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { suite, test } = require('mocha');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    suite('Create issues', () => {
        test('Create issue with every field: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Every field',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end((err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(res.body.created_by, 'Functional Test - Every field');
                    assert.equal(res.body.assigned_to, 'Chai and Mocha');
                    assert.equal(res.body.status_text, 'In QA');
                    done();
                });
        });

        test('Create an issue with only required fields: POST request to /api/issues/{project', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields',
                })
                .end((err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(
                        res.body.created_by,
                        'Functional Test - Required fields'
                    );
                    assert.equal(res.body.assigned_to, '');
                    assert.equal(res.body.status_text, '');
                    done();
                });
        });

        test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                })
                .end((err, res) => {
                    // assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });
    });

    suite('View issues', () => {
        test('View issues on a project: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
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
                    done();
                });
        });

        test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest?open=true')
                .end((err, res) => {
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
                    done();
                });
        });

        test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .get('/api/issues/apitest?open=true&assigned_to=Chai and Mocha')
                .end((err, res) => {
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
                    done();
                });
        });
    });

    suite('Update issues', () => {
        test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '5e9f9c8f9c8f9c8f9c8f9c8f',
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(
                        res.body.created_by,
                        'Functional Test - Required fields'
                    );
                    assert.equal(res.body.assigned_to, 'Chai and Mocha');
                    assert.equal(res.body.status_text, 'In QA');
                    done();
                });
        });

        test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '5e9f9c8f9c8f9c8f9c8f9c8f',
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                    open: false,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.issue_title, 'Title');
                    assert.equal(res.body.issue_text, 'text');
                    assert.equal(
                        res.body.created_by,
                        'Functional Test - Required fields'
                    );
                    assert.equal(res.body.assigned_to, 'Chai and Mocha');
                    assert.equal(res.body.status_text, 'In QA');
                    assert.equal(res.body.open, false);
                    assert.equal(res.body.result, 'successfully updated');
                    done();
                });
        });

        test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });

        test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '5e9f9c8f9c8f9c8f9c8f9c8f',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'no update field(s) sent');
                    done();
                });
        });

        test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .put('/api/issues/apitest')
                .send({
                    _id: '5e9f9c8f9c8f9c8f9c8f9c8f',
                    issue_title: 'Title',
                    issue_text: 'text',
                    created_by: 'Functional Test - Required fields',
                    assigned_to: 'Chai and Mocha',
                    status_text: 'In QA',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, '_id error');
                    done();
                });
        });
    });

    suite('Delete issues', () => {
        test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: '5e9f9c8f9c8f9c8f9c8f9c8f',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body['_id'], '5e9f9c8f9c8f9c8f9c8f9c8f');
                    done();
                });
        });

        test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: '5e9f9c8f9c8f9c8f9c8f9c8f',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body['_id'], '5e9f9c8f9c8f9c8f9c8f9c8f');
                    done();
                });
        });

        test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, '_id error');
                    assert.equal(res.body['_id'], '');
                    done();
                });
        });
    });
});