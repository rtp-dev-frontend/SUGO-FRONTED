import { RutaDBSWAP } from "../../../../CASETA/interfaces/Rutas";
import {  } from "../../../../shared/helpers";
import { 
    groupByRepeatedValue, objectToArray, sortByProperty,
    dateToString, transformarFechaIntl
} from "../../../../shared/helpers"
// import { quitarAcentos, stringIncludes } from "../../../helpers/funcsToStrings";
import { quitarAcentos, stringIncludes } from "../../../../shared/helpers";
import { UseFetchGet } from "../../../../shared/helpers-HTTP";
import { CD, Descansos, Err, Err_page, HeaderRol, JoE, Jornadas, Rol, RolWithTurnos, ValRol, PeriodoApi } from "../interfaces"
import { deleteDuplicates, findDuplicates, findDuplicates2, groupByValue } from "./funcsToArrays"
import { rol_validateJornadas } from "./validations"

import { Cell } from "read-excel-file/types";

interface Creds_mod { cred: number, servicio?: number|string, seccion?:string, hoja: string }
interface Ecos_inMod  { eco: number|string, servicio: string|number, hoja: string }

interface Creds_activas {
    modulo:      number;
    credencial:  number;
    nombre:      string;
    puesto:      string;
    puesto_desc: string;
    status:      number;
    status_desc: string;
}

interface Creds_incapacidad {
    cred: number;
    dias: number;
    data: Datum[];
}

interface Datum {
    id_concepto:     number;
    cred:            number;
    dias:            number;
    usuario_captura: number;
    fecha_inicio:    Date;
    fecha_final:     Date;
    create_at:       Date;
}

interface Ruta_autorizada {
    id:             number;
    nombre:         string;
    swap_ruta:      string;
    origen_destino: string;
    modalidad:      string;
    modalidad_id:   number;
}

interface Ecos_estatus {
    eco:     number | string;
    mod:     number;
    estatus: number;
}


interface HeaderRolExcel {
    "periodo":    Cell,
    "ori_des":    Cell,
    "ruta":       Cell,
    "modalidad":  Cell,
}



const api_base = import.meta.env.VITE_SUGO_BackTS

export class ValidarRoles {
    // hojaName: string
    creds_Activas: Creds_activas[]
    creds_Incapacidad: Creds_incapacidad[]
    ecos_NoBaja: Ecos_estatus[]
    rutas_autorizadas: Ruta_autorizada[]
    rutas_swapXmod: RutaDBSWAP[]
    periodo_sig: PeriodoApi


    constructor(){
    }

    async doFetch(mod: number, periodo: PeriodoApi){
        // console.log('doing fetch');
        // console.log('modulo', modulo);
        const d = new Date()
        const fechaHoy = dateToString(d, true)
        try {
            const op_activosPromise = UseFetchGet(`${api_base}/api/swap/opeadores?modulo=${mod}&estado=1&puesto=Operadores`)
            const op_incapacidadPromise = UseFetchGet(`${api_base}/api/swap/incapacidad?fecha=2023/08/15&concepto=6`)
            const ecos_estatusPromise = UseFetchGet(`${api_base}/api/swap/ecos/estado?modulo=${mod}&estado=1,2`)
            const rutasPromise = UseFetchGet(`${api_base}/api/rutas`)
            const ccModuloPromise = UseFetchGet(`${api_base}/api/swap/rutas?modulo=${mod}`)
            // const periodoSigPromise = UseFetchGet(`${api_base}/api/periodos?fecha=${fechaHoy}`)
            

            const [ rutas, ccModulo, op_activos, op_incapacidad, ecos_estatus ] = await Promise.all([ rutasPromise, ccModuloPromise, op_activosPromise, op_incapacidadPromise, ecos_estatusPromise ]);

            this.creds_Activas = op_activos.data
            this.creds_Incapacidad = op_incapacidad
            this.ecos_NoBaja = ecos_estatus
            this.rutas_autorizadas = rutas
            this.rutas_swapXmod = ccModulo
            this.periodo_sig = periodo
            // console.log('FIN fetch');
            return true
        } catch (error) {
            console.error(error);
            return false
        }

    }


