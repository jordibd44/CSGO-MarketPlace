import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import {Navbar, Nav, Card, Col, Row, Modal} from 'react-bootstrap';

function BuyNFT({ data, onClose }) {
    const [nftDetails, setNftDetails] = useState(null);
    const [ofertaDetails, setOfertaDetails] = useState(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
            console.log('hola')
        	// Antes "http://nattech.fib.upc.edu:40571/api/getofertaAndNFT"    
                const response = await fetch("http://127.0.0.1:9999/api/getofertaAndNFT", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: data
                    })
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener el precio original. Código de error: ${response.status}`);
                }

                const responseData = await response.json();
                console.log(responseData);

                // Actualiza los estados con los datos obtenidos
                setNftDetails(responseData.nftDetails);
                setOfertaDetails(responseData.ofertaDetails);
            } catch (error) {
                console.error('Error al obtener el precio original:', error);
            }
        };

        fetchPrices();
    }, [data]);

    if (!nftDetails || !ofertaDetails) {
        return <div>Cargando...</div>;
    }

    const handleBuyNFT = () => {
        // Puedes agregar lógica para procesar la compra del NFT aquí.
        console.log(`Comprar NFT con Token ID: ${data}`);
    };

    const handleCancel = () => {
        // Llamar a la función onClose para cerrar el modal
        if (onClose) {
            onClose();
        }
    };

    // Sección HTML
    return (
        <div
            style={{
                height: '100vh',                            // Establece la altura al 100% de la ventana
                backgroundImage: 'url("/Login fondo.png")', // Imagen en la ruta especificada
                backgroundSize: 'cover',                    // Ajustar la imagen al tamaño del contenedor
                backgroundRepeat: 'no-repeat',              // Evita la repetición de la imagen
                display: 'flex',                            // Contenedor flexible
                flexDirection: 'column',                    //        "           -> dirección principal
            }}
        >
            {/* Barra de navegación */}
            <Navbar style={{ backgroundColor: 'rgba(255, 192, 203, 0.5)' }} expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/my-profile"style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Mi perfil  </Nav.Link>
                            <Nav.Link href="/my-offers" style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Mis ofertas</Nav.Link>
                            <Nav.Link href="/listNFT"   style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Tienda     </Nav.Link>
                        </Nav>
                        <Nav>
                            {/*<EsAdmin></EsAdmin>*/}
                            <Nav.Link href="/login" className="ml-auto" style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Cerrar sesión</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container className="mt-4">
                <h1 style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>
                    <img
                        className="Flecha"
                        src="/Flecha.gif"
                        style={{ width: '50px', height: '50px' }}
                    />
                    <b> ᗪ乇ㄒ卂ㄥㄥ乇丂 ᗪ乇ㄥ 几千ㄒ</b>
                </h1>
                <div>

                    <br />
                    <br />

                    {/* Puedes mostrar los detalles obtenidos */}
                    <p style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>NFT Detalles: {JSON.stringify(nftDetails)}</p>

                    <br />

                    <p style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Oferta Detalles: {JSON.stringify(ofertaDetails)}</p>

                    <br />

                    <Button variant="success" onClick={handleBuyNFT}>
                        Vender NFT
                    </Button>

                    <br />
                    <br />

                    <div className="mb-1"></div>
                    <Button variant="danger" onClick={handleCancel}>
                        Cancelar
                    </Button>
                </div>
            </Container>
        </div>
    );
}

export default BuyNFT;

