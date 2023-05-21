// "eylem" routerını buraya yazın
const express = require("express");
const actionsModel = require("./actions-model");
const actionsMw = require("./actions-middlware");
const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const allActions = await actionsModel.get();
		res.json(allActions || []);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", actionsMw.validateActionId, (req, res, next) => {
	try {
		res.json(req.currentAction);
	} catch (error) {
		next(error);
	}
});

router.post("/", actionsMw.validatePost, async (req, res, next) => {
	const { project_id, notes, description, completed } = req.body;
	try {
		let postData = {
			project_id: project_id,
			notes: notes,
			description: description,
			completed: completed,
		};

		const insertedPost = await actionsModel.insert(postData);
		res.status(201).json(insertedPost);
	} catch (error) {
		next(error);
	}
});

router.put(
	"/:id",
	actionsMw.validateActionId,
	actionsMw.validatePost,
	async (req, res, next) => {
		const { project_id, notes, description, completed } = req.body;
		try {
			let postData = {
				project_id: project_id,
				notes: notes,
				description: description,
				completed: completed,
			};

			const updatedAction = await actionsModel.update(req.params.id, postData);
			res.json(updatedAction);
		} catch (error) {
			next(error);
		}
	}
);

router.delete(
	"/:id",
	actionsMw.validateActionId,

	async (req, res, next) => {
		try {
			await actionsModel.remove(req.params.id);
			res.json({ message: "Action removed succesfully" });
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
