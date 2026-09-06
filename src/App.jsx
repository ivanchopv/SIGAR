import { useState } from 'react'
import './App.css'

function App() {
  // NAVEGACIÓN

  const [seccionActiva, setSeccionActiva] = useState('inicio')
 
  // HU-01 - REGISTRO DE PAGOS
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState('')
  const [monto, setMonto] = useState('')

  // HU-02 - HISTORIAL DE PAGOS
  const [pagos, setPagos] = useState([
    {
      id: 1,
      residente: 'Ana López',
      fecha: '2026-09-01',
      monto: 1200,
    },
    {
      id: 2,
      residente: 'Carlos Ruiz',
      fecha: '2026-09-03',
      monto: 950,
    },
  ])

  // HU-03 - CONSULTA DE ADEUDOS
  const [adeudos] = useState([
    {
      id: 1,
      residente: 'José Martínez',
      monto: 850,
      estado: 'Pendiente',
    },
    {
      id: 2,
      residente: 'María Gómez',
      monto: 1200,
      estado: 'Pendiente',
    },
    {
      id: 3,
      residente: 'Luis Herrera',
      monto: 650,
      estado: 'Pendiente',
    },
  ])

  // HU-04 - ESTADO DE CUENTA
  const [residenteSeleccionado, setResidenteSeleccionado] =
    useState('Ana López')


  // HU-05 - BÚSQUEDA DE PAGOS
  const [buscarResidente, setBuscarResidente] = useState('')
  const [buscarFecha, setBuscarFecha] = useState('')

  // HU-01 - REGISTRAR PAGO
  const registrarPago = (e) => {
    e.preventDefault()

    if (!nombre || !fecha || !monto) {
      alert('Completa todos los campos')
      return
    }

    const nuevoPago = {
      id: Date.now(),
      residente: nombre,
      fecha: fecha,
      monto: Number(monto),
    }

    setPagos([...pagos, nuevoPago])

    setNombre('')
    setFecha('')
    setMonto('')

    alert('Pago registrado correctamente')
  }


  // CÁLCULOS
  const totalRecaudado = pagos.reduce(
    (total, pago) => total + pago.monto,
    0
  )

  const totalAdeudos = adeudos.reduce(
    (total, adeudo) => total + adeudo.monto,
    0
  )

  // HU-04 - INFORMACIÓN DEL RESIDENTE
  const residentes = [
    'Ana López',
    'Carlos Ruiz',
    'José Martínez',
    'María Gómez',
    'Luis Herrera',
  ]

  const pagosResidente = pagos.filter(
    (pago) => pago.residente === residenteSeleccionado
  )

  const totalPagadoResidente = pagosResidente.reduce(
    (total, pago) => total + pago.monto,
    0
  )

  const adeudoResidente = adeudos.find(
    (adeudo) => adeudo.residente === residenteSeleccionado
  )

  const montoAdeudo = adeudoResidente
    ? adeudoResidente.monto
    : 0

  const estadoCuenta =
    montoAdeudo > 0
      ? 'Con adeudo'
      : 'Al corriente'

  // HU-05 - FILTRAR PAGOS
  const pagosFiltrados = pagos.filter((pago) => {
    const coincideResidente =
      buscarResidente === '' ||
      pago.residente
        .toLowerCase()
        .includes(buscarResidente.toLowerCase())

    const coincideFecha =
      buscarFecha === '' ||
      pago.fecha === buscarFecha

    return coincideResidente && coincideFecha
  })

  const limpiarBusqueda = () => {
    setBuscarResidente('')
    setBuscarFecha('')
  }

  // CAMBIAR DE SECCIÓN
  const cambiarSeccion = (seccion) => {
    setSeccionActiva(seccion)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="app">
      <header className="header">
        <h1>SIGAR</h1>
        <p>
          Sistema de Gestión y Administración Residencial
        </p>
      </header>
      <nav className="menu">
        <button
          className={
            seccionActiva === 'inicio'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('inicio')}
        >
          Inicio
        </button>
        <button
          className={
            seccionActiva === 'registro'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('registro')}
        >
          Registrar Pago
        </button>

        <button
          className={
            seccionActiva === 'historial'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('historial')}
        >
          Historial
        </button>

        <button
          className={
            seccionActiva === 'adeudos'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('adeudos')}
        >
          Adeudos
        </button>

        <button
          className={
            seccionActiva === 'estado'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('estado')}
        >
          Estado de Cuenta
        </button>

        <button
          className={
            seccionActiva === 'busqueda'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('busqueda')}
        >
          Búsqueda
        </button>
      </nav>
      {seccionActiva === 'inicio' && (
        <>
          <section className="bienvenida">
            <h2>
              Bienvenido a SIGAR
            </h2>
            <p>
              Sistema para gestionar y consultar
              los pagos de los residentes.
            </p>
          </section>
          <section className="resumen">
            <div className="card">
              <h3>
                {pagos.length}
              </h3>
              <p>
                Pagos registrados
              </p>
            </div>
            <div className="card">
              <h3>
                ${totalRecaudado.toLocaleString('es-MX')}
              </h3>
              <p>
                Total recaudado
              </p>
            </div>
            <div className="card">
              <h3>
                {adeudos.length}
              </h3>

              <p>
                Adeudos pendientes
              </p>
            </div>
          </section>
        </>
      )}
      {seccionActiva === 'registro' && (
        <section className="seccion">
          <h2>
            Registrar pago
          </h2>
          <p>
            Ingresa los datos del pago realizado por el residente.
          </p>
          <form
            onSubmit={registrarPago}
            className="formulario"
          >
            <div className="campo">
              <label>
                Nombre del residente
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div className="campo">
              <label>
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) =>
                  setFecha(e.target.value)
                }
              />
            </div>
            <div className="campo">
              <label>
                Monto
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) =>
                  setMonto(e.target.value)
                }
                placeholder="Ej. 1200"
                min="1"
              />
            </div>
            <button
              type="submit"
              className="boton-principal"
            >
              Registrar pago
            </button>
          </form>
        </section>
      )}

      {seccionActiva === 'historial' && (
        <section className="seccion">
          <h2>
            Historial de pagos
          </h2>
          <p>
            Consulta todos los pagos registrados en el sistema.
          </p>
          <table className="tabla">
            <thead>
              <tr>
                <th>Residente</th>
                <th>Fecha</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>
                    {pago.residente}
                  </td>
                  <td>
                    {pago.fecha}
                  </td>
                  <td>
                    ${pago.monto.toLocaleString('es-MX')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="resumen-tabla">
            <strong>
              Total de pagos: {pagos.length}
            </strong>
            <strong>
              Total recaudado: $
              {totalRecaudado.toLocaleString('es-MX')}
            </strong>
          </div>
        </section>
      )}

      {seccionActiva === 'adeudos' && (
        <section className="seccion">
          <h2>
            Consulta de adeudos
          </h2>
          <p>
            Consulta los residentes que tienen pagos pendientes.
          </p>
          <div className="adeudo-total">
            <strong>
              Total pendiente:
            </strong>
            <span>
              ${totalAdeudos.toLocaleString('es-MX')}
            </span>
          </div>
          <table className="tabla">
            <thead>
              <tr>
                <th>Residente</th>
                <th>Adeudo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {adeudos.map((adeudo) => (
                <tr key={adeudo.id}>
                  <td>
                    {adeudo.residente}
                  </td>
                  <td>
                    ${adeudo.monto.toLocaleString('es-MX')}
                  </td>
                  <td>
                    <span className="estado-pendiente">
                      {adeudo.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
      {seccionActiva === 'estado' && (
        <section className="seccion">
          <h2>
            Estado de cuenta
          </h2>
          <p>
            Consulta la situación de cuenta de un residente.
          </p>
          <div className="campo campo-residente">
            <label>
              Seleccionar residente
            </label>
            <select
              value={residenteSeleccionado}
              onChange={(e) =>
                setResidenteSeleccionado(e.target.value)
              }
            >
              {residentes.map((residente) => (
                <option
                  key={residente}
                  value={residente}
                >
                  {residente}
                </option>
              ))}
            </select>
          </div>
          <div className="estado-cuenta">
            <div className="dato-cuenta">
              <strong>
                Residente
              </strong>
              <span>
                {residenteSeleccionado}
              </span>
            </div>
            <div className="dato-cuenta">
              <strong>
                Total pagado
              </strong>
              <span>
                ${totalPagadoResidente.toLocaleString('es-MX')}
              </span>
            </div>
            <div className="dato-cuenta">
              <strong>
                Adeudo pendiente
              </strong>
              <span>
                ${montoAdeudo.toLocaleString('es-MX')}
              </span>
            </div>
            <div className="dato-cuenta">
              <strong>
                Estado
              </strong>
              <span
                className={
                  montoAdeudo > 0
                    ? 'estado-pendiente'
                    : 'estado-corriente'
                }
              >
                {estadoCuenta}
              </span>
            </div>
          </div>
          <h3>
            Historial del residente
          </h3>
          {pagosResidente.length === 0 ? (
            <p>
              El residente no tiene pagos registrados.
            </p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
              {pagosResidente.map((pago) => (
                  <tr key={pago.id}>
                    <td>
                      {pago.fecha}
                    </td>
                    <td>
                      ${pago.monto.toLocaleString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {seccionActiva === 'busqueda' && (
        <section className="seccion">
          <h2>
            Búsqueda de pagos
          </h2>
          <p>
            Busca pagos registrados por residente y fecha.
          </p>
          <div className="formulario-busqueda">
            <div className="campo">
              <label>
                Residente
              </label>
              <input
                type="text"
                value={buscarResidente}
                onChange={(e) =>
                  setBuscarResidente(e.target.value)
                }
                placeholder="Ej. Ana López"
              />
            </div>
            <div className="campo">
              <label>
                Fecha
              </label>
              <input
                type="date"
                value={buscarFecha}
                onChange={(e) =>
                  setBuscarFecha(e.target.value)
                }
              />
            </div>
            <button
              type="button"
              className="boton-secundario"
              onClick={limpiarBusqueda}
            >
              Limpiar
            </button>
          </div>
          <h3>
            Resultados encontrados: {pagosFiltrados.length}
          </h3>
          {pagosFiltrados.length === 0 ? (
            <p>
              No se encontraron pagos con los criterios seleccionados.
            </p>
          ) : (
            <table className="tabla">
              <thead>
                <tr>
                  <th>Residente</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {pagosFiltrados.map((pago) => (
                  <tr key={pago.id}>
                    <td>
                      {pago.residente}
                    </td>
                    <td>
                      {pago.fecha}
                    </td>
                    <td>
                      ${pago.monto.toLocaleString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <footer className="footer">
        Proyecto II · Sprint 1 · SIGAR
      </footer>

    </div>
  )
}

export default App