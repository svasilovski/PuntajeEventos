import React from 'react';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-box">
                <h1  style="--color-h1: #dc3545">404</h1>
                <h2>Oops! Página no encontrada.</h2>
                <p>
                    Lo sentimos, la página que estás buscando no existe.
                    <br />
                    Puedes regresar a la <a href="/">página principal</a> o intentar buscar otra cosa.
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
