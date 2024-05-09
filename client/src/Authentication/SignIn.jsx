import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import UserAPI from '../API/UserAPI';
import { addSession } from '../Redux/Action/ActionSession';
import './Auth.css';
import queryString from 'query-string';
import CartAPI from '../API/CartAPI';

function SignIn(props) {
	//listCart được lấy từ redux
	const listCart = useSelector((state) => state.Cart.listCart);

	const [email, setEmail] = useState('');

	const [password, setPassword] = useState('');

	const [isLoggedIn, setIsLoggedIn] = useState(false)
	// const [data, setData] = useState({
	// 	email: "",
	// 	password: ""
	// })

	const [user, setUser] = useState([]);

	const [errorEmail, setErrorEmail] = useState(false);
	const [emailRegex, setEmailRegex] = useState(false);
	const [errorPassword, setErrorPassword] = useState(false);
	const [error, setError] = useState("")
	const [errorArray, setErrorArray] = useState([])

	const [redirect, setRedirect] = useState(false);

	const [checkPush, setCheckPush] = useState(false);

	const dispatch = useDispatch();

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const response = await UserAPI.getAllData();

	// 		setUser(response);
	// 		console.log(user);
	// 	};

	// 	fetchData();
	// }, []);

	const onChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const onChangePassword = (e) => {
		setPassword(e.target.value);
	};

// 	const onChange = e => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

	const fetchData = async (data) => {
		try {
		const response = await UserAPI.postLogin(data);
		console.log(response)
		if (response.status === 200) {
			setIsLoggedIn(true);
			localStorage.setItem('id_user', response.userId);
			localStorage.setItem('name_user', response.fullname);
			const action = addSession(localStorage.getItem('id_user'));
			dispatch(action);
			setCheckPush(true);
		} 
		
		} catch (error) {
			console.log(error.response)
			if(error.response.status === 400 || error.response.status === 500) {
				setError(error.response.data.message);
			} else if (error.response.status === 422) {
				var newErrorArray = errorArray.slice();
				error.response.data.message.map(err => {
					newErrorArray.push(err.msg)
				})
				setErrorArray(newErrorArray);
			}
		}

	};

	const onSubmit = () => {
		if (!email) {
			setErrorEmail(true);
			return;
		} else {
			if (!password) {
				setErrorEmail(false);
				setErrorPassword(true);
				return;
			} else {
				setErrorPassword(false);

				if (!validateEmail(email)) {
					setEmailRegex(true);
					return;
				} else {
					setEmailRegex(false);
					

				fetchData({
					email: email,
					password: password
				})
				console.log(isLoggedIn);

				// if(isLoggedIn) {
				// localStorage.setItem('id_user', findUser._id);

				// localStorage.setItem('name_user', findUser.fullname);

				// const action = addSession(localStorage.getItem('id_user'));
				// dispatch(action);

				// setCheckPush(true);
				// }
				

					// const findUser = user.find((value) => {
					// 	return value.email === email;
					// });

					// if (!findUser) {
					// 	setErrorEmail(true);
					// 	return;
					// } else {
					// 	setErrorEmail(false);


						// if (findUser.password !== password) {
						// 	setErrorPassword(true);
						// 	return;
						// } else {
						// 	setErrorPassword(false);

						// 	localStorage.setItem('id_user', findUser._id);

						// 	localStorage.setItem('name_user', findUser.fullname);

						// 	const action = addSession(localStorage.getItem('id_user'));
						// 	dispatch(action);

						// 	setCheckPush(true);
						// }
					}
				}
			}
		}

	//Hàm này dùng để đưa hết tất cả carts vào API của user
	useEffect(() => {
		const fetchData = async () => {
			//Lần đầu sẽ không thực hiện insert được vì addCart = ''
			if (checkPush === true) {
				for (let i = 0; i < listCart.length; i++) {
					//Nó sẽ lấy idUser và idProduct và count cần thêm để gửi lên server
					const params = {
						idUser: localStorage.getItem('id_user'),
						idProduct: listCart[i].idProduct,
						count: listCart[i].count,
					};

					const query = '?' + queryString.stringify(params);

					const response = await CartAPI.postAddToCart(query);
					console.log(response);
				}

				setRedirect(true);
			}
		};

		fetchData();
	}, [checkPush]);

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}


	return (
		<div className='limiter'>
			<div className='container-login100'>
				<div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50'>
					<span className='login100-form-title p-b-33'>Sign In</span>

					<div className='d-flex justify-content-center pb-5'>
						{emailRegex && (
							<span className='text-danger'>
								* Incorrect Email Format
							</span>
						)}
						{errorEmail && (
							<span className='text-danger'>
								* Please Check Your Email
							</span>
						)}
						{errorPassword && (
							<span className='text-danger'>
								* Please Check Your Password
							</span>
						)}
						{error && (
							<span className='text-danger'>
								* {error}
							</span>
						)}
						{errorArray.length >= 1 && (
							<span className='text-danger'>
								{errorArray.map(item => (
									<>
								* {item} <br />
									</>
								))}
							</span>
						)}
					</div>

					<div className='wrap-input100 validate-input'>
						<input
							className='input100'
							type='text'
							placeholder='Email'
							// defaultValue=""
							value={email}
							onChange={onChangeEmail}
						/>
					</div>

					<div className='wrap-input100 rs1 validate-input'>
						<input
							className='input100'
							type='password'
							placeholder='Password'
							// defaultValue=""
							value={password}
							onChange={onChangePassword}
						/>
					</div>

					<div className='container-login100-form-btn m-t-20'>
						{redirect && <Redirect to={`/`} />}
						<button className='login100-form-btn' onClick={onSubmit}>
							Sign in
						</button>
					</div>

					<div className='text-center p-t-45 p-b-4'>
						<span className='txt1'>Create an account?</span>
						&nbsp;
						<Link to='/signup' className='txt2 hov1'>
							Sign up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
