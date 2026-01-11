export const API_ROUTES = {
  AUTH: {
    LOGIN : "/api/users/auth/request-otp",
    VERIFY_OTP : "/api/users/auth/verify-otp",
    VERIFY_TOKEN : "/api/users/auth/me",
  },
  USER: {
    FEATURED_PROJECTS : "/api/properties/featured-project",
    HIGHLIGHT_PROJECTS : "/api/properties/highlight-projects",
    OWNERS_PROPERTIES : "/api/properties/owners-properties",
    ARGICULTURAL : "/api/properties/agricultural",
    LAND : "/api/properties/land",
    COMMERCIAL : "/api/properties/commercial",
    RESIDENTIAL : "/api/properties/residential",
    AGENT : "/api/users/agent",
    LOCATION : "/api/users/location",
  },
  SEARCH :{
    CATEGORY_SEARCH :"/api/properties/search",
    RESIDENTIAL_CATEGORY_SEARCH :  "/api/properties/residential",
    COMMERCIAL_CATEGORY_SEARCH :  "/api/properties/commercial",
    LAND_CATEGORY_SEARCH :  "/api/properties/land",
    AGRICULTURAL_CATEGORY_SEARCH :  "/api/properties/agricultural",

  }
};
