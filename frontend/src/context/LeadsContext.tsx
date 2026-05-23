import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useEffect } from "react";
import { type Lead } from "../data/mockData";

import api from "@/api/axios";

interface LeadsContextType {
  leads: Lead[];

  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;

  addLead: (lead: Omit<Lead, "_id">) => Promise<void>;

  updateLead: (lead: Lead) => Promise<void>;

  deleteLead: (id:string) => Promise<void>;

  fetchLeads: () => Promise<void>;

  moveLead: (
    id: string,
    newStatus: Lead["status"]
  ) => Promise<void>;
}

const LeadsContext = createContext<
  LeadsContextType | undefined
>(undefined);

export function LeadsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [leads, setLeads] =
    useState<Lead[]>([]);
    const fetchLeads = async () => {

  try {

    const res = await api.get("/leads");

    setLeads(res.data);

  } catch (err) {

    console.error(err);
  }
};
useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (token) {
    fetchLeads();
  }

}, []);
  // ADD LEAD
  const addLead = async (
  lead: Omit<Lead, "_id">
) => {

  try {

    const res = await api.post(
      "/leads",
      lead
    );

    setLeads((prev) => [
      res.data,
      ...prev,
    ]);

  } catch (err) {

    console.error(err);
  }
};

  // UPDATE LEAD
  const updateLead = async (
    updated: Lead
  ) => {
    try {
      const res = await api.put(
        `/leads/${updated._id}`,
        updated
      );

      setLeads((prev) =>
  prev.map((l) =>
    l._id === updated._id
      ? {...res.data}
      : l
  )
);
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE LEAD
  const deleteLead = async (
    id: string
  ) => {
    try {
      await api.delete(`/leads/${id}`);

      setLeads((prev) =>
        prev.filter((l) => l._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // MOVE LEAD
  const moveLead = async (
    id: string,
    newStatus: Lead["status"]
  ) => {
    try {
      const lead = leads.find(
        (l) => l._id === id
      );

      if (!lead) return;

      const updatedLead = {
        ...lead,
        status: newStatus,
      };

      const res = await api.put(
        `/leads/${id}`,
        updatedLead
      );

      setLeads((prev) =>
        prev.map((l) =>
          l._id === id
            ? res.data
            : l
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LeadsContext.Provider
      value={{
        leads,
        setLeads,
        addLead,
        updateLead,
        deleteLead,
        moveLead,
        fetchLeads,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(
    LeadsContext
  );

  if (!context) {
    throw new Error(
      "useLeads must be used within LeadsProvider"
    );
  }

  return context;
}