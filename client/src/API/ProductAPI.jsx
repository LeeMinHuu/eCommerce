import axiosClient from './axiosClient';

const ProductAPI = {
	getAPI: () => {
		const url = '/products';
		return axiosClient.get(url);
	},

	getCategory: (query) => {
		const url = `/products/category${query}`;
		console.log(url);
		return axiosClient.get(url);
	},

	getDetail: (id) => {
		const url = `/products/${id}`;
		return axiosClient.get(url);
	},

	getPagination: (query) => {
		const url = `/products/pagination${query}`;
		console.log(url)
		return axiosClient.get(url);
	},
};

export default ProductAPI;
