export interface Filter {
  name: string;
  color: string;
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
  concern: string;
  check?: boolean;
  subconcerns: ConcernNode[];
}
