import Login from "./components/Login"
import Ofertas from "./components/Ofertas"
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Register from "./components/Register"
import MisOfertas from "./components/common/MisOfertas"
import { useEffect, useState } from "react"
import Empresas from "./components/Empresas"
import OfertasPorEmpresa from "./components/OfertasPorEmpresa"


const App = () => {

  const [user, setUser] = useState(undefined)
  const [pagina, setPagina] = useState(1)


  const logOut = () => {
    localStorage.clear()
    setUser(undefined)
  }

  const loadData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user) {
        setUser(user)
      } else {
        setUser(undefined)
      }
      return user
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {

  }, [user, pagina])

  return (
    <BrowserRouter>
      <nav className="py-2 bg-body-tertiary border-bottom">
        <div className="container d-flex flex-wrap">
          <ul className="nav me-auto">
            <li style={{ marginRight: "20px" }} className="nav-item">
              <Link to='/' className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto link-body-emphasis text-decoration-none">
                <img src="../public/images/logo3.png" className="bi me-2" width="40" height="32" />
                <span className="fs-4 mr-4">HiredPro!</span>
              </Link>
            </li>
            <li className="nav-item"><Link to='/' className="nav-link link-body-emphasis px-2">Vacantes</Link></li>
            <li className="nav-item"><Link to='/empresas' className="nav-link link-body-emphasis px-2">Empresas</Link></li>
            {
              user != undefined ? (
                <>
                  <li className="nav-item"><Link to='/misOfertas' className="nav-link link-body-emphasis px-2 active" aria-current="page">Mis Ofertas</Link></li>
                </>

              ) : (
                <>
                  
                </>
              )
            }
            

          </ul>
          <ul className="nav">
            {
              user != undefined ? (
                <>
                  <li className="nav-item"><Link to='/misOfertas' className="nav-link link-body-emphasis px-2">Usuario actual: <strong>{user.username} - {user.company.toUpperCase()}</strong></Link></li>
                  <li className="nav-item"><Link to='/login' onClick={logOut} className="nav-link link-body-emphasis px-2 text-danger">Cerrar sesión</Link></li>
                </>

              ) : (
                <>
                  <li className="nav-item"><Link to='/login' className="nav-link link-body-emphasis px-2">Iniciar sesión</Link></li>
                  <li className="nav-item"><Link to='/register' className="nav-link link-body-emphasis px-2">Registro</Link></li>
                </>
              )
            }

          </ul>
        </div>
      </nav>
      <header className="mb-4 border-bottom">

        <div id="myCarousel" className="carousel slide mb-6" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2" className="active" aria-current="true"></button>
            <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item">
              <img src="../public/images/slider5.jpeg" className="bd-placeholder-img" width="100%" height="400" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false" />
              <div className="container">
                <div className="carousel-caption">
                  <h1>Buscador de candidatos para tus vacantes.</h1>
                  <p className="opacity-75">HiredPro! te permite publicar tus ofertas de empleo y recibir tus postulaciones</p>
                  <p><Link to='/misOfertas' className="btn btn-lg btn-primary" href="#">Crea una nueva oferta</Link></p>
                </div>
              </div>
            </div>
            <div className="carousel-item active">
              <img src="../public/images/slider6.jpeg" className="bd-placeholder-img" width="100%" height="400" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false" />
              <div className="container">
                <div className="carousel-caption">
                  <h1>¡Selecciona tu mejor opción!</h1>
                  <p>Revisa la lista de personas que se han postulado a tus ofertas.</p>
                  <p><Link to='/misOfertas' className="btn btn-lg btn-primary" href="#">Mis postulados</Link></p>
                </div>
              </div>
            </div>
            <div className="carousel-item active">
              <img src="../public/images/slider7.jpeg" className="bd-placeholder-img" width="100%" height="400" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false" />
              <div className="container">
                <div className="carousel-caption">
                  <h1>Miles de vacantes alrededor del mundo</h1>
                  <p>Postúlate a miles de ofertas en diferentes lugares y diferentes modalidades</p>
                  <p><Link to='/' className="btn btn-lg btn-primary" href="#">Ver Ofertas</Link></p>
                </div>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </header>


      <div className="container">
        <Routes>
          <Route path="/" element={<Ofertas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/misOfertas" element={<MisOfertas pagina={pagina} setPagina={setPagina} setUser={setUser} />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/ofertasPorEmpresa/:companyId" element={<OfertasPorEmpresa />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App