import { ReactNode, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import GlobalContextProvider from "./contexts/context/global";
import {HomePage, PageNotFound } from "./pages";
import Authentication from "./pages/authentication";
import './utils/themes/theme.scss'
import PrivatePagesLayout from "./pages/wrapper.private.layout";


function ScrollToTop({children} : {children : ReactNode}){
  const location = useLocation()

    useEffect(() =>{
        if(location.hash){
            const el = document.getElementById(location.hash.substring(1))
            if(el){
                el.scrollIntoView({behavior: "smooth", block : 'nearest'})
            }
        }else{
            window.scrollTo(0, 0);
        }
    }, [location])

  return(
    <>
      {children}
    </>
  )
}

function App() {
  
  return (
    <GlobalContextProvider>
      <BrowserRouter>
        <ScrollToTop>
          <Routes>
            <Route path='/*' element={<PrivatePagesLayout />} />
            <Route path='auth/*' element={<Authentication />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </GlobalContextProvider>
  );
}

export default App;
