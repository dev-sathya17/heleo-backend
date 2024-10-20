const Lead = require("../models/lead");
const leadsController = {
  addLead: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        course,
        location,
        forSelf,
        state,
        remarks,
        source,
      } = req.body;
      const newLead = new Lead({
        firstName,
        lastName,
        email,
        phone,
        course,
        location,
        forSelf,
        state,
        remarks,
        source,
      });
      const lead = await newLead.save();
      res.status(201).json(lead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getAllLeads: async (req, res) => {
    try {
      const leads = await Lead.find({ isDeleted: false }).populate("course");
      res.status(200).json(leads);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getLead: async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id).populate("course");
      if (!lead || lead.isDeleted) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.status(200).json(lead);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateLead: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        course,
        location,
        forSelf,
        state,
        remarks,
        source,
      } = req.body;
      const lead = await Lead.findById(req.params.id);
      if (!lead || lead.isDeleted) {
        return res.status(404).json({ message: "Lead not found" });
      }

      lead.firstName = firstName || lead.firstName;
      lead.lastName = lastName || lead.lastName;
      lead.location = location || lead.location;
      lead.forSelf = forSelf || lead.forSelf;
      lead.state = state || lead.state;
      lead.remarks = remarks || lead.remarks;
      lead.source = source || lead.source;
      lead.email = email || lead.email;
      lead.phone = phone || lead.phone;
      lead.course = course || lead.course;
      lead.updatedAt = Date.now();

      const savedLead = await lead.save();

      res.status(200).json(savedLead);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteLead: async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      lead.isDeleted = true;
      await lead.save();
      res.status(200).json({ message: "Lead deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = leadsController;
