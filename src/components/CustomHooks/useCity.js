import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setItem, removeItem, getItem } from "../../utils/Storage";

import { useAppDispatch } from "../../redux/store/store";
import {
  fetchLocations,
  setCityId,
  clearCity,
  selectSelectedCity,
  selectLocalitiesByCity,
} from "../../redux/slice/CitySlice";

const DEFAULT_CITY_NAME = "Hyderabad";
const STORAGE_KEY = "selectedCityId";

const useCity = () =>{
  const dispatch = useAppDispatch();

  const selectedCity = useSelector(selectSelectedCity);
  const localities = useSelector(selectLocalitiesByCity);
  const locations = useSelector((state) => state.city.locations);
  

  // ✅ Select city
  const selectCity = async (city) => {
    dispatch(setCityId(city._id));
    console.log(city._id)
    await setItem(STORAGE_KEY, city._id);
  };

  // ✅ Clear city
  const clearSelectedCity = async () => {
    dispatch(clearCity());
    await removeItem(STORAGE_KEY);
  };

  // ✅ Fetch all locations on mount
  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  // ✅ Restore saved city from storage
  useEffect(() => {
    const restoreCity = async () => {
      const savedCityId = await  getItem(STORAGE_KEY);
      if (savedCityId && !selectedCity) {
        dispatch(setCityId(savedCityId));
      }
    };

    restoreCity();
  }, [dispatch, selectedCity]);

  // ✅ Auto-select default city (Hyderabad)
  useEffect(() => {
    if (selectedCity) return;
    if (!locations.length) return;

    const defaultCity = locations.find(
      (c) =>
        c.city?.toLowerCase() === DEFAULT_CITY_NAME.toLowerCase()
    );

    if (defaultCity) {
      dispatch(setCityId(defaultCity._id));
      setItem(STORAGE_KEY, defaultCity._id);
    }
  }, [locations, selectedCity, dispatch]);

  return {
    selectedCity,   // selected city object
    localities,     // localities of selected city
    locations,      // all cities
    selectCity,     // call this to change city
    clearSelectedCity,
  };
}
export default useCity;
