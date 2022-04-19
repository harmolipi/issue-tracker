'use strict';

const issue_controller = require('../controllers/issueController');

module.exports = function(app) {
    app
        .route('/api/issues/:project')

    .get(function(req, res) {
        const project = req.params.project;
        issue_controller.issue_view_get(req, res, project);
    })

    .post(function(req, res) {
        const project = req.params.project;
        issue_controller.issue_create_post(req, res, project);
    })

    .put(function(req, res) {
        const project = req.params.project;
    })

    .delete(function(req, res) {
        const project = req.params.project;
    });
};