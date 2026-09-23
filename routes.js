const express = require("express");
const apiRoutes = express.Router();
const userController = require("./controllers/user");
const authMiddleware = require("./util/middleWare");
const taskController = require("./controllers/task");
const projectController = require("./controllers/project");
const historyController = require("./controllers/history");

apiRoutes.get("/create", (req, res) => {
  res.status(200).json({
    error: false,
    message: "Kanban Board Backend Running",
  });
});

apiRoutes.post("/createUser", userController.createUser);
apiRoutes.get("/getUser", authMiddleware.verifyToken, userController.getUser);
apiRoutes.put("/updateUser/:id", userController.updateUser);
apiRoutes.delete("/deleteUser/:id", userController.deleteUser);

// Project Routes
apiRoutes.post("/projects", projectController.createProject);
apiRoutes.get(
  "/projects",
  authMiddleware.verifyToken,
  projectController.getProject
);
apiRoutes.put(
  "/projects/:id",
  authMiddleware.verifyToken,
  projectController.updateProject
);
apiRoutes.delete(
  "/projects/:id",
  authMiddleware.verifyToken,
  projectController.deleteProject
);

apiRoutes.post("/task", authMiddleware.verifyToken, taskController.createTask);
apiRoutes.get("/tasks", authMiddleware.verifyToken, taskController.getTask);
apiRoutes.get(
  "/task/:id",
  authMiddleware.verifyToken,
  taskController.getTaskById
);
apiRoutes.put(
  "/task/:id",
  authMiddleware.verifyToken,
  taskController.updateTask
);
apiRoutes.delete(
  "/task/:id",
  authMiddleware.verifyToken,
  taskController.deleteTask
);
apiRoutes.put(
  "/tasks/:id/status",
  authMiddleware.verifyToken,
  taskController.updateTaskStatus
);

// History Routes
apiRoutes.get(
  "/history",
  authMiddleware.verifyToken,
  historyController.getHistory
);

apiRoutes.post("/login", userController.loginAuth);

module.exports = apiRoutes;