    hasBodyRolData(rol: RolWithTurnos[], cd: CD[], joe: JoE[] ):Err[] {
        //^  Validate bodyRol con data
        const bodyRolErrors: Err[] = []
        if (rol.length == 0 && cd.length == 0 && joe.length == 0 ) bodyRolErrors.push( {msg: '*** No hay informacion para validar ***'} )
        else if (rol.length == 0) bodyRolErrors.push( {msg: '** Rol sin servicios para validar **'} )
        return bodyRolErrors
    }

    jornada(rol: RolWithTurnos[]):Err[] {
        //^  Validate jornadas/turnos segun si es L-V, Sab o Dom
        const err_rol_jornadas: Err[] = rol.map( s => {
            const err: string[][] = []
            if(s.lun_vie)   {
                err.push( rol_validateJornadas({jornadas: s.lun_vie, cred: s.credenciales}, 'Lunes a viernes') )
            }
            if(s.sab)       {
                err.push( rol_validateJornadas({jornadas: s.sab, cred: s.credenciales}, 'Sabado')  )
            }
            if(s.dom)       {
                err.push( rol_validateJornadas({jornadas: s.dom, cred: s.credenciales}, 'Domingo') )
            }
            return {msg: `Error en servicio ${s.servicio}`, desc: err.flat()}
        } ).filter( i => i.desc.length > 0)
        return err_rol_jornadas
    }

    descansos( servicios: RolWithTurnos[]|CD[] ):Err[] {
        const err_calDesc: (Err|null)[] = servicios.map( (s) => {
            if(!s.descansos || Object.keys(s.descansos).length == 0) return {msg: `Error en servicio ${s.servicio}`, desc: ['No se encontro calendario con descansos']} 
            const calendarioArr = objectToArray(s.descansos)
            const diasDescanso = calendarioArr.map( dia => {
                if(dia[1] == 'D') return dia[0]
            } ).filter(Boolean)

            if( diasDescanso.length != 2) {
                return {msg: `Error en servicio ${s.servicio}`, desc: ['No tiene 2 descansos en la semana']}
            } 

            return null
        } ).filter(Boolean)

        return err_calDesc as Err[]
    }    

    existeTurno(cd: CD[], rol: RolWithTurnos[] ):Err[] {
        if(cd.length == 0) return [] 

        //? Ciclo a cada servicio de CD
        const err_calDesc: (Err|null)[] = cd.map( s => {

            const msg_err = `Error en servicio ${s.servicio}`
            if(!s.descansos || Object.keys(s.descansos).length == 0) return {msg: msg_err, desc: ['No se encontro calendario con servicios a cubrir']} 
            
            const err_desc: string[] = []
            
            const dias = Object.keys(s.descansos)
            Object.values(s.descansos).forEach( (servicioAcubrir, i) =>{ 
                const dia = dias[i]
                if(  servicioAcubrir && !Number(servicioAcubrir) && servicioAcubrir != 'D' ) return err_desc.push(`Se debe usar el numero de un servicio en el dia ${dia}, se coloco: ${JSON.stringify(servicioAcubrir)} `) 

                if( servicioAcubrir == 'D' ) return

                const servicioDelRol = rol.find( ({servicio}) => servicio==servicioAcubrir )
                if(!servicioDelRol) return err_desc.push(`No se encontro el servicio ${servicioAcubrir} para cubrir en el dia ${dia}`)
                
                const coincidenDia = Object.keys(servicioDelRol.descansos).includes(dia)
                if(!coincidenDia) return err_desc.push(`El servicio ${servicioDelRol.servicio} no descansa el dia ${dia}`)

                const cantidadCreds = Object.values(s.credenciales).filter(Number)
                if(dia == 'sabado'){ 
                    if(!servicioDelRol.sab) return err_desc.push(`No se tiene programacion para el ${dia}`)
                    // if( cantidadCreds.length != servicioDelRol.sab.length ) return err_desc.push(`La cantidad de operadores de cubre descanso [${cantidadCreds.length}] no coincide con la cantidad de turnos programados [${servicioDelRol.sab.length}] en el servicio ${servicioDelRol.servicio} `)
                }
                else if(dia == 'domingo'){ 
                    if(!servicioDelRol.dom) return err_desc.push(`No se tiene programacion para el ${dia}`)
                    // if( cantidadCreds.length != servicioDelRol.dom.length ) return err_desc.push(`La cantidad de operadores de cubre descanso [${cantidadCreds.length}] no coincide con la cantidad de turnos programados [${servicioDelRol.dom.length}] en el servicio ${servicioDelRol.servicio} `)
                }
                else { 
                    if(!servicioDelRol.lun_vie) return err_desc.push(`No se tiene programacion para el ${dia}`)
                    // if( cantidadCreds.length != servicioDelRol.lun_vie.length ) return err_desc.push(`La cantidad de operadores de cubre descanso [${cantidadCreds.length}] no coincide con la cantidad de turnos programados [${servicioDelRol.lun_vie.length}] en el servicio ${servicioDelRol.servicio} `)
                }
            } )


            if(err_desc.length != 0) return {msg: msg_err, desc: err_desc}
            return null
        } ).filter(Boolean)
        

        return err_calDesc as Err[]
    }
    
