const RegistroDiario = require('../models/RegistroDiario');
const User = require('../models/User');
const Company = require('../models/Company');
const UserCompany = require('../models/UserCompany');
const { createRegistroDiario, getAllRegistrosDiarios, getAllRegistrosDiariosToday, getRegistrosByCompanyAndDate } = require('../services/registroDiario.services');
const { getById } = require('../services/user.services');
const { getMenuById } = require('../services/menu.services');
const horarioService = require('../services/horario.services');

const createRegistro = async (req, res) => {
    //? se puede recibir empresa
    const idUserSoliciante = req.uid;
    const { idUser, idMenu, idCompany } = req.body;
    try {
        //* 1 si no existe usuario error
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'No existe usuario'
            });
        }
        //* 2 buscar menu por id de menu
        const menu = await getMenuById(idMenu);
        if (!menu) {
            return res.status(400).json({
                ok: false,
                message: 'No existe menu'
            });
        }
        //# fecha hoy formato dd/mm/yyyy
        const fechaHoy = new Date().toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        //# hora actual formato hh:mm:ss
        const horaActual = new Date().toLocaleTimeString('es-AR', { 
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit' 
        })
        // separar hora 2 digitos y minutos 2 digitos
        // console.log(`fecha hoy ${fechaHoy}, hora actual ${horaActual}`);	
        //* 3 traer comida actual con la hora actual
        const comidaActual = await horarioService.getHoraComidaActual();
        if (!comidaActual || comidaActual == null) {
            return res.status(400).json({
                ok: false,
                message: 'El horario no esta disponible'
            });
        }
        const typeMenu = menu[comidaActual.tipo];
        //* 4 armar objeto 
        const args = {
            user: idUser,
            company: idCompany,
            date: fechaHoy,
            time: horaActual,
            type: idMenu,
            [comidaActual.tipo]: typeMenu._id,
            createdBy: idUserSoliciante
        }  
        //* 4 si existe usuario, se crea registro
        const registro = await createRegistroDiario(args);
        if (!registro) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo crear registro'
            });
        }
        // buscar registro por id y devolver con pupulate
        const registroPopulate = await RegistroDiario.findById(registro._id)
        .populate('type')
        .populate('breakfast')
        .populate('lunch')
        .populate('afternoonSnack')
        .populate('dinner')
        .populate('user');
        
        return res.status(200).json({
            ok: true,
            registro: registroPopulate
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }
}
const getRegistro = async (req, res) => {}
const getRegistros = async (req, res) => {
    // si viene today en req query, buscar registros de hoy, sino buscar todos los registros
    const all = req.query.all;
    try {
        if (all) {
            // console.log(all)
            const allRegistrosDiarios = await getAllRegistrosDiarios()
            //? reverse para que los ultimos registros aparezcan primero

            if (!allRegistrosDiarios) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existen registros'
                });
            }
            return res.status(200).json({
                ok: true,
                registros: allRegistrosDiarios.reverse()
            });

        } else {
            const dateToday = new Date().toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
            // console.log('dia hoy',dateToday)
            const allRegistrosDiarios = await getAllRegistrosDiariosToday(dateToday)
            if (!allRegistrosDiarios) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existen registros'
                });
            }
            return res.status(200).json({
                ok: true,
                registros: allRegistrosDiarios
            });
        }
     

    } catch (error) {
        console.log(error);
        return res.json.status(500).json({
            message: `error: ${error}`,
        })
    }

}

