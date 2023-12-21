import React, { useEffect, useState } from 'react';
import {Navbar, Nav, Container, Card, Col, Row, Modal} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

function EsAdmin()
{

    const [user, setUserInfo] = useState("");

    useEffect(() => {
        // Obtener información del usuario
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://127.0.0.1:9999/api/user-info'); // Antes "http://nattech.fib.upc.edu:40571/api/user-info"
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
                <b><Nav.Link href="/create-nft" style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Create NFT</Nav.Link></b>
            </>
        );
    }
}

async function handleToggleForSale(item) {
     // Antes "http://nattech.fib.upc.edu:40571/api/editVendible"
    await fetch("http://127.0.0.1:9999/api/editVendible", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: item.IdToken, listed: item.listed
        })
    }).then((res) => {
            if (res.status === 200) {
                succAlert();
                window.location.reload();
            } else {
                errorAlert();
            }
        }
    )
}

function errorAlert() {
    return (
        <>

            <Alert key={"danger"} variant={"danger"}>
                Error
            </Alert>
        </>
    );
}

function succAlert() {
    return (
        <>

            <Alert key={'success'} variant={'success'}>
                Success
            </Alert>
        </>
    );
}

function ComprarButton({ item, ...props }) {
    const [show, setShow] = useState(false);

    async function handleCreateOffer(item, preu) {

        // Antes "http://nattech.fib.upc.edu:40571/api/newPrice"
        await fetch("http://127.0.0.1:9999/api/newPrice", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: item.IdToken, price: preu
            })
        }).then((res) => {
                if(res.status === 200) {
                    succAlert();
                    setShow(false);
                    window.location.reload();
                } else {
                    errorAlert();
                }
            }

        )
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow} className="me-2" style={{ width: "100%" }}>
                Modificar Preu
            </Button>
            <Offcanvas show={show} onHide={handleClose} {...props}>
                <Offcanvas.Header closeButton>
                    <Stack gap={3}>
                        <Offcanvas.Title>MODIFICA VENTA</Offcanvas.Title><Offcanvas.Title>Nombre Articulo: {item.titulo}</Offcanvas.Title>
                    </Stack>

                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Offcanvas.Title>{item.listed ? 'Este NFT está en venta' : 'Este NFT no está en venta'}</Offcanvas.Title>
                    <Offcanvas.Title>Precio Actual: {item.preu}<img className={'eth_icon_small'} src="http://localhost:9999/frontAssets/Etherum_icon.png"/></Offcanvas.Title>   
                    <Form>
                        <Form.Group className="mb-3" controlId="formPrecio">
                            <Form.Label >Precio Nuevo</Form.Label>
                            <Form.Control id={"submitPrice"} type="price" placeholder="Enter price" />
                        </Form.Group>
                    </Form>
                </Offcanvas.Body>
                <Button
                    onClick={() => handleCreateOffer(item, document.getElementById("submitPrice").value)}
                    variant="primary"
                    style={{ width: "100%", fontSize: "1.2rem" }} // Ajusta el tamaño del botón
                >Confirmar</Button>
            </Offcanvas>
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
        //Antes "http://nattech.fib.upc.edu:40571/frontAssets/arrow.png"
        <Button onClick={handleDown} className={'expand_button'} style={{width:"100%"}} variant="primary"><img style={{backgroundColor:"transparent",width:"10%", aspectRatio:"10%"}} src={"http://localhost:9999/frontAssets/arrow.png"}/></Button>
    )
}

class ListNFT extends React.Component{
    state = {
        loading: true,
        NFT: []
    };

    handleClick = (item) => {
        // Llama a handleToggleForSale
        handleToggleForSale(item);

        // Llama a onChangePassword si está definido
        //if (this.props.onReset) {
        //    this.props.onReset();
        //}
    };

