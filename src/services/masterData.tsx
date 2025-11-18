import instance from './axios';

const uri = {
  getAllCountry: '/api/v1/meta/countries',
};

export const getAllCountries = async () => {
  return await instance.get(uri.getAllCountry);
};