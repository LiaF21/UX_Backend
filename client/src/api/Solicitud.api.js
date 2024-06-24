import axiosInstance from './axiosInstance';

export const getSolicitudes = async () => {
  try {
    const response = await axiosInstance.get("solicitudes");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSolicitud = async (id) => {
  try {
    const response = await axiosInstance.get(`solicitudes/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createSolicitud = async (data) => {
  try {
    const response = await axiosInstance.post("solicitudes", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const updateSolicitud = async (id, solicitud) => {
  try {
    const response = await axiosInstance.put(
      `solicitudes/${id}`,

      solicitud
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteSolicitud = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `solicitudes/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  getSolicitudes,
  getSolicitud,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
};
