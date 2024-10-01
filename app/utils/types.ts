export interface Dog {
  id: string
  img: string
  name: string
  age: number
  zip_code: string
  breed: string
}

export interface DogFilter {
  breeds: string[];
  geoBoundingBox?: { 
    top_right: { lat: number, lon: number }, 
    bottom_left: { lat: number, lon: number }
  };
  zipCodes?: string[];
  ageMin: number;
  ageMax: number;

  size: number;
  from: number;
  sort : string;
}

export interface DogsSearchResponse {
  resultIds: unknown[],
  total: number,
  next: string,
  prev: string,
}

export interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}

export interface Coordinates {
  lat: number;
  lon: number;
}