import axiosClient from './axiosClient';

const CheckoutAPI = {
	postOrders: (data) => {
		const url = `/orders`;
		return axiosClient.post(url, data);
	},

	postEmail: (data) => {
		// const url = `/email${query}`;
		const url = `/email`;
		return axiosClient.post(url,data);
	},
};

export default CheckoutAPI;
