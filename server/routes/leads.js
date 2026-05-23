const router = require("express").Router();

const Lead = require("../models/Lead");

const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
router.post("/", auth, async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Lead not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing id" });
    }

    const deleted = await Lead.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: "Lead not found" });
    }

    res.json({ msg: "Lead deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;