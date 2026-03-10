import { Outlet } from "react-router-dom";
import Navbar from "../layout/navbar/Navbar"; 
import AdminSidebar from "./AdminSidebar";
import FooterContainer from "../layout/FooterContainer";


export default function AdminLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Navbar publique (desktop + mobile) */}
        <Navbar />

        <div className="flex flex-1">
            {/* Sidebar admin (desktop only) */}
            <AdminSidebar />

            {/* Contenu admin */}
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>

        {/* Footer public */}
        <FooterContainer />
        </div>
    );
}
