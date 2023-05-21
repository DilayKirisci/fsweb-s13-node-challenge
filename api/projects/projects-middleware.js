// projects ara yazılımları buraya
const projectsModel = require("./projects-model");

async function validateProjectId(req, res, next) {
	try {
		const project = await projectsModel.get(req.params.id);
		if (!project) {
			res.status(404).json({ message: "project not found" });
		} else {
			req.currentProject = project;
			next();
		}
	} catch (error) {
		next(error);
	}
}

async function validatePost(req, res, next) {
	try {
		const { name, description } = req.body;
		if (!name || !description) {
			res.status(400).json({ message: "Required fields must be filled." });
		} else {
			next();
		}
	} catch (error) {
		next(error);
	}
}

module.exports = { validateProjectId, validatePost };
