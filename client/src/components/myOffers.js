import React, {Component, useEffect, useState} from 'react';
import {Container, Button, Navbar, Nav, Card} from 'react-bootstrap';
import BuyNFT from './BuyNFT';

function GestOffer({oferta})
{
    const [price, setPrice] = useState("");
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
    // Itera sobre las ofertas y realiza solicitudes para obtener los precios originales
        const fetchPrices = async () => {
             console.log('Entarnt al try');
                try {
                    // Antes "http://nattech.fib.upc.edu:40571/api/getPriceOffer"
                    const response = await fetch("http://127.0.0.1:9999/api/getPriceOffer", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: oferta.IdToken
                        })
                    });
                    console.log('Hola a punt de JSON');
                    const data = await response.json();
                    console.log('Price');
                    console.log(data.preu);
                    setPrice(data.preu);
                } catch (error) {
                    console.error('Error al obtener el precio original:', error);
                }
    };
    fetchPrices();
    }, []);

	const handleConfirmOffer = async () => {
	          setShowPopup(true)
	};
	
	const handleAccept = async () => {
		try {
                    // Antes "http://nattech.fib.upc.edu:40571/api/buyNFT"
                    const response = await fetch("http://127.0.0.1:9999/api/buyNFT", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: oferta
                        })
                    });
                    const data = await response.json();
            		if (response.ok) {
            		window.location.reload()
           	 }
                } catch (error) {
                    console.error('Error:', error);
                }
	
	};
	
	const handleCancel = async () => {
	          setShowPopup(false)
	};


    const handleRejectOffer = async (offerId) => {
    	try {
                    // Antes "http://nattech.fib.upc.edu:40571/api/rechazarOferta"
                    const response = await fetch("http://127.0.0.1:9999/api/rechazarOferta", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: oferta._id
                        })
                    });
                    const data = await response.json();
            		if (response.ok) {
            		window.location.reload()
           	 }
                } catch (error) {
                    console.error('Error:', error);
                }
        console.log(`Oferta rechazada:`);
    };

    // Sección HTML
    return(
        <>
        <Card key={oferta.id} style={{width: '18rem', margin: '10px'}}>
            <Card.Body>
                <Card.Title>Nombre del NFT: {oferta.IdToken}</Card.Title>
                <Card.Text>Usuario que hizo la oferta: {oferta.idUserComprador}</Card.Text>
                <Card.Text>Precio: {price} <img className="eth_icon"
                                                // Antes "http://nattech.fib.upc.edu:40571/frontAssets/Etherum_icon.png"
                                                src="http://localhost:9999/frontAssets/Etherum_icon.png"
                                                style={{
                                                    width: '20px',
                                                    height: '20px'
                                                }}/></Card.Text>
                <Card.Text>Oferta feta: {oferta.preu} <img className="eth_icon"
                                                          // Antes "http://nattech.fib.upc.edu:40571/frontAssets/Etherum_icon.png"
                                                          src="http://localhost:9999/frontAssets/Etherum_icon.png"
                                                          style={{
                                                              width: '20px',
                                                              height: '20px'
                                                          }}/></Card.Text>
                <Button variant="success" onClick={() => handleConfirmOffer()}>
                    Confirmar
                </Button>{' '}
                <Button variant="danger" onClick={() => handleRejectOffer(oferta.id)}>
                    Rechazar
                </Button>
            </Card.Body>
        </Card>
		 {showPopup && (
		    <div className="popup">
		      <p>¿Estás seguro de vender el NFT?</p>
                <Button variant="success" onClick={() => handleAccept()}>
                    Confirmar
                </Button>{' '}
                <Button variant="danger" onClick={() => handleCancel()}>
                    Rechazar
                </Button>
		    </div>
    	  )}
       </>
    );
}

function EsAdmin()
{

    const [user, setUserInfo] = useState("");

    useEffect(() => {
        // Obtener información del usuario
        const fetchUserInfo = async () => {
            try {
                // Antes "http://nattech.fib.upc.edu:40571/api/user-info"
                const response = await fetch('http://127.0.0.1:9999/api/user-info');
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error al moment de retornar informacio usuari', error);
            }
        };

        // Llamar a la función para obtener información del usuario
        fetchUserInfo();
    }, []);
    if(user.usuari == "admin") {
        return (
            <>
                <Nav.Link href="/create-nft">Create NFT</Nav.Link>
            </>
        );
    }
}

export default class MyOffers extends React.Component {

    state = {
        loading: true,
        offers: [],
    }

    async componentDidMount() {
        // Simula una solicitud HTTP para obtener las ofertas desde el backend

            // Puedes ajustar la URL y los detalles de la solicitud según tu backend
        // Antes "http://nattech.fib.upc.edu:40571/api/getOffers"
        const response = await fetch("http://127.0.0.1:9999/api/getOffers", {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        this.setState({loading: false, offers: data.list})
    }

    // Sección HTML
    render() {
        if (this.state.loading == true) {
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
                                    <EsAdmin></EsAdmin>
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
                        <b> 爪丨丂 ㄖ千乇尺ㄒ卂丂</b>
                    </h1>
                    </Container>
                    <Container className="mt-4"><div style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Cargando...</div></Container>
                 </div>
            );
        }
        else if (this.state.offers.length == 0) {
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
                                    <EsAdmin></EsAdmin>
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
                        <b> 爪丨丂 ㄖ千乇尺ㄒ卂丂</b>
                    </h1>
                    </Container>
                    <Container className="mt-4"><div style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>No tienes ninguna oferta nueva</div></Container>
                </div>
            );
        }
        else {
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
                                <EsAdmin></EsAdmin>
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
                        <b> 爪丨丂 ㄖ千乇尺ㄒ卂丂</b>
                    </h1>

                    <br />
                    <br />

                    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                        {Array.isArray(this.state.offers) && this.state.offers.length > 0 ? (
                            this.state.offers.map((offer) => (
                                <GestOffer key={offer.id} oferta={offer} />
                            ))

                        ) : (
                            <div style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>No hay ofertas disponibles.</div>
                        )}
                    </div>
                </Container>
                </div>
           );
        }
    }
}
