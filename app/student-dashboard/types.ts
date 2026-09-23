export interface Sections {
  sections: Section[]
}

export interface Section {
  id: string;
  name: string;
  description: string;
  topics: Topic[]
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}