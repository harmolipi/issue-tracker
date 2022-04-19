const Issue = require('../models/issue');

exports.issue_create_post = (req, res, project, next) => {
    const issue = new Issue({
        _id: req.body._id,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        project: project,
    });

    issue.save((err, issue) => {
        if (err) {
            const error =
                err.errors.issue_title.kind === 'required' ||
                err.errors.issue_text.kind === 'required' ||
                err.errors.created_by.kind === 'required' ?
                'required field(s) missing' :
                err;
            res.status(500).json({ error: error });
        }
        res.status(201).json(issue);
    });
};

exports.issue_view_get = (req, res, next) => {
    res.send('NOT IMPLEMENTED: Issue view GET');
};

exports.issue_update_put = (req, res, next) => {
    res.send('NOT IMPLEMENTED: Issue update PUT');
};

exports.issue_delete = (req, res, next) => {
    res.send('NOT IMPLEMENTED: Issue delete');
};