const updateRegistro = async (req, res) => {
    //@ siempre seria un put, pero si no existe se crea el registro y si existe se actualiza
    //? BUSCAR CONINCIDENCIAS CON EL USER_ID Y LA FECHA
    //? cuando se escanee qr, se encontrara dni -> id_user, 
    //? desde el front manda o desayuno, almuerzo, merienda o cena dependiendo la hora
    const { idUser, desayuno = false, almuerzo = false, merienda = false, cena = false } = req.body;   
    try {
        //* 1 verificamos si existe usuario
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(404).json({
                message: 'Usuario no existe.'
            });
        }
        //* 2 buscamos en registro diario el usuario por id y fecha
        const fecha = new Date();
        const fechaHoy = `${fecha.getDate()}/${(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
        // console.log('fecha de hoy: ',fechaHoy);
        const registro = await RegistroDiario.findOne({
            user: idUser,
            fecha: fechaHoy
        });
        if (!registro) {
            //* 3 si no existe registro, se crea
            const registro = new RegistroDiario({
                user: idUser,
                fecha: fechaHoy,
                desayuno: desayuno,
                almuerzo: almuerzo,
                merienda: merienda,
                cena: cena
            });
            await registro.save();
            return res.status(200).json({
                registro: registro,
                user: user,
                message: 'Registro creado correctamente.'
            });
        }
        //* 4 si existe registro, se actualiza
        const update = await RegistroDiario.findOneAndUpdate({
            user: idUser,
            fecha: fechaHoy
        }, {
            desayuno: desayuno,
            almuerzo: almuerzo,
            merienda: merienda,
            cena: cena
        }, { new: true });

        return res.status(200).json({
            registro: update,
            user: user,
            message: 'Registro actualizado correctamente.'
        })

    } catch (error) {
        console.log(error);
        return res.json.status(500).json({
            message: `error: ${error}`,
        })   
    }

}
const deleteRegistro = async (req, res) => {}

const getRegistroByCompany = async (req, res) => {

    const idCompany = req.params.idCompany; 
    try {
        // buscar empresa por id
        const company = await Company.findById(idCompany);
        if (!company) {
            return res.status(404).json({
                message: 'Empresa no existe.'
            });
        }
        // buscar registros diarios por id de empresa
        const registros = await getRegistrosByCompanyAndDate(company._id);
        if (!registros) {
            return res.status(400).json({
                ok: false,
                message: 'No existen registros'
            });
        }
        return res.status(200).json({
            ok: true,
            registros: registros
        });

    } catch (error) {
        console.log(error);
        return res.json.status(500).json({
            message: `error: ${error}`,
        })
    }
}
const createRegistroManual = async (req, res) => {
    const idUserSoliciante = req.uid;
    const { idUser, horaMenu, tipoMenu, idCompany, fecha } = req.body;
    try {
        //* 1 si no existe usuario error
        const user = await User.findById(idUser);
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'No existe usuario'
            });
        }
        //* 2 buscar menu por id de menu
        const menu = await getMenuById(tipoMenu);
        if (!menu) {
            return res.status(400).json({
                ok: false,
                message: 'No existe menu'
            });
        }
        //* 3 buscar registro diario por id de usuario y fecha
        const fechaHoy = new Date().toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        const horaActual = new Date().toLocaleTimeString('es-AR', { 
            timeZone: 'America/Argentina/Buenos_Aires',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit' 
        })
        console.log(`fecha hoy ${fechaHoy}, hora actual ${horaActual}`);	
        const typeMenu = menu[horaMenu];
        console.log('typeMenu', typeMenu);
        //* 4 armar objeto 
        const args = {
            user: idUser,
            company: idCompany,
            date: fecha,
            time: horaActual,
            type: tipoMenu,
            [horaMenu]: typeMenu._id,
            createdBy: idUserSoliciante
        }  
        console.log('args', args);

        //* 4 si existe usuario, se crea registro
        const registro = await createRegistroDiario(args);
        if (!registro) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo crear registro'
            });
        }
        const registroPopulate = await RegistroDiario.findById(registro._id)
        .populate('type')
        .populate('breakfast')
        .populate('lunch')
        .populate('afternoonSnack')
        .populate('dinner')
        .populate('user');
        
        return res.status(200).json({
            ok: true,
            registro: registroPopulate
        });

    } catch (error) {
        console.log(error);
        return res.json.status(500).json({
            message: `error: ${error}`,
        })
    }
}

module.exports = { createRegistroManual, createRegistro, getRegistro, getRegistros, updateRegistro, deleteRegistro, getRegistroByCompany } 
