"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Dock() {
    const pathname = usePathname()

    return (
        <div className="dock">
            <Link href="/" className={pathname === "/" ? "dock-active" : ""}>
                <svg className="size-[1.5em]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                </svg>
                <span className="dock-label">Home</span>
            </Link>
            <Link href="/ticket" className={pathname === "/ticket" ? "dock-active" : ""}>
                <svg className="size-[1.5em]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 12A2.5 2.5 0 0 1 21 9.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 1 0 5V17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                </svg>
                <span className="dock-label">Ticket</span>
            </Link>
        </div>
    )
}

