export interface Feature {
  id: number;
  title: string;
  category: string;
  order?: number;
  paragraph: string;
  details?: {
    type?: string;
    description?: string;
    condition?: string;
    cases?: string[];
    requirements?: string[];
    features?: string[];
    summer?: string;
    regular?: string;
    deadline?: string;
    procedure?: string;
    recommendation?: string;
    monitoring?: string;
  };
}