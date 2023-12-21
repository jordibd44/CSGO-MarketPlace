import React, { useState } from 'react';                // Librería de React
import { Form, Button, Alert } from 'react-bootstrap';  // Librería de React bootstrap (para el formulario de login, botón y feedback de registro)
import { Link, useNavigate } from 'react-router-dom';   // Librería de React-router-dom

/*  // Si hace falta, se puede usar la función onLogin para manejar la lógica de inicio de sesión y pasar los datos al backend
//const Login = ({ onLogin }) => { // Aquí se puede almacenar el token en el estado del componente principal
*/
const Login = () => {
  // Variables de estado (locales) vacías (usuario y contraseña) con valor setX (insertados en Form)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(null); // Variable "estado del login" -> Inicializada a "null" <= "false"= siempre sale mensaje de error cuando se accede
  const navigate = useNavigate(); // useNavigate: hook para redireccionar

  const handleLogin = async () => {
    try {
      // Llamada y envío de datos al backend (puerto 9999) para el inicio de sesión
      const response = await fetch('http://localhost:9999/api/login', {
        // Envío de datos (username y password) json al backend (POST)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Si la conexión, envío y respuesta al backend son correctos
      if (response.ok) {
        /* // Aquí se puede almacenar el token en el estado del componente principal
        const data = await response.json();
        onLogin(data.data);
        */
        setLoginSuccess(true);
        console.log('Sesión iniciada correctamente');
        navigate('/myProfile');  // Redirigir automáticamente
      }
      // Error en la llamada y envío de datos al backend
      else {
        setLoginSuccess(false);
        console.error('Error al iniciar sesión');
      }
    }
    // Conexión, envío y respuesta al backend correctos. Error retornado por el backend
    catch (error) {
      setLoginSuccess(false);
      console.error('Error al realizar la solicitud:', error);
    }
  };

  // Sección HTML
  // Dubte: comentaris javascript sense que es vegin al navegador html? -> {/*[...]*/}
  return (
    // Formularios
      // Usuario: Label=título, placeholder=guía, value=valor para enviarlo en json al backend (handleLogin->response->body)
      // Contraseña: Label=título, placeholder=guía, value=valor para enviarlo en json al backend (handleLogin->response->body)
    // Botón "Login" para llamar a "handleLogin"
    // "loginSuccess": correcto->ir a " /myProfile " / error

    //<div style={{ maxWidth: '500px', margin: 'auto' }}>
    <div
      style={{
        height: '100vh',                            // Establece la altura al 100% de la ventana
        backgroundImage: 'url("/Login fondo.png")', // Imagen en la ruta especificada
        backgroundSize: 'cover',                    // Ajustar la imagen al tamaño del contenedor
        backgroundRepeat: 'no-repeat',              // Evita la repetición de la imagen
        display: 'flex',                            // Contenedor flexible
        flexDirection: 'column',                    //        "           -> dirección principal
        justifyContent: 'center',                   //        "           -> alinear los elementos a lo largo del eje vertical
        alignItems: 'center',                       //        "           -> alinear los elementos a lo largo del eje horizontal
      }}
    >
    <Form>

      <Form.Group controlId="título">
        <Form.Label style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>
            <img
                className="Gun_1"
                src="/Gun_1.gif"
                style={{ width: '200px', height: '200px' }}
            />
            <br />
            <b>CSGO</b>
            <br />
              ︻デ═一 Marketplace ︻デ═一
            <br />
            <br />
            <br />
            Inicio de sesión
          </h1>
        </Form.Label>
      </Form.Group>

      <Form.Group controlId="formUsername">
        <Form.Label style={{ color: '#FFFFFF' }}><b>Username</b></Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your username"
          value={username}
          // Dubte: què fa onChange?
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

      <br />

      <Button variant="primary" onClick={handleLogin}>
        Iniciar sesión
      </Button>

      {loginSuccess === true && (
        <div>
          <Alert variant="success">Sesión iniciada correctamente</Alert>
          /* // Redirección => No hace falta botón
          <Button variant="link" href="/home">
            Entrar
          </Button>
          */
        </div>
      )}
      {loginSuccess === false && (
        <Alert variant="danger">Error al iniciar sesión</Alert>
      )}

      <div className="mt-3">
        <span style={{ color: '#FFFFFF' }}>
          ¿No estás registrado?{' '}
          <Link to="/register" style={{ color: '#FFFFFF' }}>Pincha aquí para registrarte</Link>
        </span>
      </div>

    </Form>
    </div>
  );
};

// Perquè App.js (o altres) pugui importar Login.js
export default Login;
