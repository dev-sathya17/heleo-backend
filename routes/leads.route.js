const express = require("express");

const leadsRouter = express.Router();

leadsRouter.get("/");

leadsRouter.post("/");

leadsRouter.get("/:id");

leadsRouter.put("/:id");

leadsRouter.delete("/:id");

module.exports = leadsRouter;
