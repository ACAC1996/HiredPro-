import React from 'react'

const ListaVacantes = ({ setSelected_job, vacantes, pagina, setPagina, vacante, setVacante, setEliminar }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Titulo</th>
                    <th scope="col">Modalidad de Trabajo</th>
                    <th scope="col">Ubicación</th>
                    <th scope="col">Experiencia</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {
                    vacantes.map((item) => {
                        return (
                            <tr key={item.job_id}>
                                <td>{item.title}</td>
                                <td>{item.job_type}</td>
                                <td>{item.city}</td>
                                <td>{item.experience}</td>
                                <td>
                                    <div className='d-flex '>
                                        <button type='button' className='btn btn-info btn-sm me-2' onClick={() => setVacante(item)}>Editar</button>
                                        <button type='button' className='btn btn-danger btn-sm me-2' onClick={() => {
                                            setEliminar(item.job_id)
                                        }} >Eliminar</button>
                                        <button type='button' className='btn btn-dark btn-sm' onClick={() => {
                                            setSelected_job(item.job_id)
                                        }} >Postulaciones</button>
                                    </div>

                                </td>

                            </tr>
                        )
                    })
                }

                <tr>
                    <td colSpan={5}>
                        <nav aria-label="...">
                            <ul className="pagination justify-content-center">
                                {
                                    pagina == 1 ?
                                        <li className="page-item disabled"><a className="page-link" >Primera</a></li>
                                        :
                                        <li className="page-item"><a className="page-link" onClick={() => setPagina(1)}>Primera</a></li>

                                }

                                {
                                    pagina > 1 &&
                                    <li className='page-item'>
                                        <a className='page-link' onClick={() => setPagina(pagina - 1)}>
                                            {pagina - 1}
                                        </a>
                                    </li>
                                }
                                <li className="page-item active" aria-current="page">
                                    <a className="page-link" >{pagina}</a>
                                </li>
                                {
                                    vacantes.length < 5 ? (<></>) : (<>
                                        <li className="page-item"><a className="page-link" onClick={() => setPagina(pagina + 1)}>{pagina + 1}</a></li>
                                    </>)
                                }

                                {
                                    vacantes.length < 5 ? (<li className="page-item disabled"><a className="page-link" >Siguiente</a></li>) : (
                                        <li className="page-item"><a className="page-link" onClick={() => setPagina(pagina + 1)}>Siguiente</a></li>
                                    )
                                }

                            </ul>
                        </nav>
                    </td>
                </tr>


            </tbody>
        </table>
    )
}

export default ListaVacantes