const router = require("express").Router();
const projectsModel = require("./projects-model");
const projectMw = require("./projects-middleware");

router.get("/", async (req, res, next) => {
	try {
		const projects = await projectsModel.get();
		if (!projects) {
			res.json([]);
		} else {
			res.json(projects);
		}
	} catch (e) {
		next(e);
	}
});

router.get("/:id", projectMw.validateProjectId, async (req, res, next) => {
	try {
		res.json(req.currentProject);
	} catch (e) {
		next(e);
	}
});

router.post("/", projectMw.validatePost, async (req, res, next) => {
	try {
		const { name, description, completed } = req.body;
		const newProject = {
			name: name,
			description: description,
			completed: completed,
		};
		const insertedProject = await projectsModel.insert(newProject);
		res.status(201).json(insertedProject);
	} catch (e) {
		next(e);
	}
});

router.put(
	"/:id",
	projectMw.validatePost,
	projectMw.validateProjectId,
	async (req, res, next) => {
		try {
			const { name, description, completed } = req.body;
			const newProject = {
				name,
				description,
				completed,
			};
			const updatedProject = await projectsModel.update(
				req.params.id,
				newProject
			);
			res.json(updatedProject);
		} catch (e) {
			next(e);
		}
	}
);
router.delete("/:id", projectMw.validateProjectId, async (req, res, next) => {
	try {
		await projectsModel.remove(req.params.id);
		res.json({ message: "project deleted successfully" });
	} catch (e) {
		next(e);
	}
});
router.get(
	"/:id/actions",
	projectMw.validateProjectId,
	async (req, res, next) => {
		try {
			const projectActions = await projectsModel.getProjectActions(
				req.params.id
			);
			res.json(projectActions || []);
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
