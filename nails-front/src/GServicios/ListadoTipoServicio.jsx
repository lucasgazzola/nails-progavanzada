import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from '../app.config'
import { TipoServicioContext } from './TipoServicioContext'
import {
  obtenerTiposServicios,
  eliminarTipoServicio,
} from '../Services/TipoServicioService'

export default function ListadoTipoServicio() {
  // TODO: Se podría seguir refactorizando para que el componente sea más limpio
  const { tiposServicios, setTiposServicios } = useContext(TipoServicioContext)

  const [consulta, setConsulta] = useState('')
  const [page, setPage] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE)
  const [totalPages, setTotalPages] = useState(0)
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  }) //se utiliza para el orden

  useEffect(() => {
    getDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, consulta])

  const handlePageChange = newPage => {
    setPage(newPage)
  }

  const getDatos = async () => {
    obtenerTiposServicios(consulta, page, pageSize)
      .then(response => {
        setTiposServicios(response.content)
        setTotalPages(response.totalPages)
      })
      .catch(error => {
        console.error('Error fetching items:', error)
      })
  }

  const handleChangeConsulta = e => {
    setConsulta(e.target.value)
  }

  const eliminar = async id => {
    try {
      await eliminarTipoServicio(id)
      await getDatos()
    } catch (error) {
      console.error('Error al eliminar el tipo servicios:', error)
    }
  }

  ///////////////////////////////////////Para el orden de las tablas///////////////////////////////////////////////////
  const handleSort = key => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedData = () => {
    const sorted = [...tiposServicios]
    if (sortConfig.key !== null) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sorted
  }

  ///////////////////////////////////////Hasta aca para el orden de las tablas///////////////////////////////////////////////////

  return (
    <div className="container">
      <div>
        <h1> Gestión de Tipo Servicio </h1>
        <hr></hr>
      </div>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-5">
          <input
            id="consulta"
            name="consulta"
            className="form-control me-2"
            type="search"
            aria-label="Search"
            value={consulta}
            onChange={handleChangeConsulta}></input>
        </div>
        <div className="col-1">
          <button
            onClick={() => getDatos()}
            className="btn btn-outline-success"
            type="submit">
            Buscar
          </button>
        </div>
      </div>
      <hr></hr>
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark text-center">
          <tr>
            <th scope="col" onClick={() => handleSort('id')}>
              #
              {sortConfig.key === 'id' && (
                <span>
                  {sortConfig.direction === 'ascending' ? ' 🔽' : ' 🔼'}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort('denominacion')}>
              Denominación
              {sortConfig.key === 'denominacion' && (
                <span>
                  {sortConfig.direction === 'ascending' ? ' 🔽' : ' 🔼'}
                </span>
              )}
            </th>

            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            //iteramos empleados
            sortedData().map((tipoServicio, indice) => (
              <tr key={indice}>
                <th scope="row">{tipoServicio.id}</th>
                <td>{tipoServicio.denominacion}</td>

                <td className="text-center">
                  <div>
                    <Link
                      to={`/tipoServicio/${tipoServicio.id}`}
                      className="btn btn-link btn-sm me-3">
                      <img
                        src={IMAGEN_EDIT}
                        style={{ width: '20px', height: '20px' }}
                      />
                      Editar
                    </Link>

                    <button
                      onClick={() => eliminar(tipoServicio.id)}
                      className="btn btn-link btn-sm me-3">
                      {' '}
                      <img
                        src={IMAGEN_DELETE}
                        style={{ width: '20px', height: '20px' }}
                      />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-4">
          <Link to={`/tipoServicio`} className="btn btn-success btn-sm me-3">
            Nuevo
          </Link>
        </div>
        <div className="col-4">
          <Link to={`/`} className="btn btn-info btn-sm me-3">
            Regresar
          </Link>
        </div>
      </div>

      {/* /////////////////////// Esto se utiliza para hacer la paginacion  ///////////////////////////////// */}

      <div className="pagination d-md-flex justify-content-md-end">
        {Array.from({ length: totalPages }, (_, i) => i).map(pageNumber => (
          <a
            key={pageNumber}
            href="#"
            onClick={e => {
              e.preventDefault() // Previene el comportamiento predeterminado del enlace
              handlePageChange(pageNumber)
            }}>
            | {pageNumber} |
          </a>
        ))}
      </div>

      {/* /////////////////////// fin de la paginacion  ///////////////////////////////// */}
    </div>
  )
}
