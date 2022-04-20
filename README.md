# [Issue Tracker](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker)

Created as part of [freeCodeCamp](https://www.freecodecamp.org) curriculum.

View on [Github](https://github.com/harmolipi/issue-tracker).

## Functionality

This is the [Issue Tracker](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker) project, where I make an API that allows you to view, create, update, and delete issues associated with projects.

## Thoughts

The trickiest part of this one was figuring out where projects themselves fit into the picture, since the emphasis of the assignment was just on issues associated with projects. Initially I started laying out a schema and model for projects, and associating them with issues, but eventually ended up just having `project` as a string field for issues, and interacting with them through the `/{project}` request param. I think that was the right way to go, given that no part of the assignment referred to the projects themselves.

So with that done, the rest was a pretty simple CRUD API.

God bless.

-Niko Birbilis
