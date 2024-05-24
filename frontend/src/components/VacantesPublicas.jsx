import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Navigate } from 'react-router-dom'

const VacantesPublicas = () => {
    const [vacantes, setVacantes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [titulo, setTitulo] = useState("")


    //aplicante
    const [dni, setDni] = useState()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [salary, setSalary] = useState()
    const [img, setImg] = useState("")
    const [job_id, setJob_id] = useState(0)
    const [persons_id, setPersons_id] = useState(0)

    const limpiarCampos = () => {
        setDni('')
        setName('')
        setEmail('')
        setSalary(0)
        setImg('')
        setJob_id(0)
        setPersons_id(0)
    }

    const aplicar = async (e) => {
        e.preventDefault()
        let persona = { dni, name, email, img }
        if ([dni, name, email, img].includes('')) {
            setError(true)
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Todos los campos son obligatorios",
                showConfirmButton: false,
                timer: 1500
            });
            return
        } else setError(false)

        setLoading(true)
            try {
                const { data } = await axios.post(`persons`, persona)
                const idPersona = data.data.person_id;
                
                const respuesta = await axios.post('apply', {
                    job_id,
                    persons_id: idPersona,
                    salary
                })


                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: respuesta.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                limpiarCampos()


            } catch (err) {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: err.message.includes("400")?"Ya aplicó a esta vacante":err.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            setLoading(false)
            limpiarCampos()
        
    }


    const getVacantes = async (companyId) => {
        try {
            const { data } = await axios.get(`job/all/${pagina}/20`);
            setVacantes(data)
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
            setImg(reader.result);
        }
    }

    const limpiarFoto = () => {
        setImg("")
    }

    useEffect(() => {
        getVacantes()
    }, [vacantes])

    


    return (
        <>
            <div className="row" >

                <div className="col-md-10 mx-auto">
                    {
                        vacantes.map((item) => {
                            return (

                                <div className="card ny-2" key={item.job_id}>
                                    <div className="card-body d-flex flex-row">
                                        <div className='flex-grow-1'>
                                            <h5 className="card-title">{item.title}</h5>

                                            <p className="card-text">
                                                <img src={item.logo} width={24} />{" "}{item.company}
                                                <br />
                                                <span className='text-secondary'><strong>Ubicación: </strong>{item.city} ({item.job_type})</span>
                                                

                                                <br />
                                                <span className='text-secondary'><strong>Experiencia: </strong>{item.experience} años</span>
                                                <br />
                                                <span className='text-secondary'><strong>Cierra en: </strong>{item.dias} días</span>
                                            </p>
                                        </div>
                                        <a href="#" onClick={() => {
                                            setJob_id(item.job_id)
                                            setTitulo(item.title)
                                        }} className="btn btn-success my-auto btn-lg" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Aplicar</a>

                                    </div>
                                </div>

                            )
                        })
                    }
                </div>
            </div>


            <div className="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Aplicar a vacante <span className='text-success'>{titulo}</span></h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                {
                                    img && (
                                        <div className="mb-3">
                                            <img src={img} height={100} />
                                            <button title='Quitar foto' type="button" className="btn-close" onClick={limpiarFoto}></button>
                                        </div>
                                    )
                                }

                                <div className="mb-3">
                                    <label for="recipient-name" className="col-form-label">Documento de identidad:</label>
                                    <input value={dni} type="number" placeholder='Ingrese su número de documento de identidad' className="form-control" onChange={(e) => {
                                        setDni(e.target.value)
                                    }} />
                                </div>
                                <div className="mb-3">
                                    <label for="recipient-name" className="col-form-label">Nombre completo:</label>
                                    <input value={name} type="text" placeholder='Ingrese su nombre' className="form-control" onChange={(e) => {
                                        setName(e.target.value)
                                    }} />
                                </div>
                                <div className="mb-3">
                                    <label for="recipient-name" className="col-form-label">Correo electrónico:</label>
                                    <input value={email} type="email" placeholder='Ingrese su email' className="form-control" onChange={(e) => {
                                        setEmail(e.target.value)
                                    }} />
                                </div>
                                <div className="mb-3">
                                    <label for="recipient-name" className="col-form-label">Salario:</label>
                                    <input value={salary} type="number" placeholder='Ingrese su aspiración salarial' className="form-control" onChange={(e) => {
                                        setSalary(e.target.value)
                                    }} />
                                </div>
                                <div className="mb-3">
                                    <label for="message-text" className="col-form-label">Foto:</label>
                                    <input type='file' className='form-control' onChange={readImg} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">

                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={aplicar}>Aplicar</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VacantesPublicas