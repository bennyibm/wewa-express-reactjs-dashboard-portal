import { Route, Routes, useNavigate } from "react-router-dom";
import { Logo, ResetPassword, Section, Singin, Singup, UpdatePassword } from "../components";
import PageNotFound from "./page-not-found";
import { useEffect } from "react";
import { useAuth } from "../hooks";

export default function Authentication(){
    const navigate = useNavigate()
    const { user } = useAuth()
    
    useEffect( () => {
        user && navigate("/")
    }, [user, navigate])

    return user ? <></> : (
        <Section container={false} className="h-screen grid grid-cols-2 bg-cover bg-center">
            <div className="flex-1 flex flex-col justify-center bg-gray-200 shadow px-4 md:p-16">
                <Logo />
                <Routes>
                    <Route path="" element={<Singin />}  />
                    <Route path="signin" element={<Singin />} />
                    <Route path="signup" element={<Singup />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    <Route path="update-password" element={<UpdatePassword />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
            <div className="bg-white">
                <img src="/images/wewaexpress.png" className="h-full w-full object-contain" alt="" />
            </div>
        </Section>
    )
}