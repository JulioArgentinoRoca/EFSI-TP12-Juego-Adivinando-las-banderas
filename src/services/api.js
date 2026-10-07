import axios from "axios"

export const getCountries = async () => {
    try {
      const response = await axios.get(
        `https://countriesnow.space/api/v0.1/countries/flag/images`
      );

      return response.data
      
    } catch (error) {
      return error
    }
  };
