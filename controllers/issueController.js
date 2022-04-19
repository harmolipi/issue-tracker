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
            let error;
            if (
                err.errors &&
                err.errors.issue_title &&
                err.errors.issue_title.kind === 'required'
            ) {
                error = 'required field(s) missing';
            } else if (
                err.errors &&
                err.errors.issue_text &&
                err.errors.issue_text.kind === 'required'
            ) {
                error = 'required field(s) missing';
            } else if (
                err.errors &&
                err.errors.created_by &&
                err.errors.created_by.kind === 'required'
            ) {
                error = 'required field(s) missing';
            } else {
                error = err;
            }

            res.json({ error: error });
        }
        res.status(201).json(issue);
    });
};

exports.issue_view_get = (req, res, project, next) => {
    Issue.find({ project: req.params.project, ...req.query }, (err, issues) => {
        if (err) {
            res.send(err);
        }
        res.json(issues);
    });
};

exports.issue_update_put = (req, res, next) => {
    const query = {...req.body };

    Object.keys(query).forEach((attribute) => {
        if (query[attribute] === '') {
            delete query[attribute];
        }
    });

    if (!query._id) {
        res.json({ error: 'missing _id' });
        return;
    }

    Issue.findByIdAndUpdate(
        query._id, {...query, updated_on: new Date() }, { new: true },
        (err, issue) => {
            if (Object.keys(query).length === 1) {
                res.json({ error: 'no update field(s) sent', _id: query._id });
                return;
            } else if (err || !issue) {
                res.status(400).json({ error: 'could not update', _id: query._id });
                return;
            }
            res.json({ result: 'successfully updated', _id: issue._id });
            return;
        }
    );
};

exports.issue_delete = (req, res, next) => {
    if (!req.body._id) {
        res.json({ error: 'missing _id' });
        return;
    }

    Issue.findByIdAndRemove(req.body._id, (err, issue) => {
        if (err || !issue) {
            res.json({ error: 'could not delete', _id: req.body._id });
            return;
        }
        res.json({ result: 'successfully deleted', _id: issue._id });
        return;
    });
};