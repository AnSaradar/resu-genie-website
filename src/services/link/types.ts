// Structure for creating a new link entry
export interface LinkData {
  website_name: string;
  website_url: string;
}

// Structure for updating an existing link entry
export interface LinkUpdateData {
  website_name?: string;
  website_url?: string;
}

// Structure for link response from backend
export interface LinkResponse {
  id: string;
  website_name: string;
  website_url: string;
}

// Frontend link interface used in components
export interface Link {
  id: string;
  websiteName: string;
  websiteUrl: string;
}

// API Response wrapper structure
export interface LinkApiResponse {
  signal: string;
  links?: LinkResponse[];
  link?: LinkResponse;
}

export interface LinkApiError {
  detail: string;
  signal?: string;
}

