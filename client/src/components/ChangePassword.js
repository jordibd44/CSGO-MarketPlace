import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import {Navbar, Nav, Container, Card, Col, Row, Modal} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {

    console.log('ENtrem a ChangePassword');
    const [formData, setFormData] = useState({
        newpassword: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9999/api/change-password', { // Antes "http://nattech.fib.upc.edu:40571/api/change-password"
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Password changed successfully!');
                navigate("/my-profile"); // Cambié Navigate a navigate
            } else {
                console.error('Password change failed:', data.error);
            }
        } catch (error) {
            console.error('Error during password change:', error);
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

            <h1 style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>
                <img
                    className="Flecha"
                    src="/Flecha.gif"
                    style={{ width: '50px', height: '50px' }}
                />
                <b> 匚卂爪乃丨卂尺 匚ㄖ几ㄒ尺卂丂乇Ñ卂</b>
            </h1>

            <br />
            <br />

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNewPassword">
                    <Form.Label style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>Nueva contraseña</Form.Label>
                    <br />
                    <Form.Control
                        type="password"
                        placeholder="Introduce tu nueva contraseña"
                        name="newpassword"
                        value={formData.newpassword}
                        onChange={handleChange}
                    />
                </Form.Group>

                <br />

                <Button variant="primary" type="submit">
                    Cambiar contraseña
                </Button>
            </Form>
        </div>
    );
};

export default ChangePassword;
