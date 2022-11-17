const { getAllRegistrosDiarios } = require('../services/registroDiario.services');
const CompanyService = require('../services/company.services');
const RegistroDiarioService = require('../services/registroDiario.services');
const UserService = require('../services/user.services');
const VisadService = require('../services/visado.services');

const getTotalesAnio = async (req, res) => {
    const idUser = req.uid;
    try {
        const user = await UserService.getById(idUser);
        if (user.user_type.name != 'admin') {
            const document = user.document;
            const userSoliciante = await UserService.getUserWithCompany(document);
            companyUser = (userSoliciante[0].empresa.cuit).toString();
            const allRegistros = await RegistroDiarioService.getAllRegistroDiarioNoAdmin(companyUser);
            const meses = [
                { mes: 'Enero', nroMes: 01, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Febrero', nroMes: 02, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Marzo', nroMes: 03, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Abril', nroMes: 04, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Mayo', nroMes: 05, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Junio', nroMes: 06, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Julio', nroMes: 07, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Agosto', nroMes: 08, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Septiembre', nroMes: 09, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Octubre', nroMes: 10, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Noviembre', nroMes: 11, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Diciembre', nroMes: 12, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
            ];
            console.log('aa',allRegistros);
            let visados = 0; let noVisados = 0; let total = 0;
            //* 3- buscar en cada registro el mes y sumarle los valores
            allRegistros.forEach((registro) => {
                const mesRegistro = registro.date.split('/')[1];
                meses.forEach((mes) => {
                    if (mesRegistro == mes.nroMes) {
                        if (Object.keys(registro.breakfast).length > 0) {
                            mes.breakfast += 1;
                        }
                        if (Object.keys(registro.lunch).length > 0) {
                            mes.lunch += 1;
                        }
                        if (Object.keys(registro.afternoonSnack).length > 0) {
                            mes.afternoonSnack += 1;
                        }
                        if (Object.keys(registro.dinner).length > 0) {
                            mes.dinner += 1;
                        }
                        
                        mes.total = total += 1;
                    }
                });
            });
            //* 4- devolver array de meses con sus totales
            return res.status(200).json({
                ok: true,
                data: meses,
                prueba: allRegistros
            })
        }
        else {
            //* 1- obtener todos los registros
            const allRegistros = await getAllRegistrosDiarios();
            
            //* 2- agregar a array de meses respectivos
            const meses = [
                { mes: 'Enero', nroMes: 01, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Febrero', nroMes: 02, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Marzo', nroMes: 03, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Abril', nroMes: 04, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Mayo', nroMes: 05, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Junio', nroMes: 06, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Julio', nroMes: 07, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Agosto', nroMes: 08, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Septiembre', nroMes: 09, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Octubre', nroMes: 10, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Noviembre', nroMes: 11, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
                { mes: 'Diciembre', nroMes: 12, breakfast: 0, lunch: 0, afternoonSnack: 0, dinner: 0 },
            ];
            let visados = 0; let noVisados = 0; let total = 0;
            //* 3- buscar en cada registro el mes y sumarle los valores
            
            allRegistros.forEach((registro) => {
                const mesRegistro = registro.date.split('/')[1];
                meses.forEach((mes) => {
                    if (mesRegistro == mes.nroMes) {
                        if (Object.keys(registro.breakfast).length > 0) {
                            mes.breakfast += 1;
                        }
                        if (Object.keys(registro.lunch).length > 0) {
                            mes.lunch += 1;
                        }
                        if (Object.keys(registro.afternoonSnack).length > 0) {
                            mes.afternoonSnack += 1;
                        }
                        if (Object.keys(registro.dinner).length > 0) {
                            mes.dinner += 1;
                        }    
                        mes.fechas = `${registro.date}|` + mes.fechas;
                    }
                });
            });
            
            //* 4 
            for (let index = 0; index < meses.length; index++) {
                const mes = meses[index];
                if (mes.fechas) {
                    const fechas = mes.fechas.split('|');
                    fechas.pop();
                    const fechasSinRepetir = [...new Set(fechas)];
                    mes.fechas = fechasSinRepetir;
                }
            }
            //* 4- devolver array de meses con sus totales
            return res.status(200).json({
                ok: true,
                data: meses,
            })
            
            let cantidadVisar = 0; let cantidadVisada = 0;
            //* buscar registros por mes y separar por empresa
            for (let index = 0; index < meses.length; index++) {
                const mes = meses[index];
                if (mes.fechas) {
                    const fechas = mes.fechas;
                    const empresas = [];
                    for (let index = 0; index < fechas.length; index++) {
                        const regs = await RegistroDiarioService.getRegistrosByDate(fechas[index]);

                        // no repetir empresas usuario.empresa
                        const empresasSinRepetir = [...new Set(regs.map(reg => reg.usuario.empresa))];
                        // recorrer empresas sin repetir y preguntar si se viso o no
                        for (let index = 0; index < empresasSinRepetir.length; index++) {
                            cantidadVisar += 1;
                            const empresa = empresasSinRepetir[index].uid;
                            const visado = await VisadService.getVisadoByEmpresaAndDate(empresa, fechas[index]); 
                            if (visado) {
                                // console.log('visado',empresa ,visado);
                                cantidadVisada += 1;
                            }
                        }
                        // console.log(fechas[index] ,empresasSinRepetir);                        
                    }
                }
            }
            //* 4- devolver array de meses con sus totales
            return res.status(200).json({
                ok: true,
                data: meses,
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}
const getTotalesMes = async (req, res) => {
    const idUser = req.uid;
    const { mes } = req.params;
    try {
        const user = await UserService.getById(idUser);
        if (user.user_type.name != 'admin') { 
            const document = user.document;
            const userSoliciante = await UserService.getUserWithCompany(document);
            companyUser = (userSoliciante[0].empresa.cuit).toString();
            //* 1- obtener todos los registros
            const allRegistros = await RegistroDiarioService.getAllRegistroDiarioNoAdmin(companyUser);
            //* 2 - numero de mes
            const meses = [
                { mes: 'enero', nroMes: 01 },
                { mes: 'febrero', nroMes: 02 },
                { mes: 'marzo', nroMes: 03 },
                { mes: 'abril', nroMes: 04 },
                { mes: 'mayo', nroMes: 05 },
                { mes: 'junio', nroMes: 06 },
                { mes: 'julio', nroMes: 07 },
                { mes: 'agosto', nroMes: 08 },
                { mes: 'septiembre', nroMes: 09 },
                { mes: 'octubre', nroMes: 10 },
                { mes: 'noviembre', nroMes: 11 },
                { mes: 'diciembre', nroMes: 12 },
            ];
            const mesNro = meses.find((m) => m.mes === mes).nroMes;
            //* 3- filtrar registros por mes
            const registrosMes = allRegistros.filter((registro) => registro.date.split('/')[1] == mesNro);
            //* 4- agregar a array de dias respectivos sin repetir dias (solo los dias que hay registros)
            const dias = []; 
            registrosMes.forEach((registro) => {
                breakfast = Object.keys(registro.breakfast).length > 0 ? 1 : 0;
                lunch = Object.keys(registro.lunch).length > 0 ? 1 : 0;
                afternoonSnack = Object.keys(registro.afternoonSnack).length > 0 ? 1 : 0;
                dinner = Object.keys(registro.dinner).length > 0 ? 1 : 0;
                if (!dias.find((item) => item.date == registro.date)) {
                    dias.push({
                        date: registro.date,
                        breakfast,
                        lunch,
                        afternoonSnack,
                        dinner
                    });
                } else {
                    const index = dias.findIndex((dia) => dia.date === registro.date);
                    dias[index].breakfast += breakfast;
                    dias[index].lunch += lunch;
                    dias[index].afternoonSnack += afternoonSnack;
                    dias[index].dinner += dinner; 
                }
            });
            return res.status(200).json({
                ok: true,
                data: dias,
            })
            
        } else {
            //* 1- obtener todos los registros
            const allRegistros = await getAllRegistrosDiarios();
            //* 2 - numero de mes
            const meses = [
                { mes: 'enero', nroMes: 01 },
                { mes: 'febrero', nroMes: 02 },
                { mes: 'marzo', nroMes: 03 },
                { mes: 'abril', nroMes: 04 },
                { mes: 'mayo', nroMes: 05 },
                { mes: 'junio', nroMes: 06 },
                { mes: 'julio', nroMes: 07 },
                { mes: 'agosto', nroMes: 08 },
                { mes: 'septiembre', nroMes: 09 },
                { mes: 'octubre', nroMes: 10 },
                { mes: 'noviembre', nroMes: 11 },
                { mes: 'diciembre', nroMes: 12 },
            ];
            const mesNro = meses.find((m) => m.mes === mes).nroMes;
            //* 3- filtrar registros por mes
            const registrosMes = allRegistros.filter((registro) => registro.date.split('/')[1] == mesNro);
            //* 4- agregar a array de dias respectivos sin repetir dias (solo los dias que hay registros)
            const dias = []; 
            registrosMes.forEach((registro) => {
                breakfast = Object.keys(registro.breakfast).length > 0 ? 1 : 0;
                lunch = Object.keys(registro.lunch).length > 0 ? 1 : 0;
                afternoonSnack = Object.keys(registro.afternoonSnack).length > 0 ? 1 : 0;
                dinner = Object.keys(registro.dinner).length > 0 ? 1 : 0;
                if (!dias.find((item) => item.date == registro.date)) {
                    dias.push({
                        date: registro.date,
                        breakfast,
                        lunch,
                        afternoonSnack,
                        dinner
                    });
                } else {
                    const index = dias.findIndex((dia) => dia.date === registro.date);
                    dias[index].breakfast += breakfast;
                    dias[index].lunch += lunch;
                    dias[index].afternoonSnack += afternoonSnack;
                    dias[index].dinner += dinner; 
                }
            });
            return res.status(200).json({
                ok: true,
                data: dias,
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

const getTotalesDia = async (req, res) => {
    const idUser = req.uid;
    const { dia, mes, empresa } = req.params;
    try {
        const user = await UserService.getById(idUser);
        if (user.user_type.name != 'admin') { 
            const document = user.document;
            const userSoliciante = await UserService.getUserWithCompany(document);
            companyUser = (userSoliciante[0].empresa.cuit).toString();
            // empresa quitar - 
            const getEmpresa = await CompanyService.getByName(empresa);
            const empresaId = getEmpresa._id;
            const getRegistrosByEmpresa = await RegistroDiarioService.getRegistrosByCompanyAndDateNoAdmin(empresaId, companyUser)
            // recorrer getRegistrosByEmpresa y filtrar por dia y mes
            const meses = [
                { mes: 'enero', nroMes: 01 },
                { mes: 'febrero', nroMes: 02 },
                { mes: 'marzo', nroMes: 03 },
                { mes: 'abril', nroMes: 04 },
                { mes: 'mayo', nroMes: 05 },
                { mes: 'junio', nroMes: 06 },
                { mes: 'julio', nroMes: 07 },
                { mes: 'agosto', nroMes: 08 },
                { mes: 'septiembre', nroMes: 09 },
                { mes: 'octubre', nroMes: 10 },
                { mes: 'noviembre', nroMes: 11 },
                { mes: 'diciembre', nroMes: 12 },
            ];
            const mesNro = meses.find((m) => m.mes === mes).nroMes;
            const registrosDia = getRegistrosByEmpresa.filter((registro) => registro.date.split('/')[1] == mesNro && registro.date.split('/')[0] == dia);
            return res.status(200).json({
                ok: true,
                data: registrosDia,
            })
        }
        else {
            // empresa quitar - 
            const getEmpresa = await CompanyService.getByName(empresa);
            const empresaId = getEmpresa._id;
            const getRegistrosByEmpresa = await RegistroDiarioService.getRegistrosByCompanyAndDate(empresaId);
            // recorrer getRegistrosByEmpresa y filtrar por dia y mes
            const meses = [
                { mes: 'enero', nroMes: 01 },
                { mes: 'febrero', nroMes: 02 },
                { mes: 'marzo', nroMes: 03 },
                { mes: 'abril', nroMes: 04 },
                { mes: 'mayo', nroMes: 05 },
                { mes: 'junio', nroMes: 06 },
                { mes: 'julio', nroMes: 07 },
                { mes: 'agosto', nroMes: 08 },
                { mes: 'septiembre', nroMes: 09 },
                { mes: 'octubre', nroMes: 10 },
                { mes: 'noviembre', nroMes: 11 },
                { mes: 'diciembre', nroMes: 12 },
            ];
            const mesNro = meses.find((m) => m.mes === mes).nroMes;
            const registrosDia = getRegistrosByEmpresa.filter((registro) => registro.date.split('/')[1] == mesNro && registro.date.split('/')[0] == dia);
            return res.status(200).json({
                ok: true,
                data: registrosDia,
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

const getTotalesEmpresa = async (req, res) => {
    const idUser = req.uid;
    const { mes, dia } = req.params;
    try {
        //* ============= *
        let year = new Date().getFullYear();
        const meses = [
            { mes: 'enero', nroMes: '01' },
            { mes: 'febrero', nroMes: '02' },
            { mes: 'marzo', nroMes: '03' },
            { mes: 'abril', nroMes: '04' },
            { mes: 'mayo', nroMes: '05' },
            { mes: 'junio', nroMes: '06' },
            { mes: 'julio', nroMes: '07' },
            { mes: 'agosto', nroMes: '08' },
            { mes: 'septiembre', nroMes: '09' },
            { mes: 'octubre', nroMes: '10' },
            { mes: 'noviembre', nroMes: '11' },
            { mes: 'diciembre', nroMes: '12' },
        ]
        const mesNro = meses.find((m) => m.mes === mes).nroMes;
        const fechaCompleta = `${dia}/${mesNro}/${year}`;
        //* ============= *
        const user = await UserService.getById(idUser);
        if (user.user_type.name != 'admin') { 
            console.log('no es admin');
            const document = user.document;
            const userSoliciante = await UserService.getUserWithCompany(document);
            companyUser = (userSoliciante[0].empresa.cuit).toString();
            const getRegistrosByDate = await RegistroDiarioService.getRegistrosByDateNoAdmin(fechaCompleta, companyUser)
            const prueba = getRegistrosByDate;
            
            const empresas = [];
            
            for (let i = 0; i < getRegistrosByDate.length; i++) {
                const empresaId = getRegistrosByDate[i].usuario.empresa.uid;
                const empresa = empresas.find((empresa) => (empresa.uid).toString() == (empresaId).toString());
                if (!empresa) {
                    const visado = await VisadService.getVisadoByEmpresaAndFechaRegistro(empresaId, fechaCompleta);
                    empresas.push({
                        ...getRegistrosByDate[i].usuario.empresa,
                        total: 1,
                        visado: visado,
                        registroId: getRegistrosByDate[i]._id,
                    })
                } else {
                    const index = empresas.findIndex((empresa) => (empresa.uid).toString() == (empresaId).toString());
                    empresas[index].total += 1;
                }
            }
            return res.status(200).json({
                ok: true,
                data: empresas,
            })
        }
        else {
            console.log('es admin');
            const getRegistrosByDate = await RegistroDiarioService.getRegistrosByDate(fechaCompleta);
            // realizar un reducer de usuario.empresa
            const empresas = [];
            for (let i = 0; i < getRegistrosByDate.length; i++) {
                const empresaId = getRegistrosByDate[i].usuario.empresa.uid;
                const cuitEmpresa = getRegistrosByDate[i].usuario.empresa.cuit;
                console.log(empresaId);
                const empresa = empresas.find((empresa) => {
                    if ((empresa.uid).toString() == (empresaId).toString()) {
                        console.log('encontrado', empresa);
                        return empresa;
                    }
                });
                // console.log(empresa);
                if (!empresa || empresa == undefined) {
                    const visado = await VisadService.getVisadoByEmpresaAndFechaRegistro(empresaId, fechaCompleta);
                    empresas.push({
                        ...getRegistrosByDate[i].usuario.empresa,
                        total: 1,
                        visado: visado,
                        registroId: getRegistrosByDate[i]._id,
                    })
                } else {
                    const index = empresas.findIndex((empresa) => (empresa.uid).toString() == (empresaId).toString());
                    empresas[index].total += 1;
                }
            }

            return res.status(200).json({
                ok: true,
                data: empresas,
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

module.exports = { getTotalesAnio, getTotalesMes, getTotalesDia, getTotalesEmpresa }