import React from "react";
import { useAppSelector } from "../../redux/store/store";
import ResidentialFilters from "./filters/ResidentialFilters";
import CommercialFilters from "./filters/CommercialFilters";
import LandFilters from "./filters/LandFilters";
import AgriculturalFilters from "./filters/AgriculturalFilters";
import CategorySelector from "../../components/ui/CategorySelector";
import FilterBar from "./filters/FilterBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView } from "react-native";  

const CATEGORY_COMPONENT_MAP = {
  Residential: ResidentialFilters,
  Commercial: CommercialFilters,
  Land: LandFilters,
  Agricultural: AgriculturalFilters,
};

const CategoryFilterScreen = () => {
  const { category } = useAppSelector((s) => s.filters);
 
  const CategoryComponent = CATEGORY_COMPONENT_MAP[category];

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 10, backgroundColor:"#fff" }}>
      <FilterBar /> 
      <CategorySelector />

      {!category && 
      <Text>Please select a category</Text>
      }

      {category && CategoryComponent && <CategoryComponent />}
    </ScrollView>
  );
};

export default CategoryFilterScreen;