    nomenclaturaES( servicios: RolWithTurnos[]|CD[] ):Err[] {
        const err_calDesc: (Err|null)[] = servicios.map( (s) => {
            if( !s.sistema ) return {msg: `Error en servicio ${s.servicio}`, desc: ['No se encontro el dato de tipo de sistema (E/S o T/F)']}
            
            const datosValidos = ['E/S', 'T/F']
            if( !datosValidos.includes(s.sistema) ) {
                return {msg: `Error en servicio ${s.servicio}`, desc: [`El tipo de sistema debe ser ${datosValidos.join(' o ')} `]}
            } 

            return null
        } ).filter(Boolean)

        return err_calDesc as Err[]
    }  
    
    nomenclaturaCC( servicios: RolWithTurnos[], header: HeaderRol ):Err[] {

        const rutaAutorizada = this.rutas_autorizadas.find( rutaAut => rutaAut.nombre == header.ruta || rutaAut.swap_ruta == header.ruta )
        if(!rutaAutorizada){
            // console.warn(`No se encontro la ruta ${header.ruta}`);
            return []
        }
        const ccMod = this.rutas_swapXmod.filter( rutaSwap => rutaSwap.nombre == rutaAutorizada.swap_ruta )
        if(!ccMod) return []
        const ccDelaRutaRaw = ccMod.map( obj=> [ obj.cc_des, obj.cc_ori ] ).flat().filter(Boolean)
        const ccDelaRuta = [...new Set(ccDelaRutaRaw)]

        const getErr_desc = ( tipo: string, arr?: Jornadas[] ) => {
            if(!arr || arr.length == 0) return []
            const err_desc = arr.map( obj => {
                const { lug_ini_cc, lug_ter_cc, turno } = obj
                const errors: string[] = []

                const isOk1 = typeof lug_ini_cc == 'string' ? ccDelaRuta.includes(lug_ini_cc.trim()) : undefined;
                const isOk2 = typeof lug_ter_cc == 'string' ? ccDelaRuta.includes(lug_ter_cc.trim()) : undefined;
                // const isOk1 = typeof lugIniCC == 'string' ? ccDelaRuta.includes(lugIniCC.trim()) : undefined;
                // const isOk2 = typeof lugTerCC == 'string' ? ccDelaRuta.includes(lugTerCC.trim()) : undefined;

                if(!isOk1) errors.push(`El lugar de INICIO especificado [${lug_ini_cc}] del turno ${turno} en ${tipo}  no coincide con alguno de los esperados por la ruta ${header.ruta}. [ ${ccDelaRuta.join(', ')} ]`)
                if(!isOk2) errors.push(`El lugar de TERMINO especificado [${lug_ter_cc}] del turno ${turno} en ${tipo} no coincide con alguno de los esperados por la ruta ${header.ruta}. [ ${ccDelaRuta.join(', ')} ]`)

                if(errors.length >0) return errors
                return null
            } ).filter(Boolean).flat()
            return err_desc as string[]
        }

        const err_calDesc: (Err|null)[] = servicios.map( (s) => {

            const err_desc_LV  = getErr_desc('Lunes a Viernes', s.lun_vie)
            const err_desc_Sab = getErr_desc('Sabado', s.sab)
            const err_desc_Dom = getErr_desc('Domingo', s.dom)
            
            if( err_desc_LV. length>0 || err_desc_Sab.length>0 || err_desc_Dom.length>0 ){
                
                return {msg: `Error en servicio ${s.servicio}`, desc: [...err_desc_LV, ...err_desc_Sab, ...err_desc_Dom]}
            } 
            
            return null
        } ).filter(Boolean)

        return err_calDesc as Err[]
    }  
    
