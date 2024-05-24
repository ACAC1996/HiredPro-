import React from 'react'

const ListaPostulaciones = ({ postulaciones }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Cargo</th>
                    <th scope="col">Foto</th>
                    <th scope="col">Postulado</th>
                    <th scope="col">Documento de Identidad</th>
                    <th scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                {
                    postulaciones.map((item,index) => {
                        return (
                            <tr key={item.job_id+index}>
                                <td>{item.title}</td>
                                <td><img src={item.img} width={50} height={50}  /></td>
                                <td>{item.name}</td>
                                <td>{item.dni}</td>
                                <td>{item.email}</td>
                                
                                
                            </tr>
                        )
                    })
                }

                


            </tbody>
        </table>
    )
}

export default ListaPostulaciones