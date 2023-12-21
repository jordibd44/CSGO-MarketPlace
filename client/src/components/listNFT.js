import React, {Component, useEffect, useState} from 'react';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Modal, Nav, Navbar} from "react-bootstrap";
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';



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
                <b><Nav.Link href="/create-nft" style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}> Create NFT</Nav.Link></b>
            </>
        );
    }
}

function CompraButton(item) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function handleCreateOffer(item, preu) {
        // Antes "http://nattech.fib.upc.edu:40571/api/newOffer"
        await fetch("http://127.0.0.1:9999/api/newOffer", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUserVendedor: item.item.propietari, IdToken: item.item.IdToken, preu: item.item.preu, preuOferta: preu
            })
        }).then((res) => {
                if(res.status === 200) {

                    setShow(true)
                } else {
                    alert("error")
                }
            }

        )
    }


    return (
        <>
            <Button onClick={() => handleCreateOffer(item, document.getElementById("submitPrice").value)}>Hacer oferta</Button>

            <Modal size={"lg"} show={show} onHide={handleClose}>
                <Modal.Body>{
                    <h1>Oferta realizada!</h1>
                }</Modal.Body>
            </Modal>
        </>
    );
}

function ComprarButton({ item, ...props }) {
    const [show, setShow] = useState(false);





    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="me-2">
                Comprar
            </Button>
            <Offcanvas show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Stack gap={3}>
                        <Offcanvas.Title>COMPRAR</Offcanvas.Title><Offcanvas.Title>{item.titulo}</Offcanvas.Title>
                    </Stack>

                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/*Antes "nattech.fib.upc.edu:40571"*/}
                    <Offcanvas.Title>Precio: {item.preu}<img className={'eth_icon_small'} src="http://localhost:9999/frontAssets/Etherum_icon.png"/></Offcanvas.Title>
                    <Form>
                        <Form.Group className="mb-3" controlId="formPrecio">
                            <Form.Label >Precio ofrecido</Form.Label>
                            <Form.Control id={"submitPrice"} type="price" placeholder="Enter price" />
                        </Form.Group>
                    </Form>
                </Offcanvas.Body>
                <CompraButton item={item}></CompraButton>

            </Offcanvas>
        </>
    );
}

function ImageZoom({children}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (
        <>

            <Button className={"expand_button"} variant="primary" onClick={handleShow}>
                {children}
            </Button>

            <Modal size={"lg"} show={show} onHide={handleClose}>
                <Modal.Body>{
                    React.cloneElement(
                        {children}.children,
                        { style: { aspectRatio:"initial" } }
                    )
                }</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    );
}

function DownArrow(){
    const [active, setActive] = useState(false)

    const handleDown = (e) => {
       try{
           console.log(e.target)
           let target = e.target
           if (!(target.classList.value=="expand_button btn btn-primary")) target = target.parentElement
           if (target.children[0].style.transform=="rotate(180deg)") target.children[0].style.transform = "rotate(0deg)"
           else target.children[0].style.transform = "rotate(180deg)"
           let firstParent = target.parentElement.parentElement.parentElement.parentElement.parentElement
           if(!active) {

               firstParent.children[1].children[1].style.height = "100%"
               firstParent.children[1].children[1].style.height = "100%"

           } else {

               firstParent.children[1].children[1].style.height = "100px"
           }
           setActive(!active)
        } catch (err) {
           console.log(err)
       }

    };

    return (
        // Antes "http://nattech.fib.upc.edu:40571/frontAssets/arrow.png"
        <Button onClick={handleDown} className={'expand_button'} style={{width:"100%"}} variant="primary"><img style={{backgroundColor:"transparent",width:"10%", aspectRatio:"10%"}} src={"http://localhost:9999/frontAssets/arrow.png"}/></Button>
    )
}

export default class ListNFT extends React.Component{
    state = {
        loading: true,
        NFT: []
    }



    async componentDidMount () {
        // Antes "http://nattech.fib.upc.edu:40571/api/listNFTs"
        const response = await fetch("http://127.0.0.1:9999/api/listNFTs", {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            }})
        const data = await response.json()
        this.setState({loading: false, NFT: data.list})
    }

    // Sección HTML
    render() {
        if (this.state.loading) {
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
        
                    <Container className="mt-4"> <div style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Cargando...</div> </Container>
                </div>
            );
        }
        if (!this.state.NFT.length) {
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
        
                    <Container className="mt-4"> <div style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>No estas loggeado</div> </Container>
                </div>
            );
        }
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
                        {/* Quitar? "/home" no lo usamos */}
                        <Navbar.Brand href="/home"style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Inicio</Navbar.Brand>
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
                    <b> ㄒ丨乇几ᗪ卂</b>
                </h1>
                </Container>

                {/* Recuadro de armas (filas de 3, con scroll) */}
                <div className={'contentContainer'} style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}>
                    <Stack gap={3} style={{ overflowY: "scroll",overflowX: "hidden", height: "100%" }}>
                        <Container fluid={true} >
                            {/* Filas de 3 NFT, con scroll vertical */}
                            <Row className={"g-4"} xs={3} style={{ height: "30%" }}>
                                {this.state.NFT.map((item, index) => {
                                    return (
                                        <Col key={index}>
                                            <Card style={{ width: '100%', height: "100%", backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                                                <ImageZoom>
                                                    <img style={{ aspectRatio: 1, objectFit: "cover" }} className={"card-img"} src={`data:image/png;base64, ${item.imagen.data}`} />
                                                </ImageZoom>

                                                <Card.Body>
                                                    <Card.Title>
                                                        <Stack direction={"horizontal"}>
                                                            <h1>{item.titulo}</h1>
                                                            <h1 className="ms-auto">{item.preu}</h1>
                                                            {/*Antes "http://nattech.fib.upc.edu:40571/frontAssets/Etherum_icon.png"*/}
                                                            <img className={'eth_icon'} src="http://localhost:9999/frontAssets/Etherum_icon.png" />
                                                        </Stack>
                                                    </Card.Title>
                                                    <Card.Text className={"h-30"} style={{ overflowY: "hidden", height: "100px" }}>
                                                        {item.descripcion}
                                                    </Card.Text>
                                                </Card.Body>
                                                <Card style={{ background: "transparent" }}>
                                                    <Card.Header style={{ background: "transparent" }}>
                                                        <Stack direction={"horizontal"}>
                                                            <DownArrow></DownArrow>
                                                            <ComprarButton item={item}></ComprarButton>
                                                        </Stack>
                                                    </Card.Header>
                                                </Card>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Container>
                    </Stack>
                </div>
            </div>
        );
    }


}


