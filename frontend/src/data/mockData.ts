export interface Lead {
  _id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  value: number;
  status: "New" | "Contacted" | "Interested" | "Closed";
  assignedTo: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mockLeads: Lead[] = [
  { _id: "1", name: "Rahul Sharma",  company: "TechCorp",     phone: "9876543210", email: "rahul@techcorp.com",    value: 85000,  status: "Closed",     assignedTo: "Priya" },
  { _id: "2", name: "Anita Verma",   company: "Infosys",      phone: "9123456780", email: "anita@infosys.com",     value: 50000,  status: "Interested", assignedTo: "Ravi" },
  { _id: "3", name: "Suresh Patel",  company: "Wipro",        phone: "9988776655", email: "suresh@wipro.com",      value: 30000,  status: "Contacted",  assignedTo: "Priya" },
  { _id: "4", name: "Meena Nair",    company: "HCL",          phone: "9001122334", email: "meena@hcl.com",         value: 70000,  status: "Contacted",  assignedTo: "Ravi" },
  { _id: "5", name: "Arjun Singh",   company: "Tata Motors",  phone: "9112233445", email: "arjun@tata.com",        value: 120000, status: "New",        assignedTo: "Priya" },
  { _id: "6", name: "Divya Menon",   company: "Mahindra",     phone: "9223344556", email: "divya@mahindra.com",    value: 95000,  status: "Interested", assignedTo: "Karan" },
  { _id: "7", name: "Rohit Gupta",   company: "Bajaj",        phone: "9334455667", email: "rohit@bajaj.com",       value: 40000,  status: "New",        assignedTo: "Ravi" },
  { _id: "8", name: "Sneha Reddy",   company: "Asian Paints", phone: "9445566778", email: "sneha@asianpaints.com", value: 65000,  status: "Closed",     assignedTo: "Karan" },
];

export const statusStyles: Record<string, { bg: string; text: string }> = {
  New:        { bg: "#1C2B41", text: "#579DFF" },
  Contacted:  { bg: "#1C3A3E", text: "#60C6D2" },
  Interested: { bg: "#3A2E0A", text: "#F5CD47" },
  Closed:     { bg: "#0D2B1F", text: "#4BCE97" },
};

export const statusColors: Record<string, string> = {
  New:        "#579DFF",
  Contacted:  "#60C6D2",
  Interested: "#F5CD47",
  Closed:     "#4BCE97",
};

export const avatarColors = [
  { bg: "#1C2B41", text: "#579DFF" },
  { bg: "#0D2B1F", text: "#4BCE97" },
  { bg: "#3A2E0A", text: "#F5CD47" },
  { bg: "#2A1F42", text: "#A06EF5" },
  { bg: "#2B1A1A", text: "#F87168" },
  { bg: "#1C3A3E", text: "#60C6D2" },
];

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

export function formatCurrency(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}
