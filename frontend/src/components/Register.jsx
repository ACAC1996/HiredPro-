import React, { useState } from 'react'
import Titulo from './common/Titulo'
import axios from 'axios'
import Swal from 'sweetalert2'
import Error from './common/Error'
import md5 from 'md5'
import { Navigate } from 'react-router-dom'

const Register = () => {

  const [logo, setLogo] = useState()
  const [company, setCompany] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [goLogin, setGoLogin] = useState(false)

  const prevLogo = (e) => {
    e.preventDefault();
    let lector = new FileReader()
    lector.readAsDataURL(e.target.files[0])
    lector.onload = () => {
      document.getElementById('logo').src = lector.result
      setLogo(lector.result)
    }
  }

  const limpiarCampos = () => {
    setCompany('')
    setEmail('')
    setUsername('')
    setPassword('')
    setPasswordConfirm('')
    setLogo('')
  }

  const registro = async (e) => {
    e.preventDefault()
    let dataCom = { logo, company, username, email }
    if ([logo, company, username, email, password, passwordConfirm].includes('') || [logo, company, username, email, password, passwordConfirm].includes('#')) {
      setError(true)
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Todos los campos son obligatorios",
        showConfirmButton: false,
        timer: 1500
      });
      return
    } else if (password !== passwordConfirm) {
      console.log(password)
      console.log(passwordConfirm)
      setPassword('')
      setPasswordConfirm('')
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Las contraseñas no coinciden",
        showConfirmButton: false,
        timer: 1500
      });
      setError(true)
      return
    } else if (password.length < 8) { // Nueva condición
      setPassword('');
      setPasswordConfirm('');
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "La contraseña debe tener al menos 8 caracteres",
        showConfirmButton: false,
        timer: 1500
      });
      setError(true);
      return;
    } else setError(false)
    setLoading(true)
    try {
      const { data } = await axios.post(
        'company',
        {
          logo,
          company,
          username,
          email,
          password
        }
      )
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 1500
      });
      dataCom.id = await data.data.insertId
      const idSession = await md5(dataCom.id + dataCom.email + dataCom.username)
      localStorage.setItem('user', JSON.stringify(dataCom))
      localStorage.setItem('idSession', idSession)
      setGoLogin(true)
    } catch (err) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: err.message("Este es el error"),
        showConfirmButton: false,
        timer: 5000
      });
    }
    limpiarCampos()
  }

  if (goLogin) {
    return <Navigate to="/misOfertas" />
  }

  return (
    <>
      <Titulo titulo='Registro de empresas' />
      <form onSubmit={registro}>
        <div className="container mb-4">
          <div className="row">

            <div className="col-md">
              <div className='text-center'>
                <img width='100%' src="../../public/images/registro.jpeg" alt="" />

                <p><strong>Atrae al talento que impulsa tu éxito: Publica tus vacantes y encuentra a los profesionales que llevarán tu empresa al siguiente nivel.</strong></p>
                <p><strong>Simplifica tu proceso de reclutamiento: Nuestra plataforma te conecta con los mejores candidatos de forma rápida y eficiente.</strong></p>
                <p><strong>Visibilidad garantizada para tus vacantes: Llega a miles de profesionales cualificados y encuentra al talento que buscas.</strong></p>
              </div>
            </div>
            <div className="col-md">
              <div className="card border mb-3">
                <div className="card-body">
                  <h5 className="card-title text-center">Ingrese los datos</h5>

                  <div className="mb-3 text-center">
                    <img id='logo' width='150px' src="../../public/images/logo3.png" alt="" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Logo de la empresa</label>
                    <input type="file" className="form-control" aria-describedby="emailHelp" onChange={prevLogo} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre de la empresa</label>
                    <input type="text" className="form-control" aria-describedby="emailHelp" onChange={(e) => setCompany(e.target.value)} value={company} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input type="text" className="form-control" aria-describedby="emailHelp" onChange={(e) => setUsername(e.target.value)} value={username} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} value={email} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" aria-describedby="emailHelp" onChange={(e) => setPassword(e.target.value)} value={password} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmar contraseña</label>
                    <input type="password" className="form-control" aria-describedby="emailHelp" onChange={(e) => setPasswordConfirm(e.target.value)} value={passwordConfirm} />
                  </div>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
                    <button className="btn btn-success me-md-2" type="submit">Crear empresa</button>
                    <button onClick={limpiarCampos} className="btn btn-primary" type="button">Cancelar</button>
                  </div>

                  {error && <Error mensaje='Todos los campos son obligatorios' />}

                </div>
              </div>

            </div>


          </div>
        </div>

      </form>
    </>
  )
}

export default Register