    credencialesRepetidas( data: ValRol[] ):Err|null {
        const credRepetidas: Creds_mod[] = []
        const credsVistas: Creds_mod[] = []

        // const credencialesXhoja = 
        data.map( ({hoja, data}) => {
            if(!data) return null  // // hoja
            const { rol, joe, cd } = data

            const credsRol = rol.map( s =>  {
                const creds = Object.values(s.credenciales)
                const credAppear = credsVistas.find( cred => creds.includes(cred.cred) )
                if( credAppear ) {
                    credRepetidas.push( credAppear )
                    credRepetidas.push( {cred: credAppear.cred, servicio: s.servicio, hoja} )
                    return null
                }
                return creds.map( (cred) => ({cred, servicio: s.servicio, hoja}))
            } ).filter(Boolean).flat()

            const credsCD = cd.map( s =>  {
                const creds = Object.values(s.credenciales)
                const credAppear = credsVistas.find( cred => creds.includes(cred.cred) )
                if( credAppear ) {
                    credRepetidas.push( credAppear )
                    credRepetidas.push( {cred: credAppear.cred, servicio: s.servicio, hoja} )
                    return null
                }
                return creds.map( (cred) => ({cred, servicio: s.servicio, hoja}))
            } ).filter(Boolean).flat()

            const credsJoE = joe.map( s => {
                const credAppear = credsVistas.find( cred => s.cred == cred.cred) 
                if( credAppear ) {
                    credRepetidas.push( credAppear )
                    credRepetidas.push( {cred: credAppear.cred, seccion: 'Jornada excepcional', hoja} )
                    return null
                }
                return {cred: s.cred, seccion: `Jornada excepcional`, hoja}
            } ).filter(Boolean)

            credsVistas.push( ...(credsRol as Creds_mod[]), ...(credsCD as Creds_mod[]), ...(credsJoE as Creds_mod[]))
        })
        
        if(credRepetidas.length === 0) return null

        const credRepetidasOrdered = sortByProperty( credRepetidas, 'cred' )
        const credsSinDuplicados = deleteDuplicates(credRepetidasOrdered, ['hoja', 'cred'] )
        // console.log('credsNoduplicadas', credsSinDuplicados);
        const credsDuplicadas = groupByRepeatedValue(credsSinDuplicados, 'cred')
        const mensajesError = credsDuplicadas.map( (obj) => {
            (obj as Creds_mod[])
            const cred = obj[0].cred
            const msg = obj.map( o => {
                if(o.servicio) return `en el servicio ${o.servicio} de la hoja ${o.hoja}`
                else if(o.seccion) return `en la seccion de ${o.seccion} de la hoja ${o.hoja}`
            } )

            const internacionalizacion = new (Intl as any).ListFormat('es');
            const mensaje = `La credencial ${cred} ${ internacionalizacion.format(msg) }`

            return mensaje
        } )

        return { msg: 'Operadores duplicados', desc: mensajesError }
    }

    getCredsAndEcos( data: ValRol[] ) {
        const ecos: Ecos_inMod[] = []

        const credsDelModulo = data.map( ({hoja, data}) => {
            if(!data) return null  // // hoja
            const { rol, joe, cd } = data

            const credsRol = rol.map( s =>  {
                const creds = Object.values(s.credenciales)  
                if( s.eco ) ecos.push( { eco: s.eco, servicio: s.servicio, hoja } )              
                return creds.map( (cred) => ({cred, servicio: s.servicio, hoja}))
            } ).flat()

            const credsCD = cd.map( s =>  {
                const creds = Object.values(s.credenciales)
                if( s.eco ) ecos.push( { eco: s.eco, servicio: s.servicio, hoja } )
                return creds.map( (cred) => ({cred, servicio: s.servicio, hoja}))
            } ).flat()

            // De esta seccion no se hace push de los ecos porque no hay
            const credsJoE: Creds_mod[] = joe.map( s => ({cred: s.cred, seccion: `Jornada excepcional`, hoja}) )

            return [ ...(credsRol as Creds_mod[]), ...(credsCD as Creds_mod[]), ...credsJoE]
        }).filter(Boolean).flat(5)

        return { creds: (credsDelModulo as Creds_mod[]), ecos }
    }

