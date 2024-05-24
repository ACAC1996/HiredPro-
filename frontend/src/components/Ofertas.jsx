import React from 'react'
import Titulo from './common/Titulo'
import VacantesPublicas from './VacantesPublicas'

const Ofertas = () => {
  return (
    <>
      <Titulo titulo='Vacantes disponibles'/>
      <VacantesPublicas/>
    </>
  )
}

export default Ofertas