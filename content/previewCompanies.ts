import { IMAGES } from "./images";

export interface PreviewCompany {
  id: number;
  name: string;
  services: string[];
  rating: number;
  reviewCount: number;
  phone: string;
  location: string;
  servingArea: string;
  imageUrl: string;
  featured?: boolean;
  rank?: number;
}

export const previewCompanies: PreviewCompany[] = [
  {
    id: 1,
    name: "Meridian Legal Support",
    services: ["Litigation Support", "Document Preparation", "Case Management"],
    rating: 5.0,
    reviewCount: 218,
    phone: "(214) 555-1200",
    location: "Dallas, TX",
    servingArea: "Metro Dallas & Surrounding Areas",
    imageUrl: IMAGES.companyFeatured,
    featured: true,
  },
  {
    id: 2,
    name: "Clearwater Paralegal Group",
    services: ["Family Law Support", "Estate Planning Support", "Immigration Support"],
    rating: 4.9,
    reviewCount: 312,
    phone: "(214) 444-8800",
    location: "Dallas, TX",
    servingArea: "Serving Metro Dallas",
    imageUrl: IMAGES.companyOne,
    rank: 1,
  },
  {
    id: 3,
    name: "Sterling Document Services",
    services: ["Real Estate Law Support", "Corporate Law Support", "Document Preparation"],
    rating: 4.8,
    reviewCount: 187,
    phone: "(214) 310-5500",
    location: "Dallas, TX",
    servingArea: "Serving Metro Dallas",
    imageUrl: IMAGES.companyTwo,
    rank: 2,
  },
  {
    id: 4,
    name: "Nexus Paralegal Solutions",
    services: ["Personal Injury Support", "Bankruptcy Support", "Litigation Support"],
    rating: 4.7,
    reviewCount: 143,
    phone: "(214) 555-9900",
    location: "Dallas, TX",
    servingArea: "Serving Metro Dallas",
    imageUrl: IMAGES.companyThree,
    rank: 3,
  },
];
