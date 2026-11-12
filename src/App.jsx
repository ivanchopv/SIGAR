import { useState } from 'react'
import './App.css'

function App() {
  // NAVEGACIÓN

  const [seccionActiva, setSeccionActiva] = useState('inicio')
  const [tipoReporte, setTipoReporte] = useState('pagos')
  const [anioReporte, setAnioReporte] = useState('2026')

  const [solicitudes] = useState([
    { id: 1, tipo: 'Mantenimiento', descripcion: 'Revisión de luminaria', estado: 'Abierta' },
    { id: 2, tipo: 'Administrativa', descripcion: 'Actualización de datos', estado: 'En proceso' },
    { id: 3, tipo: 'Mantenimiento', descripcion: 'Revisión de fuga de agua', estado: 'Cerrada' },
  ])

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

  // HU-06 - GESTIÓN DE RESIDENTES
  const [residentes, setResidentes] = useState([
    {
      id: 1,
      nombre: 'Ana López',
      casa: '12',
      telefono: '5551234567',
      estado: 'Activo',
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      casa: '8',
      telefono: '5559876543',
      estado: 'Activo',
    },
    {
      id: 3,
      nombre: 'María Gómez',
      casa: '15',
      telefono: '5554567890',
      estado: 'Activo',
    },
  ])

  const [buscarResidenteAdmin, setBuscarResidenteAdmin] = useState('')

  const [mostrarFormularioResidente, setMostrarFormularioResidente] =
    useState(false)

  const [nuevoResidente, setNuevoResidente] = useState({
    nombre: '',
    casa: '',
    telefono: '',
  })

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

    alert(
      `PAGO REGISTRADO CORRECTAMENTE\n\n` +
      `Residente: ${nuevoPago.residente}\n` +
      `Fecha: ${nuevoPago.fecha.split('-').reverse().join('/')}\n` +
      `Importe: $${nuevoPago.monto.toLocaleString('es-MX')}`
    )
  }


  // HU-06 - REGISTRAR RESIDENTE
  const registrarResidente = (e) => {
    e.preventDefault()

    if (
      !nuevoResidente.nombre ||
      !nuevoResidente.casa ||
      !nuevoResidente.telefono
    ) {
      alert('Completa todos los datos del residente')
      return
    }

    const residente = {
      id: Date.now(),
      nombre: nuevoResidente.nombre,
      casa: nuevoResidente.casa,
      telefono: nuevoResidente.telefono,
      estado: 'Activo',
    }

    setResidentes([...residentes, residente])

    setNuevoResidente({
      nombre: '',
      casa: '',
      telefono: '',
    })

    setMostrarFormularioResidente(false)

    alert('Residente registrado correctamente')
  }

  // HU-06 - CAMBIAR ESTADO DEL RESIDENTE
  const cambiarEstadoResidente = (id) => {
    setResidentes(
      residentes.map((residente) =>
        residente.id === id
          ? {
            ...residente,
            estado:
              residente.estado === 'Activo'
                ? 'Inactivo'
                : 'Activo',
          }
          : residente
      )
    )
  }

  // FORMATO PARA REPORTES Y RESUMEN GENERAL
  const formatearMoneda = (cantidad) =>
    cantidad.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 })

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '—'
    const [anio, mes, dia] = fechaISO.split('-')
    return `${dia}/${mes}/${anio}`
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
  const residentesCuenta = [
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

  // HU-06 - FILTRAR RESIDENTES
  const residentesFiltrados = residentes.filter((residente) =>
    residente.nombre
      .toLowerCase()
      .includes(buscarResidenteAdmin.toLowerCase())
  )

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
        <button
          className={
            seccionActiva === 'reportes'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('reportes')}
        >
          Reportes
        </button>
        <button
          className={
            seccionActiva === 'residentes'
              ? 'menu-activo'
              : ''
          }
          onClick={() => cambiarSeccion('residentes')}
        >
          Residentes
        </button>
        <button
          className={seccionActiva === 'informacion' ? 'menu-activo' : ''}
          onClick={() => cambiarSeccion('informacion')}
        >
          Información
        </button>
        <button
          className={seccionActiva === 'resumen' ? 'menu-activo' : ''}
          onClick={() => cambiarSeccion('resumen')}
        >
          Resumen general
        </button>
        <button
          className={seccionActiva === 'integracion' ? 'menu-activo' : ''}
          onClick={() => cambiarSeccion('integracion')}
        >
          Integración
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

          <section className="dashboard-grid">

            <article className="dashboard-card card-pagos">
              <div className="dashboard-card-top">
                <div className="dashboard-icon">🧾</div>
                <span className="dashboard-tag">Actividad</span>
              </div>
              <h3>{pagos.length}</h3>
              <p>Pagos registrados</p>
              <span className="dashboard-detail">
                Operaciones registradas en el sistema
              </span>
            </article>

            <article className="dashboard-card card-ingresos">
              <div className="dashboard-card-top">
                <div className="dashboard-icon">💰</div>
                <span className="dashboard-tag">Ingresos</span>
              </div>
              <h3>{formatearMoneda(totalRecaudado)}</h3>
              <p>Total recaudado</p>
              <span className="dashboard-detail">
                Importe acumulado de pagos
              </span>
            </article>

            <article className="dashboard-card card-adeudos">
              <div className="dashboard-card-top">
                <div className="dashboard-icon">⚠️</div>
                <span className="dashboard-tag">Pendientes</span>
              </div>
              <h3>{adeudos.length}</h3>
              <p>Adeudos pendientes</p>
              <span className="dashboard-detail">
                Residentes con pagos pendientes
              </span>
            </article>

            <article className="dashboard-card card-residentes">
              <div className="dashboard-card-top">
                <div className="dashboard-icon">👥</div>
                <span className="dashboard-tag">Comunidad</span>
              </div>
              <h3>{residentes.length}</h3>
              <p>Residentes registrados</p>
              <span className="dashboard-detail">
                Residentes registrados en SIGAR
              </span>
            </article>

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


      {seccionActiva === 'reportes' && (
        <section className="seccion">
          <div className="titulo-seccion">
            <div>
              <h2>Reportes administrativos</h2>
              <p>Selecciona el tipo de información que deseas consultar.</p>
            </div>
            <button type="button" className="boton-principal" onClick={() => window.print()}>
              Imprimir reporte
            </button>
          </div>

          <div className="filtros-reporte">
            <div className="campo">
              <label htmlFor="tipoReporte">Tipo de reporte</label>
              <select id="tipoReporte" value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
                <option value="pagos">Pagos registrados</option>
                <option value="adeudos">Adeudos pendientes</option>
                <option value="residentes">Residentes registrados</option>
                <option value="solicitudes">Solicitudes por estado</option>
              </select>
            </div>
            {tipoReporte === 'pagos' && (
              <div className="campo">
                <label htmlFor="anioReporte">Año</label>
                <select id="anioReporte" value={anioReporte} onChange={(e) => setAnioReporte(e.target.value)}>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            )}
          </div>

          {tipoReporte === 'pagos' && (() => {
            const pagosAnio = pagos.filter((pago) => pago.fecha.startsWith(anioReporte))
            const totalAnual = pagosAnio.reduce((total, pago) => total + pago.monto, 0)
            const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
            const pagosPorMes = meses.map((mes, indice) => {
              const mesNumero = String(indice + 1).padStart(2, '0')
              const delMes = pagosAnio.filter((pago) => pago.fecha.slice(5, 7) === mesNumero)
              return { mes, cantidad: delMes.length, total: delMes.reduce((sum, pago) => sum + pago.monto, 0) }
            })
            const maxMes = Math.max(...pagosPorMes.map((item) => item.total), 1)
            return (
              <>
                <div className="estado-cuenta">
                  <div className="dato-cuenta"><strong>Pagos del año</strong><span>{pagosAnio.length}</span></div>
                  <div className="dato-cuenta"><strong>Total recaudado</strong><span>{formatearMoneda(totalAnual)}</span></div>
                </div>
                <h3>Pagos por mes · {anioReporte}</h3>
                <div className="grafica-meses">
                  {pagosPorMes.map((item) => (
                    <div className="barra-mes" key={item.mes}>
                      <span className="barra-valor">{item.total ? formatearMoneda(item.total) : '$0'}</span>
                      <div className="barra-fondo"><div className="barra-relleno" style={{ height: `${(item.total / maxMes) * 100}%` }} /></div>
                      <span className="barra-etiqueta">{item.mes}</span>
                    </div>
                  ))}
                </div>
                <table className="tabla">
                  <thead><tr><th>Residente</th><th>Fecha</th><th>Monto</th></tr></thead>
                  <tbody>
                    {pagosAnio.map((pago) => (
                      <tr key={pago.id}><td>{pago.residente}</td><td>{formatearFecha(pago.fecha)}</td><td>{formatearMoneda(pago.monto)}</td></tr>
                    ))}
                  </tbody>
                  <tfoot><tr><th colSpan="2">Total del periodo</th><th>{formatearMoneda(totalAnual)}</th></tr></tfoot>
                </table>
                {pagosAnio.length === 0 && <p>No hay pagos registrados para el año seleccionado.</p>}
              </>
            )
          })()}

          {tipoReporte === 'adeudos' && (
            <>
              <div className="estado-cuenta">
                <div className="dato-cuenta"><strong>Adeudos pendientes</strong><span>{adeudos.length}</span></div>
                <div className="dato-cuenta"><strong>Total pendiente</strong><span>{formatearMoneda(totalAdeudos)}</span></div>
              </div>
              <table className="tabla">
                <thead><tr><th>Residente</th><th>Monto pendiente</th><th>Estado</th></tr></thead>
                <tbody>{adeudos.map((adeudo) => <tr key={adeudo.id}><td>{adeudo.residente}</td><td>{formatearMoneda(adeudo.monto)}</td><td>{adeudo.estado}</td></tr>)}</tbody>
              </table>
            </>
          )}

          {tipoReporte === 'residentes' && (
            <>
              <div className="estado-cuenta">
                <div className="dato-cuenta"><strong>Total de residentes</strong><span>{residentes.length}</span></div>
                <div className="dato-cuenta"><strong>Activos</strong><span>{residentes.filter((r) => r.estado === 'Activo').length}</span></div>
                <div className="dato-cuenta"><strong>Inactivos</strong><span>{residentes.filter((r) => r.estado === 'Inactivo').length}</span></div>
              </div>
              <table className="tabla">
                <thead><tr><th>Nombre</th><th>Casa</th><th>Estado</th></tr></thead>
                <tbody>{residentes.map((residente) => <tr key={residente.id}><td>{residente.nombre}</td><td>{residente.casa}</td><td>{residente.estado}</td></tr>)}</tbody>
              </table>
            </>
          )}

          {tipoReporte === 'solicitudes' && (
            <>
              <div className="estado-cuenta">
                <div className="dato-cuenta"><strong>Total de solicitudes de ejemplo</strong><span>{solicitudes.length}</span></div>
                <div className="dato-cuenta"><strong>Abiertas</strong><span>{solicitudes.filter((s) => s.estado === 'Abierta').length}</span></div>
                <div className="dato-cuenta"><strong>En proceso</strong><span>{solicitudes.filter((s) => s.estado === 'En proceso').length}</span></div>
              </div>
              <p className="nota-demo">Los datos de solicitudes son ejemplos en memoria para probar la presentación del reporte.</p>
              <table className="tabla">
                <thead><tr><th>Tipo</th><th>Descripción</th><th>Estado</th></tr></thead>
                <tbody>{solicitudes.map((solicitud) => <tr key={solicitud.id}><td>{solicitud.tipo}</td><td>{solicitud.descripcion}</td><td>{solicitud.estado}</td></tr>)}</tbody>
              </table>
            </>
          )}
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
              {residentesCuenta.map((residente) => (
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

      {seccionActiva === 'residentes' && (
        <section className="seccion">
          <div className="encabezado-residentes">
            <div>
              <h2>Gestión de residentes</h2>

              <p>
                Registra y consulta la información administrativa
                de los residentes.
              </p>
            </div>

            <button
              type="button"
              className="boton-principal"
              onClick={() =>
                setMostrarFormularioResidente(
                  !mostrarFormularioResidente
                )
              }
            >
              {mostrarFormularioResidente
                ? 'Cancelar'
                : '+ Nuevo residente'}
            </button>
          </div>

          {mostrarFormularioResidente && (
            <form
              onSubmit={registrarResidente}
              className="formulario formulario-residente"
            >
              <h3>Registrar residente</h3>

              <div className="campo">
                <label>Nombre completo</label>

                <input
                  type="text"
                  value={nuevoResidente.nombre}
                  onChange={(e) =>
                    setNuevoResidente({
                      ...nuevoResidente,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div className="campo">
                <label>Número de casa</label>

                <input
                  type="text"
                  value={nuevoResidente.casa}
                  onChange={(e) =>
                    setNuevoResidente({
                      ...nuevoResidente,
                      casa: e.target.value,
                    })
                  }
                  placeholder="Ej. 20"
                />
              </div>

              <div className="campo">
                <label>Teléfono</label>

                <input
                  type="tel"
                  value={nuevoResidente.telefono}
                  onChange={(e) =>
                    setNuevoResidente({
                      ...nuevoResidente,
                      telefono: e.target.value,
                    })
                  }
                  placeholder="Ej. 5551234567"
                />
              </div>

              <button
                type="submit"
                className="boton-principal"
              >
                Guardar residente
              </button>
            </form>
          )}

          <div className="formulario-busqueda">
            <div className="campo">
              <label>Buscar residente</label>

              <input
                type="text"
                value={buscarResidenteAdmin}
                onChange={(e) =>
                  setBuscarResidenteAdmin(e.target.value)
                }
                placeholder="Nombre del residente"
              />
            </div>
          </div>

          <div className="resumen-tabla">
            <strong>
              Residentes registrados: {residentes.length}
            </strong>

            <strong>
              Resultados: {residentesFiltrados.length}
            </strong>
          </div>

          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Casa</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {residentesFiltrados.map((residente) => (
                <tr key={residente.id}>
                  <td>{residente.nombre}</td>

                  <td>{residente.casa}</td>

                  <td>{residente.telefono}</td>

                  <td>
                    <span
                      className={
                        residente.estado === 'Activo'
                          ? 'estado-corriente'
                          : 'estado-pendiente'
                      }
                    >
                      {residente.estado}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="boton-secundario"
                      onClick={() =>
                        cambiarEstadoResidente(residente.id)
                      }
                    >
                      Cambiar estado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {seccionActiva === 'informacion' && (
        <section className="seccion">
          <div className="titulo-seccion">
            <div>
              <h2>Información de la residencia</h2>
              <p>Consulta de información administrativa disponible para los residentes.</p>
            </div>
            <span className="etiqueta-informativa">Información de ejemplo</span>
          </div>
          <div className="informacion-grid">
            <article className="informacion-card">
              <h3>Datos generales</h3>
              <dl>
                <dt>Nombre</dt><dd>Residencial Los Robles</dd>
                <dt>Ubicación</dt><dd>Estado de México</dd>
                <dt>Tipo de administración</dt><dd>Residencial</dd>
                <dt>Uso del sistema</dt><dd>Gestión administrativa y consulta</dd>
              </dl>
            </article>
            <article className="informacion-card">
              <h3>Información para residentes</h3>
              <ul>
                <li>Consultar pagos y adeudos en los módulos correspondientes.</li>
                <li>Revisar los avisos publicados por la administración cuando el módulo esté disponible.</li>
                <li>Registrar solicitudes o incidencias mediante el módulo de solicitudes cuando esté disponible.</li>
              </ul>
            </article>
          </div>
        </section>
      )}

      {seccionActiva === 'resumen' && (
        <section className="seccion">
          <h2>Resumen general</h2>
          <p>Indicadores calculados a partir de los datos de ejemplo que mantiene actualmente la aplicación en memoria.</p>
          <div className="resumen resumen-general">
            <div className="card"><h3>{residentes.length}</h3><p>Residentes registrados</p></div>
            <div className="card"><h3>{formatearMoneda(totalRecaudado)}</h3><p>Pagos registrados</p></div>
            <div className="card"><h3>{formatearMoneda(totalAdeudos)}</h3><p>Adeudos pendientes</p></div>
            <div className="card"><h3>{solicitudes.filter((s) => s.estado !== 'Cerrada').length}</h3><p>Solicitudes abiertas o en proceso</p></div>
          </div>
          <h3>Indicadores de solicitudes</h3>
          <table className="tabla">
            <thead><tr><th>Estado</th><th>Cantidad</th></tr></thead>
            <tbody>
              <tr><td>Abierta</td><td>{solicitudes.filter((s) => s.estado === 'Abierta').length}</td></tr>
              <tr><td>En proceso</td><td>{solicitudes.filter((s) => s.estado === 'En proceso').length}</td></tr>
              <tr><td>Cerrada</td><td>{solicitudes.filter((s) => s.estado === 'Cerrada').length}</td></tr>
            </tbody>
          </table>
        </section>
      )}

      {seccionActiva === 'integracion' && (
        <section className="seccion">
          <h2>Integración y validación del flujo</h2>
          <div className="flujo-modulos">
            {[
              { id: 'residentes', titulo: 'Residentes', detalle: 'Consulta y gestión de residentes' },
              { id: 'registro', titulo: 'Pagos', detalle: 'Registro de pagos' },
              { id: 'adeudos', titulo: 'Adeudos', detalle: 'Consulta de pagos pendientes' },
              { id: 'informacion', titulo: 'Información', detalle: 'Consulta de datos de la residencia' },
              { id: 'reportes', titulo: 'Reportes', detalle: 'Generación de reportes administrativos' },
              { id: 'resumen', titulo: 'Resumen general', detalle: 'Indicadores de operación' },
            ].map((modulo, indice) => (
              <button type="button" className="flujo-modulo" key={modulo.id} onClick={() => cambiarSeccion(modulo.id)}>
                <span className="flujo-numero">{String(indice + 1).padStart(2, '0')}</span>
                <strong>{modulo.titulo}</strong>
                <span>{modulo.detalle}</span>
                <span className="flujo-abrir">Abrir módulo →</span>
              </button>
            ))}
          </div>
          <h3>Lista de verificación de integración</h3>
          <ul className="lista-validacion">
            <li>Comprobar que el menú permita acceder a cada módulo.</li>
            <li>Verificar que los totales del resumen coincidan con pagos y adeudos.</li>
            <li>Generar un reporte y revisar que los datos correspondan a los registros visibles.</li>
            <li>Revisar que la navegación no produzca errores en la consola del navegador.</li>
          </ul>
        </section>
      )}

      <footer className="footer">
        Proyecto II · Sprint 3 · SIGAR
      </footer>

    </div>
  )
}

export default App