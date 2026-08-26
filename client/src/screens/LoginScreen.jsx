import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { setCredentials } from '@slices/authSlice';
import { useLoginMutation } from '@slices/userApiSlice';

const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect');

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect || getDashboardPath(userInfo.role));
        }
    }, [userInfo, redirect, navigate]);

    const getDashboardPath = (role) => {
        switch (role) {
            case 'admin':
                return '/admin/dashboard';

            case 'security':
                return '/security/dashboard';

            case 'resident':
                return '/resident/dashboard';

            default:
                return '/';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await login({
                email,
                password,
            }).unwrap();

            dispatch(setCredentials(response));

            navigate(redirect || getDashboardPath(response.role));
        } catch (error) {
            console.error(error);

            toast.error(
                error?.data?.message || 'Invalid email or password'
            );
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12'>
            <div className='w-full max-w-md'>
                <div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-8'>
                    <div className='text-center mb-8'>
                        <h1 className='text-2xl font-semibold text-gray-900'>
                            Sunrise Towers
                        </h1>

                        <p className='mt-2 text-sm text-gray-500'>
                            Visitor Management System
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-medium text-gray-900'>
                                Email Address
                            </label>

                            <div className='mt-2'>
                                <input
                                    type='email'
                                    id='email'
                                    required
                                    autoComplete='email'
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder='Enter your email'
                                    className='block w-full rounded-lg border-0 bg-white px-3 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='block text-sm font-medium text-gray-900'>
                                Password
                            </label>

                            <div className='mt-2'>
                                <input
                                    type='password'
                                    id='password'
                                    required
                                    autoComplete='current-password'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder='Enter your password'
                                    className='block w-full rounded-lg border-0 bg-white px-3 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm'
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60'>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className='mt-6 text-center text-xs text-gray-500'>
                        Authorized users only
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;