import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import UserAPI from '../API/UserAPI';
import './Auth.css';
import queryString from 'query-string';
import MessengerAPI from '../API/MessengerAPI';

SignUp.propTypes = {};

function SignUp(props) {
	const [fullname, setFullName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');

	const [errorEmail, setEmailError] = useState(false);
	const [emailRegex, setEmailRegex] = useState(false);
	const [errorPassword, setPasswordError] = useState(false);
	const [errorFullname, setFullnameError] = useState(false);
	const [errorPhone, setPhoneError] = useState(false);
	const [errorUsername, setUsernameError] = useState(false);
	const [error, setError] = useState("");
	const [errorArray, setErrorArray] = useState([]);

	const [success, setSuccess] = useState(false);

	const onChangeName = (e) => {
		setFullName(e.target.value);
	};

	const onChangeEmail = (e) => {
		setEmail(e.target.value);
	};

	const onChangePassword = (e) => {
		setPassword(e.target.value);
	};

	const onChangePhone = (e) => {
		setPhone(e.target.value);
	};

	const onChangeUsername = (e) => {
		setUsername(e.target.value);
	};

	const fetchSignUp = async (data) => {
		try {
		// const query = '?' + queryString.stringify(params);
		// console.log(query);
		const response = await UserAPI.postSignUp(data);
		console.log(response);
		if(response) {
			alert("Signup successfully")
			setSuccess(true);
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

	const handlerSignUp = (e) => {
		e.preventDefault();

		if (!fullname) {
			setFullnameError(true);
			setUsernameError(false);
			setEmailError(false);
			setPhoneError(false);
			setPasswordError(false);
			setEmailRegex(false);
			return;
		} else {
			setFullnameError(false);
			setUsernameError(false);
			setPhoneError(false);
			setPasswordError(false);
			setFullnameError(false);
			setEmailRegex(false);

			if (!username) {
			setUsernameError(true)
			setFullnameError(false);
			setEmailError(false);
			setPhoneError(false);
			setPasswordError(false);
			setEmailRegex(false);
			} else {

				if (!email) {
				setFullnameError(false);
				setUsernameError(false);
				setEmailError(true);
				setPhoneError(false);
				setPasswordError(false);
				return;
			} else {
				setEmailError(false);
				setUsernameError(false);
				setPhoneError(false);
				setPasswordError(false);
				setFullnameError(false);

				if (!validateEmail(email)) {
					setEmailRegex(true);
					setUsernameError(false);
					setFullnameError(false);
					setEmailError(false);
					setPhoneError(false);
					setPasswordError(false);
					return;
				} else {
					setEmailRegex(false);

					if (!password) {
						setFullnameError(false);
						setUsernameError(false);
						setEmailError(false);
						setPhoneError(false);
						setPasswordError(true);
						return;
					} else {
						setFullnameError(false);
						setPhoneError(false);
						setUsernameError(false);
						setPasswordError(false);
						setFullnameError(false);
						setEmailRegex(false);

						if (!phone) {
							setFullnameError(false);
							setEmailError(false);
							setUsernameError(false);
							setPhoneError(true);
							setPasswordError(false);
						} else {
							console.log('Thanh Cong');
							const data = {
									fullname: fullname,
									username: username,
									email: email,
									password: password,
									phonenumber: phone,
								};


							fetchSignUp(data);

							// Hàm này dùng để tạo các conversation cho user và admin
							// const fetchConversation = async () => {
							// 	const params = {
							// 		email: email,
							// 		password: password,
							// 	};

							// 	const query = '?' + queryString.stringify(params);

							// 	const response = await MessengerAPI.postConversation(
							// 		query
							// 	);
							// 	console.log(response);
							// };

							// fetchConversation();
						}
					}
				}
			}
			}
		}
	};

	function validateEmail(email) {
		const re =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	return (
		<div className='limiter'>
			<div className='container-login100'>
				<div className='wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50'>
					<span className='login100-form-title p-b-33'>Sign Up</span>
					<div className='d-flex justify-content-center pb-5'>
						{errorFullname && (
							<span className='text-danger'>
								* Please Check Your Full Name!
							</span>
						)}
						{errorUsername && (
							<span className='text-danger'>
								* Please Check Your Username!
							</span>
						)}
						{errorEmail && (
							<span className='text-danger'>
								* Please Check Your Email!
							</span>
						)}
						{emailRegex && (
							<span className='text-danger'>
								* Incorrect Email Format
							</span>
						)}
						{errorPassword && (
							<span className='text-danger'>
								* Please Check Your Password!
							</span>
						)}
						{errorPhone && (
							<span className='text-danger'>
								* Please Check Your Phone Number!
							</span>
						)}
						{error && (
							<span className='text-danger'>
								* {error}!
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
							value={fullname}
							onChange={onChangeName}
							type='text'
							placeholder='Full Name'
						/>
					</div>

					<div className='wrap-input100 validate-input'>
						<input
							className='input100'
							value={username}
							onChange={onChangeUsername}
							type='text'
							placeholder='Username'
						/>
					</div>

					<div className='wrap-input100 rs1 validate-input'>
						<input
							className='input100'
							value={email}
							onChange={onChangeEmail}
							type='text'
							placeholder='Email'
						/>
					</div>

					<div className='wrap-input100 rs1 validate-input'>
						<input
							className='input100'
							value={password}
							onChange={onChangePassword}
							type='password'
							placeholder='Password'
						/>
					</div>

					<div className='wrap-input100 rs1 validate-input'>
						<input
							className='input100'
							value={phone}
							onChange={onChangePhone}
							type='text'
							placeholder='Phone'
						/>
					</div>

					<div className='container-login100-form-btn m-t-20'>
						{success && <Redirect to={'/signin'} />}
						<button className='login100-form-btn' onClick={handlerSignUp}>
							Sign Up
						</button>
					</div>

					<div className='text-center p-t-45 p-b-4'>
						<span className='txt1'>Login?</span>
						&nbsp;
						<Link to='/signin' className='txt2 hov1'>
							Click
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignUp;
