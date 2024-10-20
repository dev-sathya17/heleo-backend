const express = require("express");
const auth = require("../middlewares/auth");
const leadsController = require("../controllers/leads.controller");
const leadsRouter = express.Router();

leadsRouter.get(
  "/",
  auth.authenticate,
  // auth.authorize,
  leadsController.getAllLeads
);

leadsRouter.post(
  "/",
  auth.authenticate,
  // auth.authorize,
  leadsController.addLead
);

leadsRouter.get(
  "/:id",
  auth.authenticate,
  // auth.authorize,
  leadsController.getLead
);

leadsRouter.put(
  "/:id",
  auth.authenticate,
  // auth.authorize,
  leadsController.updateLead
);

leadsRouter.delete(
  "/:id",
  auth.authenticate,
  // auth.authorize,
  leadsController.deleteLead
);

module.exports = leadsRouter;
