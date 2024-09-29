const Lead = require("../models/lead");
const leadsController = {
  addLead: async (req, res) => {
    try {
      const { name, email, phone, course } = req.body;
      const newLead = new Lead({ name, email, phone, course });
      const savedLead = await newLead.save();
      res.status(201).json(savedLead);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getAllLeads: async (req, res) => {
    try {
      const leads = await Lead.find().populate("course");
      res.status(200).json(leads);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getLead: async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id).populate("course");
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.status(200).json(lead);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateLead: async (req, res) => {
    try {
      const { name, email, phone, course } = req.body;
      const lead = await Lead.findById(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      lead.name = name || lead.name;
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
      const deletedLead = await Lead.findByIdAndDelete(req.params.id);
      if (!deletedLead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.status(200).json({ message: "Lead deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = leadsController;
