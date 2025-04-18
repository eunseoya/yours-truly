export interface Memory {
  id: string;
  date: string;
  description: string;
}

export interface Item {
  id: string;
  name: string;
  date: string;
  from: string;
  story: string;
  image: string;
  memories: Memory[];
}