    credsIncapacidad(data: ValRol[] ):Err|null {
        const { creds } = this.getCredsAndEcos( data )
        const credsConIncap = creds.filter( c => this.creds_Incapacidad.map( c => c.cred ).includes(c.cred) )

        if(credsConIncap.length === 0) return null
        const msg_err = credsConIncap.map( c => {
            const { cred, hoja, seccion, servicio } = c
            if(seccion) return `La credencial ${cred} en la seccion de ${seccion} en la hoja ${hoja}`
            if(servicio) return `La credencial ${cred} en el servicio ${servicio} en la hoja ${hoja}`
        } ).filter(Boolean)

        return { msg: 'Operadores con incapacidad', desc: (msg_err as string[]) }
    }

    credsActivas(data: ValRol[] ):Err|null {
        const { creds } = this.getCredsAndEcos( data )
        const credsNoActivas = creds.filter( c => {
            // this.creds_Activas es por ?modulo=${modulo}&estado=1&puesto=Operadores. Son los operadores activos por modulo
            const credsActivas = this.creds_Activas.map( c => c.credencial )
            return !credsActivas.includes(c.cred)
        } )

        if(credsNoActivas.length === 0) return null
        const msg_err = credsNoActivas.map( c => {
            const { cred, hoja, seccion, servicio } = c
            if(seccion) return `La credencial ${cred} en la sección de ${seccion} en la hoja ${hoja}`
            if(servicio) return `La credencial ${cred} en el servicio ${servicio} en la hoja ${hoja}`
        } ).filter(Boolean)

        return { msg: 'Operadores no adscritos al modulo', desc: (msg_err as string[]) }
    }

    ecosRepetidos(data: ValRol[]):Err|null {
        const { ecos } = this.getCredsAndEcos( data )

        const ecos_Duplicados = findDuplicates2( ecos, 'eco' )
        const ecos_Sorted = sortByProperty(ecos_Duplicados, 'eco')
        const ecos_Grouped = groupByRepeatedValue(ecos_Sorted, 'eco')

        if(ecos_Grouped.length>0) {
            const mensajesError = ecos_Grouped.map( (obj) => {
                (obj as Ecos_inMod[])
                const eco = obj[0].eco
                const msg = obj.map( o => `${o.servicio} de la hoja ${o.hoja}` )
    
                const internacionalizacion = new (Intl as any).ListFormat('es');
                const mensaje = `Economico ${eco} en los servicios ${ internacionalizacion.format(msg) }`
    
                return mensaje
            } )
    
            return { msg: 'Economicos repetidos', desc: mensajesError }
        }

        return null
    }

    ecosBaja(data: ValRol[]):Err|null {
        const { ecos } = this.getCredsAndEcos( data )
        const ecosActivos = this.ecos_NoBaja.map( obj => obj.eco )
        const ecos_rolEnBaja = ecos.filter( obj => !ecosActivos.includes(Number(obj.eco)) )
        // console.log('ecos Mod', ecos);
        // console.log('ecosbaja', ecos_rolEnBaja);
        if(ecos_rolEnBaja.length>0) {
            const mensajes = ecos_rolEnBaja.map( obj => `El economico ${obj.eco} del servicio ${obj.servicio} en la hoja ${obj.hoja}` )

            return {msg: 'Economicos que estan en baja', desc: mensajes}
        }    

        return null
    }

