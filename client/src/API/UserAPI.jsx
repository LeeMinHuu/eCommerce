import axiosClient from './axiosClient';

const UserAPI = {
	getAllData: () => {
		const url = '/users';
		return axiosClient.get(url);
	},

	postLogin: (data) => {
		const url = `/login`;
		return axiosClient.post(url, data);
	},

	getDetailData: (id) => {
		const url = `/users/${id}`;
		return axiosClient.get(url);
	},

	postSignUp: (data) => {
		const url = `/signup`;
		return axiosClient.post(url, data);
	},

	getLogout: () => {
		const url = `/logout`;
		return axiosClient.get(url);
	},
};

export default UserAPI;
