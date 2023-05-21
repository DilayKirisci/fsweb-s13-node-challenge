// eylemlerle ilgili ara katman yazılımları yazın

const actionsModel = require("./actions-model");
const projectModel = require("../projects/projects-model");

async function validateActionId(req, res, next) {
	try {
		const action = await actionsModel.get(req.params.id);
		if (!action) {
			res.status(404).json({ message: "Action is not found" });
		} else {
			req.currentAction = action;
			next();
		}
	} catch (error) {
		next(error);
	}
}

async function validatePost(req, res, next) {
	try {
		const { description, project_id, notes } = req.body;
		if (
			!description ||
			description.length > 128 ||
			project_id <= 0 ||
			typeof project_id !== "number" ||
			!notes
		) {
			res.status(400).json({ message: "Please check the fields" });
		} else {
			const projectExists = await projectModel.get(project_id);
			if (!projectExists) {
				res
					.status(400)
					.json({ message: "Project with the given id does not exist" });
			} else {
				next();
			}
		}
	} catch (error) {}
}

module.exports = { validateActionId, validatePost };
