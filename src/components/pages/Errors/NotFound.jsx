import React from 'react';
import { Link } from 'react-router-dom';


const NotFound = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
        <img
            src={"/notfound.jpeg"}
            alt="404 Not Found"
            className="max-w-sm w-full mb-6"
        />
        <h1 className="text-5xl font-bold text-yellow-600 mb-2">404</h1>
        <p className="text-2xl text-gray-800 mb-4">Страница не найдена</p>
        <p className="text-gray-600 mb-6">Похоже, вы перешли по несуществующему адресу.</p>
        <Link
            to="/home"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
            Вернуться на главную
        </Link>
    </div>
);

export default NotFound;
