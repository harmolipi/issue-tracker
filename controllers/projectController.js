const Project = require('../models/project');

exports.project_view_get = (req, res, next) => {
    Project.find({}, (err, projects) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(projects);
    });
};