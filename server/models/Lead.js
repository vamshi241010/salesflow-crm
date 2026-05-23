const mongoose = require("mongoose"); // 👈 MUST BE FIRST

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    company: String,
    phone: String,
    email: String,
    value: Number,
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Closed"],
      default: "New",
    },
    assignedTo: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", LeadSchema);