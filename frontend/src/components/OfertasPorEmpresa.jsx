import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import Titulo from './common/Titulo';
import ListaVacantesPorEmpresa from './ListaVacantesPorEmpresa';
import { useNavigate } from 'react-router-dom';

const OfertasPorEmpresa = () => {
    const { companyId } = useParams();
    const [empresa, setEmpresa] = useState(null);
    const [vacantes, setVacantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    // Método para obtener los datos de la empresa y las vacantes
    const obtenerDatosEmpresa = async () => {
        try {
            const empresaResponse = await axios.get(`/company/${companyId}`);
            setEmpresa(empresaResponse.data);

            const vacantesResponse = await axios.get(`/job/all/${companyId}/1/10`);
            setVacantes(vacantesResponse.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para llamar al método al montar el componente
    useEffect(() => {
        obtenerDatosEmpresa();
    }, [companyId]); // Dependencia del companyId para volver a ejecutar si cambia

    return (
        <div className="col-md-8 mx-auto">
            {loading ? (
                <p>Cargando empresa...</p>
            ) : error ? (
                <div className='text-center max-auto'>
                    <h2>No hay vacantes en</h2>
                    <img src={empresa.logo} alt={empresa.company} />
                    <h3>{empresa.company}</h3>
                    <br />
                    <button type="button" class="btn btn-warning mb-4"><Link to={`/empresas`} style={{ textDecoration: 'none' }} className='text-dark'>Volver</Link></button>
                </div>

            ) : (
                <>
                    <Titulo titulo="Vacantes disponibles en" />
                    <div className='logo-container text-center'>

                        <img src={empresa.logo} alt={empresa.company} />
                    </div>




                    <h2 className='text-center'>{empresa.company}</h2>
                    <div className="card border mb-3">
                        <div className="card-body">
                            <ListaVacantesPorEmpresa vacantes={vacantes} />
                        </div>

                    </div>
                    <div className='text-center text-lg'>
                        <button type="button" class="btn btn-warning mb-3"><Link to={`/empresas`} style={{ textDecoration: 'none' }} className='text-dark m-4'>Volver</Link></button>
                    </div>

                </>
            )}
        </div>
    );
};

export default OfertasPorEmpresa;