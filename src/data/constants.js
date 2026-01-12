/* ===================== BUDGET ===================== */

export const BUDGET_MIN = 5; // 5 Lac
export const BUDGET_MAX = 5000; // 50 Cr (in Lac)
export const BUDGET_STEP = 5;

export const budgetOptions = [
  5, 10, 20, 30, 50, 75,
  100, 150, 200, 300, 400,
  500, 750, 1000, 2000, 3000, 4000, 5000,
];

export const formatBudget = (value) => {
  if (value >= 100) {
    return `₹${value / 100}${value === 5000 ? "+" : ""} Cr`;
  }
  return `₹${value} Lac`;
};

/* ===================== CARPET AREA ===================== */

export const CARPET_MIN = 300;
export const CARPET_MAX = 10000;

export const carpetOptions = [
  300, 500, 750, 1000, 1500,
  2000, 3000, 5000, 7500, 10000,
];

/* ===================== RESIDENTIAL ===================== */

export const moreFilterSections = [
  {
    key: "Property Type",
    label: "Property Type",
    options: [
      "Apartment",
      "Independent house",
      "Villa",
      "Penthouse",
      "Studio",
      "Duplex",
      "Triplex",
      "Farmhouse",
      "independent-builder-floor",
    ],
    selectionType: "multiple",
  },
  {
    key: "Sales Type",
    label: "Sales Type",
    options: ["new-sale", "resale"],
    selectionType: "single",
  },
  {
    key: "Possession Status",
    label: "Possession Status",
    options: ["ready-to-move", "under-construction"],
    selectionType: "single",
  },
  { key: "Covered Area", label: "Covered Area" },
  {
    key: "Bathroom",
    label: "Bathroom",
    options: ["1+", "2+", "3+", "4+"],
    selectionType: "multiple",
  },
  {
    key: "Balcony",
    label: "Balcony",
    options: ["1+", "2+", "3+"],
    selectionType: "multiple",
  },
  {
    key: "Parking",
    label: "Parking",
    options: ["1 Car", "2 Cars"],
    selectionType: "multiple",
  },
  {
    key: "Furnishing",
    label: "Furnishing",
    options: ["Unfurnished", "Semi-Furnished", "Fully Furnished"],
    selectionType: "single",
  },
  {
    key: "Amenities",
    label: "Amenities",
    options: ["Lift", "Power Backup", "Gym", "Swimming Pool", "Security"],
    selectionType: "multiple",
  },
  {
    key: "Facing",
    label: "Facing",
    options: ["East", "West", "North", "South"],
    selectionType: "multiple",
  },
  { key: "Verified Properties", label: "Verified Properties" },
  {
    key: "Posted Since",
    label: "Posted Since",
    options: [
      "All",
      "Yesterday",
      "Last Week",
      "Last 2 Weeks",
      "Last 3 Weeks",
      "Last Month",
      "Last 2 Months",
      "Last 4 Months",
    ],
    selectionType: "single",
  },
  {
    key: "Posted By",
    label: "Posted By",
    options: ["owners", "Agents", "Builders"],
    selectionType: "multiple",
  },
];

/* ===================== COMMERCIAL ===================== */

export const commercialMoreFilterSections = [
  {
    key: "Commercial Type",
    label: "Commercial Type",
    options: [
      "Office Space",
      "Shop",
      "Showroom",
      "Warehouse",
      "Industrial Shed",
      "IT Park",
      "Co-working Space",
    ],
    selectionType: "multiple",
  },
  {
    key: "Commercial Sub Type",
    label: "Commercial Sub Type",
    options: [
      "Independent Building",
      "Business Park",
      "Mall Shop",
      "High Street Shop",
      "SEZ Office",
    ],
    selectionType: "multiple",
  },
  {
    key: "Transaction Type",
    label: "Transaction Type",
    options: ["new-sale", "resale"],
    selectionType: "single",
  },
  {
    key: "Construction Status",
    label: "Construction Status",
    options: ["ready-to-move", "under-construction"],
    selectionType: "single",
  },
  { key: "Built-up Area", label: "Built-up Area" },
  { key: "Carpet Area", label: "Carpet Area" },
  {
    key: "Floor Number",
    label: "Floor Number",
    options: ["Ground", "1+", "5+", "10+"],
    selectionType: "multiple",
  },
  {
    key: "Total Floors",
    label: "Total Floors",
    options: ["1+", "5+", "10+", "20+"],
    selectionType: "multiple",
  },
  {
    key: "Furnishing Status",
    label: "Furnishing Status",
    options: ["unfurnished", "semi-furnished", "fully-furnished"],
    selectionType: "single",
  },
  {
    key: "Pantry",
    label: "Pantry",
    options: ["Inside Premises", "Shared"],
    selectionType: "single",
  },
  {
    key: "Power Capacity",
    label: "Power Capacity (KW)",
    options: ["10+", "25+", "50+", "100+"],
    selectionType: "multiple",
  },
  {
    key: "Parking",
    label: "Parking",
    options: ["Visitor Parking", "2 Wheeler", "4 Wheeler"],
    selectionType: "single",
  },
  {
    key: "Fire Safety",
    label: "Fire Safety",
    options: [
      "Fire Extinguisher",
      "Fire Sprinkler",
      "Smoke Detector",
      "Fire Alarm",
      "Emergency Exit",
    ],
    selectionType: "multiple",
  },
];

/* ===================== LAND ===================== */

export const landMoreFilterSections = [
  {
    key: "Land Type",
    label: "Land Type",
    options: [
      "Residential Land",
      "Commercial Land",
      "Agricultural Land",
      "Industrial Land",
      "Farm Land",
    ],
  },
  {
    key: "Land Sub Type",
    label: "Land Sub Type",
    options: [
      "Open Plot",
      "Layout Plot",
      "Corner Plot",
      "DTCP Approved Plot",
      "HMDA Approved Plot",
    ],
  },
  { key: "Plot Area", label: "Plot Area" },
  { key: "Dimensions", label: "Dimensions" },
];

/* ===================== AGRICULTURAL ===================== */

export const agriculturalMoreFilterSections = [
  {
    key: "Agricultural Type",
    label: "Agricultural Type",
    options: [
      "Dry Land",
      "Wet Land",
      "Farm Land",
      "Plantation Land",
      "Horticulture Land",
    ],
  },
  {
    key: "Agricultural Sub Type",
    label: "Agricultural Sub Type",
    options: [
      "Paddy Field",
      "Coconut Garden",
      "Mango Orchard",
      "Palm Plantation",
      "Mixed Crop Land",
    ],
  },
  { key: "Total Area", label: "Total Area" },
  {
    key: "Area Unit",
    label: "Area Unit",
    options: ["Acre", "Guntha", "Cent", "Hectare"],
  },
];