    encabezadoRol(header: HeaderRolExcel): [ { errorsCriticos: Err[], errors: Err[] }|null, { periodo_id: number, ruta_id: number, modalidad_id: number, periodo_date_ini:Date|string, periodo_date_fin:Date|string }|undefined ] {
        const errors: Err[] = []
        const errorsCriticos: Err[] = []
        const { modalidad, ori_des, periodo, ruta } = header
        const rutasAutorizadas = this.rutas_autorizadas 
        
        //^ Validaciones: Ruta
        //! Error critico: No se encontro la ruta en el rol
        if( !ruta || !(typeof ruta == 'string' || typeof ruta == 'number') ) {
            errorsCriticos.push({msg: 'Hace falta RUTA en el encabezado'})
            return [{ errorsCriticos, errors }, undefined]
        }

        //* Continua: busca la ruta en las rutas autorizadas
        const rutaAut = rutasAutorizadas.find( r => r.nombre == ruta || r.swap_ruta == ruta );   
        //! Error ¿critico???: No se encontro la ruta en la lista autorizada (Si es critico ya que no va a poder verificar CC)
        // if( !rutaAut ) errorsCriticos.push({msg: `La ruta ${ruta} no esta en la lista de rutas autorizadas`})
        if( !rutaAut ){
            errorsCriticos.push({msg: `La ruta ${ruta} no esta en la lista de rutas autorizadas`})
            return [{ errorsCriticos, errors }, undefined]
        } 
        // console.log('rutaRol', ruta, 'rutaAut', rutaAut);
        const { id:ruta_id, modalidad:modAut, modalidad_id, origen_destino:oriDesAut } = rutaAut



        //^ Validaciones: Modalidad
        //! Error: No se encontro la modalidad en el rol
        if(!modalidad || typeof modalidad != 'string') {
            errorsCriticos.push({msg: 'Hace falta MODALIDAD en el encabezado'})
        } else{ 
            //! Error: la modalidad no coincide con la de la ruta autorizada
            if( (modalidad as string).toUpperCase() != modAut.toUpperCase() ) errorsCriticos.push({msg: `La modalidad ${modalidad} no coincide con la de la ruta autorizada que es ${modAut}`})
        }
        


        //^ Validaciones: Origen-Desino
        //! Error critico: Ori-Des
        if(!ori_des || typeof ori_des != 'string') {
            errors.push({msg: 'Hace falta ORIGEN-DESTINO en el encabezado'})
        } else {
            const oriAut = quitarAcentos(oriDesAut).split('-');
            const ori_d  = quitarAcentos(ori_des).split('-');
            const coincideOrigen  = ( typeof ori_d[0] == 'string' && oriAut[0] == ori_d[0].trim() );
            const coincideDestino = ( typeof ori_d[1] == 'string' && oriAut[1] == ori_d[1].trim() );
            if( !coincideOrigen || !coincideDestino ) {
                const desc: string[] = []
                if(!coincideOrigen)  desc.push( `Se coloco de origen ${ori_d[0]} y debe ser ${oriAut[0].toUpperCase()}` )
                if(!coincideDestino) desc.push( `Se coloco de destino ${ori_d[1]} y debe ser ${oriAut[1].toUpperCase()}` )
                
                errors.push({msg: `El ORIGEN-DESTINO no coincide con la de la ruta autorizada`, desc})                
            }

        }
        //! Error: la modalidad no coincide con la de la ruta autorizada
        // if( modalidad != modAut ) errors.push({msg: `La modalidad ${modalidad} no coincide con la de la ruta autorizada`})
        


        //^ Validaciones: Periodo
        const { id: periodo_id, fecha_inicio, fecha_fin } = this.periodo_sig
        //! error normal: Periodo no encontrado
        if(!periodo || typeof periodo != 'string') {
            errors.push({msg: 'Hace falta PERIODO en el encabezado'})
        } else {
            const desc: string[] = []
            // console.log('periodo del Rol',periodo);
            // console.log('periodo Api', this.periodo_sig);
            const [f1, f2] = [fecha_inicio.split('-').join('/'), fecha_fin.split('-').join('/')] 
            const [fe1, fe2] = [ transformarFechaIntl( f1 ), transformarFechaIntl( f2 ) ]
            // console.log(fe1, fe2);
            const [isOk1, isOk2] =  [ stringIncludes(periodo, fe1), stringIncludes(periodo, fe2) ]
            // console.log(isOk1, isOk2);
            //! error normal: Periodo no corresponde
            if( !isOk1 || !isOk2 ) {
                if(!isOk1) desc.push(`El periodo debe iniciar el: ${fe1.toUpperCase()}`)
                if(!isOk2) desc.push(`El periodo debe terminar el: ${fe2.toUpperCase()}`)
                errors.push({ msg: `El periodo que se introdujo es incorrecto [${periodo}]`, desc })
            }
            // ToDo: Considerar aceptar periodo actual para las actualizaciones
        }

        if( errorsCriticos.length>0 || errors.length>0 ) return [{ errorsCriticos, errors }, undefined]

        return [null, { ruta_id, modalidad_id, periodo_id, periodo_date_ini: fecha_inicio, periodo_date_fin: fecha_fin }]
    }


}

