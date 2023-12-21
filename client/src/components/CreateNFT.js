import React, { useEffect,useState } from 'react';
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Stack from 'react-bootstrap/Stack';

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
/*  if(user.usuari == "admin") {
    return (
        <>
          <Nav.Link href="/create-nft">Create NFT</Nav.Link>
        </>
    );
  }
  */
}

// Componente principal
function App() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [balance, setBalance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handlePriceChange = (e) => setPrice(parseFloat(e.target.value) || 0);

const handleImageFileChange = (e) => {
  const file = e.target.files[0];

  if (file && file instanceof Blob) {
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage({
        type: file.type,
        buffer: reader.result.split(",")[1],
      });
    };

    reader.readAsDataURL(file);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!image) {
    console.error('No se ha seleccionado una imagen.');
    return;
  }

  try {
    const formData = {
      title,
      description,
      price,
      image: {
        type: image.type,
        data: image.buffer,
      },
    };

    // Antes "http://nattech.fib.upc.edu:40571/api/createNFT"
    const response = await fetch('http://localhost:9999/api/createNFT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setShowPopup(true);
      console.log('NFT created');
    } else {
      console.error('Fallo en la creación:', data.error);
    }
  } catch (error) {
    console.error('Error durante la creación:', error);
  }
};

  
  useEffect(() => {
  	const obtenerBalance = async () => {
    		try {
                // Antes "http://nattech.fib.upc.edu:40571/api/getbalance"
      			const response = await fetch('http://localhost:9999/api/getbalance');
			const data = await response.json();
     			setBalance(data.balance);
   		} catch (error) {
      		console.error('Error al obtener el balance:', error);
   		}		
  };
  
  obtenerBalance();
  }, []);

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

      <Container className="mt-3">
        <h1 style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>
            <img
                className="Flecha"
                src="/Flecha.gif"
                style={{ width: '50px', height: '50px' }}
            />
            <b> 匚尺乇卂尺 几千ㄒ</b>
        </h1>

        <br />
        <br />

        <Stack direction={"horizontal"}>
          <p style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}><b> Saldo: {balance !== null ? `${balance}  ` : 'Cargando...'} </b></p>
          <p>
          <img
              className="eth_icon"
              /* Antes "http://nattech.fib.upc.edu:40571/frontAssets/Etherum_icon.png" */
              src="http://localhost:9999/frontAssets/Etherum_icon.png"
              /*alt="Ethereum"*/
              style={{ width: '30px', height: '30px' }}
          />
          </p>
        </Stack>

        <br />

        <Stack direction={"horizontal"}>
          <p style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}><b> Precio para crear NFT 1 </b></p>
          <p>
          <img
              className="eth_icon"
              /* Antes "http://nattech.fib.upc.edu:40571/frontAssets/Etherum_icon.png" */
              src="http://localhost:9999/frontAssets/Etherum_icon.png"
              /*alt="Ethereum"*/
              style={{ width: '30px', height: '30px' }}
          />
          </p>
        </Stack>

        <br />

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}><b> Título </b></Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el título del NFT"
              value={title}
              onChange={handleTitleChange}
            />
          </Form.Group>

          <br />

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}><b> Descripción </b></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Introduce la descripción del NFT"
              value={description}
              onChange={handleDescriptionChange}
            />
          </Form.Group>

          <br />

          <Form.Group className="mb-3" controlId="formPrice">
            <Form.Label style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}><b> Precio </b></Form.Label>
            <Form.Control
              type="number"
              placeholder="Introduce el precio del NFT"
              value={price}
              onChange={handlePriceChange}
            />
          </Form.Group>

          <br />

          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}><b> Imagen del NFT </b></Form.Label>
            <Form.Control
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleImageFileChange}
            />
            <Form.Text style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif'}}>
              Sube un archivo JPEG para la imagen del NFT.
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Crear NFT
          </Button>
        </Form>
      </Container>

      {showPopup && (
        <div className="popup">
          <p>NFT creado con éxito!</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Crear otro
          </Button>
          <Button variant="primary" onClick={() => navigate('/listNFT')}>
            Ir a listNFT
          </Button>
        </div>
      )}
    </div>
  );
}

export default App;
