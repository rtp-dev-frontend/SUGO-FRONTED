import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";

import { CumplimientoPage } from "./CUMPLIMIENTO";
import { HomePage } from "./HOME";
import { CasetaPage } from "./CASETA";
import { RolPage } from "./ROL-ECOyOP";
import { Rol } from "./rol/Rol";
import { Caseta_ } from "./caseta_";
// import { PruebasPage } from './pruebas'
import useAuthStore from "./shared/auth/useAuthStore";
import { Container, Header } from "./shared/components";
import { SugoInBg } from "./shared/components/Mensajes";
// import { UnderConstructionPage } from './pruebas/UnderConstructionPage'

// import { CapturaRol } from './pruebas/UnderConstructionPage'

let msg;
const BackGround = () => (
  <Container>
    <Header />
    <SugoInBg msg2={msg} />
  </Container>
);

export const Router = () => {
  const logged = useAuthStore((state) => state.logged);
  const {
    sugo12cas,
    sugo12caseta,
    sugo12cum,
    sugo12pru,
    sugo12rol,
    sugo12capRol,
  } = useAuthStore((state) => state.permisosSUGO);

  if (
    !(
      sugo12cas ||
      sugo12caseta ||
      sugo12cum ||
      sugo12pru ||
      sugo12rol ||
      sugo12capRol
    )
  )
    msg = "No tienes permisos para ver contenido";
  else msg = undefined;

  return (
    <Routes>
      {!logged && <Route path="/*" element={<HomePage />} />}

      {logged && (
        <>
          <Route path="/*" element={<BackGround />} />

          {/* {sugo12cum &&
            <Route path='/cumplimiento' element={<CumplimientoPage />} />
          }
          {sugo12rol &&
            <Route path='/rol' element={<RolPage />} />
          } */}

          {sugo12cas && <Route path="/caseta" element={<CasetaPage />} />}
          {sugo12caseta && <Route path="/caseta_" element={<Caseta_ />} />}
          {sugo12rol && <Route path="/rol" element={<Rol />} />}

          {/* <Route path='/dunderm' element={<UnderConstructionPage/>} />
        { */}

          {/* OPCIONES FUTURAS U OLVIDADAS?  */}
          {/* {
          <Route path='/sabana' element={<FormularioSabana/>} />
        }
        {
          <Route path='/config' element={<ConfigPage/>} />
        }
        {
          <Route path='/mtto' element={<Mantenimiento/>} />
        }
        {
          <Route path='/estadistica' element={<JUDestadistica/>} />
        } */}
        </>
      )}
    </Routes>
  );
};
