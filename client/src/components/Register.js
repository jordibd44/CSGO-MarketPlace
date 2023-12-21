import React, { useState } from 'react';                // Librería de React
import { Form, Button, Alert } from 'react-bootstrap';  // Librería de React bootstrap (para el formulario de register, botón y feedback de registro)

//const Register = ({ onRegister }) => { // Aquí se puede almacenar el token en el estado del componente principal
const Register = () => {
  // Variables de estado (locales) vacías (usuario, contraseña y correo) con valor setX (insertados en Form)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(null); // Variable "estado del registro" -> Inicializada a "null" <= "false"= siempre sale mensaje de error cuando se accede

  const handleRegister = async () => {
    try {
      // Llamada y envío de datos al backend (puerto 9999) para el registro de usuario
      const response = await fetch('http://localhost:9999/api/register', {
        // Envío de datos (username, password y correo) json al backend (POST)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, address }),
      });

      // Si la conexión, envío y respuesta al backend son correctos
      if (response.ok) {
        /* // Aquí se puede almacenar el token en el estado del componente principal
        const data = await response.json();
        onRegister(data.data);
        */
        setRegistrationSuccess(true);
        console.log('Registrado correctamente');
      }
      // Error en la llamada y envío de datos al backend
      else {
        setRegistrationSuccess(false);
        console.error('Error al registrarse');
      }
    }
    // Conexión, envío y respuesta al backend correctos. Error retornado por el backend
    catch (error) {
      setRegistrationSuccess(false);
      console.error('Error al realizar la solicitud:', error);
    }
  };

  // Sección HTML
  // Dubte: comentaris javascript sense que es vegin al navegador html? -> {/*[...]*/}
  return (
    // Formularios
      // Usuario: Label=título, placeholder=guía, value=valor para enviarlo en json al backend (handleRegister->response->body)
      // Contraseña: Label=título, placeholder=guía, value=valor para enviarlo en json al backend (handleRegister->response->body)
      // Dirección: Label=título, placeholder=guía, value=valor para enviarlo en json al backend (handleRegister->response->body)
    // Botón "Register" para llamar a "handleRegister"
    // "registrationSuccess": correcto->mostrar botón de ir a "/login" / error

    //<div style={{ maxWidth: '500px', margin: 'auto' }}>
    <div
      style={{
        height: '100vh',                                      // Establece la altura al 100% de la ventana
        backgroundImage: 'url("/Login fondo tint verd.png")', // Imagen en la ruta especificada
        backgroundSize: 'cover',                              // Ajustar la imagen al tamaño del contenedor
        backgroundRepeat: 'no-repeat',                        // Evita la repetición de la imagen
        display: 'flex',                                      // Contenedor flexible
        flexDirection: 'column',                              //        "           -> dirección principal
        justifyContent: 'center',                             //        "           -> alinear los elementos a lo largo del eje vertical
        alignItems: 'center',                                 //        "           -> alinear los elementos a lo largo del eje horizontal
      }}
    >
    <Form>

      <Form.Group controlId="título">
        <Form.Label style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>
            <b>几千ㄒ: Ꮆㄖ</b>
            <br />
              ︻デ═一 Marketplace ︻デ═一
            <br />
            <br />
            <br />
            Registro
          </h1>
        </Form.Label>
      </Form.Group>

      <Form.Group controlId="formUsername">
        <Form.Label style={{ color: '#FFFFFF' }}><b>Username</b></Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label style={{ color: '#FFFFFF' }}><b>Password</b></Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formAddress">
        <Form.Label style={{ color: '#FFFFFF' }}><b>Ganache address</b></Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your Ganache address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>

      <br />

      <Button variant="primary" onClick={handleRegister}>
        Registrarse
      </Button>

      {registrationSuccess === true && (
        <div>
          <Alert variant="success">Registrado correctamente</Alert>
          <Button variant="link" href="/login" style={{ color: '#FFFFFF' }}>
            <b>Iniciar sesión</b>
          </Button>
        </div>
      )}
      {registrationSuccess === false && (
        <Alert variant="danger">Error al registrarse</Alert>
      )}

    </Form>
    </div>
  );
};

// Perquè App.js (o altres) pugui importar Register.js
export default Register;
