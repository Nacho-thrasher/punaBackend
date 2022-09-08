//? pagina unicamente con inicio de sesion, sin registro
const getMenuFrontEnd = (role = 'user') =>{ //? user comun
    //? si, es rol user, solo muestro una landign o inicio
    const menu = [
        {
          titulo: 'Inicio',
          icono: 'nav-icon far fa-solid fa-house',
          url: '/dashboard',
          child: false,
          subMenu: null
        },
        
    ];
    if (role == 'supervisor') {
        menu.push(
            {
              titulo: 'Totales',
              icono: 'nav-icon fas fa-solid fa-magnifying-glass-chart',
              url: 'totales',
              child: false, 
              subMenu: null
              // subMenu: [
              //   {
              //     titulo: 'Promedios diarios',
              //     url: 'promedios-diarios'
              //   },
              //   {
              //     titulo: 'Promedios mensuales',
              //     url: 'promedios-mensuales'
              //   }
              // ]
            },
            {
              titulo: 'Servicios',
              icono: 'nav-icon fas fa-solid fa-gear',
              url: null,
              child: true,
              subMenu: [
                  {
                    titulo: 'Menu Diario',
                    url: 'menu-diario'
                  },
                  // {
                  //   titulo: 'Comensales',
                  //   url: 'comensales'
                  // }
              ]
            }
        )    
    }
    if (role == 'admin') {
      menu.push(
          {
            titulo: 'Registros',
            icono: 'nav-icon fas fa-solid fa-file',
            url: null,
            child: true,
            subMenu: [
              {
                titulo: 'Registrar Comensales',
                url: 'registrar-comensales'
              },
              {
                titulo: 'Lista Registros',
                url: 'lista-comensales'
              }
            ]
          },
          {
            titulo: 'Totales',
            icono: 'nav-icon fas fa-solid fa-magnifying-glass-chart',
            url: 'totales',
            child: false, 
            subMenu: null
            // subMenu: [
            //   {
            //     titulo: 'Promedios diarios',
            //     url: 'promedios-diarios'
            //   },
            //   {
            //     titulo: 'Promedios mensuales',
            //     url: 'promedios-mensuales'
            //   }
            // ]
          },
          {
            titulo: 'Servicios',
            icono: 'nav-icon fas fa-solid fa-gear',
            url: null,
            child: true,
            subMenu: [
              {
                titulo: 'Menu Diario',
                url: 'menu-diario'
              },
              // {
              //   titulo: 'Solicitud Cantidad',
              //   url: 'solicitud-cantidad'
              // }
            ]
          },
          {
            titulo: 'Comensales',
            icono: 'nav-icon fas fa-solid fa-utensils',
            url: 'comensales',
            child: false,
            subMenu: null
          },
          {
            titulo: 'Empresas',
            icono: 'nav-icon fas fa-solid fa-building',
            url: 'empresas',
            child: false,
            subMenu: null
          }
      )
    }
    if (role == 'cocina') {
      menu.push(
        {
          titulo: 'Menu Diario',
          icono: 'nav-icon fas fa-solid fa-utensils',
          url: 'menu-diario',
          child: false,
          subMenu: null,
        }
      )
    }
    return menu;
}

module.exports = {
    getMenuFrontEnd
}