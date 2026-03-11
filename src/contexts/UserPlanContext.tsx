"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PlanType = "basic" | "pro";

interface UserPlanContextType {
  plan: PlanType;
  updatePlan: (newPlan: PlanType) => void;
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(
  undefined,
);

export function UserPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanType>("basic");

  const updatePlan = (newPlan: PlanType) => {
    setPlan(newPlan);
  };

  return (
    <UserPlanContext.Provider value={{ plan, updatePlan }}>
      {children}
    </UserPlanContext.Provider>
  );
}

export function useUserPlan() {
  const context = useContext(UserPlanContext);
  if (context === undefined) {
    throw new Error("useUserPlan must be used within a UserPlanProvider");
  }
  return context;
}
