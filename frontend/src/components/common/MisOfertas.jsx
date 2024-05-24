import md5 from "md5";
import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom'
import Error from './Error'
import Titulo from "./Titulo";
import Swal from "sweetalert2";
import axios from "axios";
import ListaVacantes from "../ListaVacantes";
import ListaPostulaciones from "../ListaPostulaciones";

const MisOfertas = ({ setUser, pagina, setPagina }) => {

    const [nombre, setNombre] = useState('')
    const [goLogin, setGoLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [title, setTitle] = useState('')
    const [city, setCity] = useState('')
    const [experience, setExperience] = useState()
    const [job_type, setJobe_type] = useState('')
    const [from_date, setFrom_date] = useState('')
    const [until_date, setUntil_date] = useState('')
    const [company_id, setCompany_id] = useState('')
    const [job_id, setJob_id] = useState('')
    const job_type_list = ['Remoto', 'Presencial', 'Híbrido']
    const [vacantes, setVacantes] = useState([])
    const [postulaciones, setPostulaciones] = useState([])
    const [vacante, setVacante] = useState()
    const [eliminar, setEliminar] = useState()
    const [selected_job, setSelected_job] = useState()
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        try {
            const { email, username, id, company } = await JSON.parse(localStorage.getItem('user'));
            const idSession = localStorage.getItem('idSession');
            setUser(JSON.parse(localStorage.getItem('user')))
            setNombre(company)
            const companyId = id;
            setCompany_id(id)
            if (idSession !== md5(id + email + username)) {
                localStorage.clear()
                setGoLogin(true)
            } else {
                getVacantesApi(companyId);
            }
        } catch (err) {
            setGoLogin(true)
            localStorage.clear()
        }

    }

    const validarSession = async () => {
        try {
            const { email, username, id, company } = await JSON.parse(localStorage.getItem('user'));
            const idSession = localStorage.getItem('idSession');
            setUser(JSON.parse(localStorage.getItem('user')))
            setNombre(company)
            setCompany_id(id)
            if (idSession !== md5(id + email + username)) {
                localStorage.clear()
                setGoLogin(true)
                return
            }
        } catch (err) {
            setGoLogin(true)
            localStorage.clear()
            return
        }

    }

    const registro = async (e) => {

        e.preventDefault()
        validarSession()
        const { id } = await JSON.parse(localStorage.getItem('user'));
        let obj = { title, city, experience, from_date, until_date, company_id, job_type }
        const companyId = id;
        if ([title, city, experience, from_date, until_date, company_id, job_type].includes('')) {
            Swal.fire({
                position: "top-right",
                icon: "warning",
                title: "Todos los campos son obligatorios",
                showConfirmButton: false,
                timer: 1500
            });
            return
        }
        else if (!job_type_list.includes(job_type)) {
            Swal.fire({
                position: "top-right",
                icon: "warning",
                title: "Debe seleccionar la modalidad de trabajo",
                showConfirmButton: false,
                timer: 1500
            });
            return
        } else {
            setLoading(true)
            let data
            try {
                if (vacante !== undefined) {

                    data = await axios.put(`job/${vacante.job_id}`, obj)
                } else {
                    data = await axios.post('job', obj)
                }


                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    html: `<strong> ${data.data.message}</strong>`,
                    showConfirmButton: false,
                    timer: 2000
                });
                limpiarCampos()
                getVacantesApi(companyId)
            } catch (err) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: err.message.includes('401') ? 'Datos incorrectos' : err.message,
                    showConfirmButton: false,
                    timer: 3000
                });
            }
            setLoading(false)
        }
    }

    const borrar = () => {
        Swal.fire({
            title: "Confirmar?",
            text: "Realmente desea eliminar la vacante?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminarla!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const { id } = await JSON.parse(localStorage.getItem('user'));

                    let obj = await { company_id: id }
                    const { data } = await axios.delete(`job/${eliminar}`, { data: obj })

                    Swal.fire({
                        title: "Vacante eliminada!",
                        text: data.message,
                        icon: "success"
                    });
                } catch (err) {
                    Swal.fire({
                        title: "Oops!",
                        text: err.message,
                        icon: "error"
                    });
                }

            } else {
                setEliminar()
            }
        });
    }

    const getVacantesApi = async (companyId) => {
        validarSession()
        setIsLoading(true);
        try {
            const { email, username, id, company } = await JSON.parse(localStorage.getItem('user'));
            const { data } = await axios.get(`job/all/${id}/${pagina}/5`);
            setVacantes(data)
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setVacantes([]); // Si no hay vacantes (404), establece vacantes como un array vacío
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Empresa creada con éxito",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }
    }

    const getPostulacionesApi = async () => {
        try {
            const { data } = await axios.get(`applications/${selected_job}`);
            setPostulaciones(data)


        } catch (err) {
            setPostulaciones([])
            Swal.fire({
                position: "top-end",
                icon: "warning",
                title: err.message.includes('400') ? 'No hay postulaciones' : err.message,
                showConfirmButton: false,
                timer: 3000
            });
        }
    }

    const limpiarCampos = () => {
        setCity('')
        setExperience('')
        setTitle('')
        setFrom_date('')
        setUntil_date('')
        setJobe_type('')
        setJob_id('')
        setVacante()
    }


    useEffect(() => {
        loadData()
    }, [vacantes])


    useEffect(() => {
        if (selected_job > 0) {
            getPostulacionesApi()
        }

    }, [selected_job])

    useEffect(() => {
        if (eliminar > 0) {
            borrar()
        }
    }, [eliminar])

    useEffect(() => {
        const { id } = JSON.parse(localStorage.getItem('user'));
        const companyId = id;
        getVacantesApi(companyId)
    }, [pagina])

    useEffect(() => {
        if (vacante) {
            setCity(vacante.city)
            setExperience(vacante.experience)
            setTitle(vacante.title)
            setFrom_date(vacante.from_date.slice(0, 10))
            setUntil_date(vacante.until_date.slice(0, 10))
            setJobe_type(vacante.job_type)
            setJob_id(vacante.job_id)
        }
    }, [vacante])

    if (goLogin) {
        return <Navigate to="/login" />
    }

    return (
        <>

            <form onSubmit={registro}>
                <div className="container mb-4">
                    <div className="row">


                        <div className="col-md-4">
                            <Titulo titulo="Gestionar vacantes" />
                            <div className="card border mb-3">
                                <div className="card-body">
                                    <h5 className="card-title text-center">Ingrese los datos</h5>




                                    <div className="mb-3">
                                        <input type="text" placeholder="Nombre de la vacante ej: React Dev" className="form-control" aria-describedby="emailHelp" onChange={(e) => setTitle(e.target.value)} value={title} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" placeholder="Ciudad/Pais" className="form-control" aria-describedby="emailHelp" onChange={(e) => setCity(e.target.value)} value={city} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="number" placeholder="Experiencia (años)" className="form-control" aria-describedby="emailHelp" min="1" onChange={(e) => setExperience(e.target.value)} value={experience} />
                                    </div>
                                    <div className="mb-3">
                                        <select className="form-select" aria-describedby="emailHelp" min="1" onChange={(e) => setJobe_type(e.target.value)} value={job_type}>
                                            <option value="">Modalidad de trabajo</option>
                                            {
                                                job_type_list.map((item, index) => {
                                                    return <option key={index} value={item}>{item}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Publicar desde: </label>
                                        <input type="date" className="form-control" aria-describedby="emailHelp" min={new Date().toISOString().slice(0, 10)} onChange={(e) => setFrom_date(e.target.value)} value={from_date} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Publicar hasta: </label>
                                        <input type="date" className="form-control" aria-describedby="emailHelp" min={new Date().toISOString().slice(0, 10)} onChange={(e) => setUntil_date(e.target.value)} value={until_date} />
                                    </div>

                                    <div className="d-grid">
                                        {
                                            loading ?
                                                <>
                                                    <div className="d-flex justify-content-center">
                                                        <div className="spinner-border text-success" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    {
                                                        vacante ? <button className="btn btn-warning me-md-2" type="submit">Guardar cambios</button> : <button className="btn btn-success me-md-2" type="submit">Publicar</button>
                                                    }

                                                    <button onClick={limpiarCampos} className="btn btn-info me-md-2 mt-3" type="button">Cancelar</button>
                                                </>
                                        }
                                    </div>



                                    {error && <Error mensaje='Todos los campos son obligatorios' />}

                                </div>
                            </div>

                        </div>
                        <div className="col-md-8">
                            <Titulo titulo="Postulaciones" />
                            <div className="card border mb-3">
                                <div className="card-body">
                                    <ListaPostulaciones postulaciones={postulaciones} />
                                </div>
                            </div>
                            <Titulo titulo="Lista de vacantes" />
                            <div className="card border mb-3">
                                <div className="card-body">
                                    <ListaVacantes setSelected_job={setSelected_job} setEliminar={setEliminar} pagina={pagina} setPagina={setPagina} vacante={vacante} setVacante={setVacante} vacantes={vacantes} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </form>
        </>
    )
}

export default MisOfertas