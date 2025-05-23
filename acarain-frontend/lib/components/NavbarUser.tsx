"use client"

import { useRouter } from "next/navigation"

export default function NavbarUser({
    title,
}: {
    title: string
}) {
    const router = useRouter()

    return (
        <div className="navbar bg-base-100 shadow-sm z-10 sticky top-0">
            <div className="navbar-start">
                <button onClick={() => router.back()} className="btn btn-ghost btn-circle">
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7"/>
                    </svg>
                </button>
                <a className="btn btn-ghost text-xl">{title}</a>
            </div>
        </div>
    )
}
