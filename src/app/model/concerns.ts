export interface Concerns {
  roots : Concern[]
}

export interface Concern {
  concern : string,
  id : string,
  subconcerns: Concern[]
}

export interface ConcernsDataResponse {
  Concern_Trees: ConcernResponse[];
}

export interface ConcernResponse {
  Concern_ID: string
  Concern_name: string;
  Children: ConcernResponse[];
}
