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
        <Section container={false} className="md:grid md:grid-cols-3 lg:grid-cols-2 bg-cover bg-center">
            <div className="min-h-screen  md:col-span-2 lg:col-span-1 flex-1 flex flex-col justify-center bg-white lg:bg-gray-200 shadow p-4 lg:p-16">
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
            <div className="max-md:hidden max-lg:bg-slate-200 bg-white">
                <img src="/images/wewaexpress.png" className="h-full w-full object-contain" alt="" />
            </div>
        </Section>
    )
}