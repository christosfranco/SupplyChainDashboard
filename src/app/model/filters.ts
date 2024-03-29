export interface Filter {
  conditions: Condition[];
}

export interface Condition {
  conditionName: string;
  operator: string;
  value: string[] | string;
}

export interface ConcernForest {
  roots: ConcernNode[];
}

export interface ConcernNode {
  id: string
  concern: string;
  check?: boolean;
  subconcerns: ConcernNode[];
}
