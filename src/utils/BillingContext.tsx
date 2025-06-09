import React, { createContext, useState, useContext, ReactNode } from "react";

interface BillingInfo {
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  zipCode: string;
  email: string;
  phone: string;
  note: string;
}

interface BillingContextType {
  billingInfo: BillingInfo;
  setBillingInfo: React.Dispatch<React.SetStateAction<BillingInfo>>;
}

const defaultBillingInfo: BillingInfo = {
  firstName: "",
  lastName: "",
  address: "",
  country: "",
  zipCode: "",
  email: "",
  phone: "",
  note: "",
};

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(defaultBillingInfo);

  return (
    <BillingContext.Provider value={{ billingInfo, setBillingInfo }}>
      {children}
    </BillingContext.Provider>
  );
};

export const useBillingContext = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBillingContext must be used within a BillingProvider");
  }
  return context;
};
