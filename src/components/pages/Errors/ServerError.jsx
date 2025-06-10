import React from 'react';
import { Link } from 'react-router-dom';

const ServerError = () => (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-md w-full">
                <img
                    src="/error.jpeg"
                    alt="500 Server Error"
                    className="w-64 mx-auto mb-6 rounded-xl shadow-md"
                />
                <h1 className="text-6xl font-extrabold text-red-600 mb-2">500</h1>
                <p className="text-2xl text-gray-800 font-semibold mb-2">Ошибка сервера</p>
                <p className="text-gray-600 mb-6">
                    Что-то пошло не так на сервере. Пожалуйста, попробуйте позже.
                </p>
                <Link
                    to="/home"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition shadow-md"
                >
                    <p>Вернуться на главную</p>
                </Link>
            </div>
        </div>
    </div>
);

export default ServerError;




