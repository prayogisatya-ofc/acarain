"use client"

import { useRouter } from "next/navigation"
import axios from "@/lib/axios"
import Cookies from "js-cookie"
import Link from "next/link"

export default function NavbarAdmin() {
    const router = useRouter()

    const handleLogout = async () => {
        const confirmLogout = confirm("Yakin ingin logout?")
        if (!confirmLogout) return

        try {
            await axios.post("/logout", {})
            Cookies.remove("token")
            router.push("/login")
        } catch (err) {
            console.error("Logout gagal", err)
        }
    }

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link href="/panel">Dashboard</Link></li>
                        <li><Link href="/panel/events">Events</Link></li>
                        <li><Link href="/panel/scanner">Scanner</Link></li>
                        <li><Link href="/panel/majors">Majors</Link></li>
                        <li><Link href="/panel/admins">Admins</Link></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">Acarain</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li><Link href="/panel/events">Events</Link></li>
                    <li><Link href="/panel/scanner">Scanner</Link></li>
                    <li><Link href="/panel/majors">Majors</Link></li>
                    <li><Link href="/panel/admins">Admins</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://ui-avatars.com/api/?name=Prayogi+Setiawan" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
