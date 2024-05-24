import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Link, Navigate } from 'react-router-dom'

const EmpresasDisponibles = () => {

    const [empresas, setEmpresas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [titulo, setTitulo] = useState("")


    //aplicante
    const [company, setCompany] = useState("")
    const [logo, setLogo] = useState("")


    const limpiarCampos = () => {
        setCompany("")
        setLogo("")
    }




    const getEmpresas = async () => {
        try {
            const { data } = await axios.get(`empresas`);
            setEmpresas(data)
        } catch (err) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: err.message.includes('401') ? 'Datos incorrectos' : err.message,
                showConfirmButton: false,
                timer: 3000
            });
        }
    }

    const readImg = async (e) => {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setLogo(reader.result);
        }
    }

    const limpiarFoto = () => {
        setLogo("")
    }

    useEffect(() => {
        getEmpresas()
    }, [])



    return (
        <>
            {loading ? (
                <p>Cargando empresas...</p>
            ) : error ? (
                <p>Error al cargar empresas</p>
            ) : (
                <div className="row row-cols-5">
                    {empresas.map((item) => (

                        <div className="card border-success mb-3" key={item.company_id}>
                            <div className="logo-container text-center max-auto">
                                <img src={item.logo} width="225" height="225" className="card-img-top" />
                            </div>
                            <div className="card-body text-success d-grid gap-2">
                                <h5 className="card-header bg-transparent border-success text-center">{item.company}</h5>
                                <button type="button" class="btn btn-success btn-fixed-width "><Link to={`/ofertasPorEmpresa/${item.company_id}`} style={{ textDecoration: 'none' }} className='text-white'>Ver ofertas</Link></button>
                            </div>
                            <div className="card-footer">
                                <small className="text-body-secondary"><strong>Creada el: </strong>{item.create_time ? item.create_time.slice(0, 10) : "Fecha no disponible"}</small>
                                <br/>
                                <small className="text-body-secondary"><strong>Por: </strong>{item.username}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>

    )
}

export default EmpresasDisponibles