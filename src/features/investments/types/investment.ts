export type Investment = {
  id: string;
  product: string;
  percentage: number;
  value: number;
  investmentClassId: string;
  userId: string;
  investmentClass?: {
    id: string;
    name: string;
  };
};

export type CreateInvestmentInput = {
  product: string;
  percentage: number;
  investmentClassId: string;
};

export type UpdateInvestmentInput = {
  id: string;
  product: string;
  percentage: number;
  investmentClassId: string;
};