    async componentDidMount () {
        // Antes "http://nattech.fib.upc.edu:40571/api/listALLNFTs"
        const response = await fetch("http://127.0.0.1:9999/api/listALLNFTs", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }})
        const data = await response.json()
        
        console.log(data);  // Correcte: mostra tots els NFT
        const userNFTs = data.list.filter(
            (item) => item.propietari === this.props.userInfo.usuari
                
        );
        
        console.log("userNFTs", userNFTs);  // Incorrecte: no mostra els NFT del propietari "userInfo.usuari" -> Dubte: per què?
        this.setState({ loading: false, NFT: userNFTs });
        
        /* // Mostrar tots els NFT (exemple)
        const data = await response.json()
        this.setState({loading: false, NFT: data.list})
        */
    }

    // Sección HTML
    render() {
        if (this.state.loading) {
            return <div style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Cargando...</div>
        }
        if (!this.state.NFT.length) {
            return <div style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Did not get any player</div>
        }

        return (
            <div className={'contentContainer'}
                style={{
                    height: '100vh',                            // Establece la altura al 100% de la ventana
                    backgroundImage: 'url("/Login fondo.png")', // Imagen en la ruta especificada
                    backgroundSize: 'cover',                    // Ajustar la imagen al tamaño del contenedor
                    backgroundRepeat: 'no-repeat',              // Evita la repetición de la imagen
                    display: 'flex',                            // Contenedor flexible
                    flexDirection: 'column',                    //        "           -> dirección principal
                }}
            >
                <Stack gap={3} style={{overflow:"hidden", height:"100%"}}>
                    <Container fluid={true}>
                        <Row className={"g-4"} xs={3} style={{height:"30%"}}>
                            {this.state.NFT.map((item, index) => {
                                return (
                                    <Col>
                                        <Card style={{ width: '100%' , height:"100%"}}>
                                            <ImageZoom>
                                                <img style={{aspectRatio: 1, objectFit: "cover"}} className={"card-img"} src={`data:image/png;base64, ${item.imagen.data}`}/>
                                            </ImageZoom>

                                            <Card.Body>
                                                <Card.Title>
                                                    <Stack direction={"horizontal"}>
                                                        <h1>{item.titulo}</h1>
                                                        <h1 className="ms-auto">{item.preu}</h1>
                                                        {/*Antes "http://nattech.fib.upc.edu:40571/frontAssets/Etherum_icon.png"*/}
                                                        <img className={'eth_icon'} src="http://localhost:9999/frontAssets/Etherum_icon.png"/>
                                                    </Stack>
                                                </Card.Title>
                                                <Card.Text className={"h-30"} style={{overflowY:"hidden", height:"20px"}}>
                                                    Descripcion: {item.descripcion}
                                                </Card.Text>
                                                <Card.Text className={"h-30"} style={{overflowY:"hidden", height:"20px"}}>
                                                    Identificador del NFT: {item.IdToken}
                                                </Card.Text>
                                                {/* Checkbox para determinar si el artículo está en venta */}
                                                <Form.Check
                                                    type="checkbox"
                                                    label={`¿Está en venta? ${item.listed ? 'Si' : 'No'}`}
                                                    checked={item.listed}
                                                    onChange={() => this.handleClick(item)}
                                                />
                                            </Card.Body>
                                            {item.listed && <Card style={{background: "transparent"}}>
                                                <Card.Header style={{background: "transparent"}}>
                                                    <Stack direction={"horizontal"}>
                                                        <ComprarButton item={item}></ComprarButton>
                                                    </Stack>
                                                </Card.Header>
                                            </Card>}
                                        </Card>
                                    </Col>

                                )
                            })}
                        </Row>
                    </Container>
                </Stack>
            </div>
        )

    }

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

// Componente de perfil
function MyProfile() {
    const [userInfo, setUserInfo] = useState("");
    const [token, setToken] = useState("");
    const [money, setMoney] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [NFT, setNFT] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:9999/api/listNFTs", {
                    method: 'Post',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                setNFT(data.list);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching NFT data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Obtener información del usuario
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:9999/api/user-info');
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error al moment de retornar informacio usuari', error);
            }
        };

        // Llamar a la función para obtener información del usuario
        fetchUserInfo();
    }, [token]);

    useEffect(() => {
        // Obtener dinersusuari
        const fetchUserInfo2 = async () => {
            try {
                const response = await fetch('http://localhost:9999/api/getbalance');
                const data = await response.json();
                setMoney(data);
            } catch (error) {
                console.error('Error al moment de retornar el balance del usuari', error);
            }
        };

        // Llamar a la función para obtener información del usuario
        fetchUserInfo2();
    }, [token]);

    const handleChangePassword = () => {
        // Redirigir a la ruta de cambio de contraseña
        navigate('/change-password');
    };

    const handleResetPage = () => {
        // Redirigir a la ruta de cambio de contraseña
        window.location.reload();
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
                            <EsAdmin></EsAdmin>
                            <Nav.Link href="/login" className="ml-auto" style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Cerrar sesión</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenido principal */}
            <Container className="mt-4">
                <Form.Label style={{ textAlign: 'Left', marginBottom: '20px' }}>
                <h1 style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>
                    <img
                        className="Flecha"
                        src="/Flecha.gif"
                        style={{ width: '50px', height: '50px' }}
                    />
                    <b> 爪丨 卩乇尺千丨ㄥ</b>
                    <br />
                </h1>
                </Form.Label>

                {/* Información del usuario */}
                {/* RGBA con alpha = 0.8 (80% de opacidad)*/}
                <Card style={{ backgroundColor: 'rgba(240, 240, 240, 0.4)', width: '100%' }}>
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif' }}><b>{userInfo && userInfo.usuari}</b></Card.Title>
                                <br />
                                <br />
                                {/* Botón para redirigir a la página de change-password */}
                                <Button Button variant="primary" onClick={handleChangePassword}>Cambiar Contraseña</Button>
                            </Col>
                            <Col className="text-end">
                                <span className="ms-2" style={{ color: '#FFFFFF' }}>
                                    Saldo actual:
                                    <br />
                                    {money && money.balance}
                                </span>
                                <img
                                    className="eth_icon"
                                    /* Antes "http://nattech.fib.upc.edu:40571/frontAssets/Etherum_icon.png" */
                                    src="http://localhost:9999/frontAssets/Etherum_icon.png"
                                    /*alt="Ethereum"*/
                                    style={{ width: '30px', height: '30px' }}
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <br />
                <br />

                {/* Información del NFT */}
                <ListNFT userInfo={userInfo} NFT={NFT} onReset={handleResetPage}/>
            </Container>
        </div>
    );
}

export default MyProfile;
