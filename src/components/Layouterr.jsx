import { Outlet } from 'react-router-dom';

const Layouterr = () => {
    return (
        <div className="app">
            <div className="main-layout">
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layouterr;