'use client'

import Dock from "@/lib/components/Dock";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from "next/link";

export default function Home() {
    const [events, setEvents] = useState([])
    const [search, setSearch] = useState('')

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/front/events')
            setEvents(res.data)
        } catch (err: any) {
            console.log('Failed to fetch admins', err)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <div className="max-w-screen-sm mx-auto relative">
            <div className="py-4 px-4 mx-auto max-w-screen-xl">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-semibold">Acarain</h1>
                    <p className="text-sm font-medium">"Satu Event, Seribu Cerita"</p>
                </div>
                <label className="input w-full rounded-full mb-5">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} required placeholder="Search event..." />
                </label>
                {search && <div className="badge badge-ghost mb-3 text-xs pe-0">{search}<button onClick={() => setSearch('')} className="btn btn-xs btn-circle btn-ghost">✕</button></div>}
                <div className="grid grid-cols-2 gap-3">
                    {events.filter((event: any) => event.title.toLowerCase().includes(search.toLowerCase())).map((event: any) => (
                        <Link href={`/events/${event.slug}`} key={event.id} className="card bg-base-100 w-full shadow-sm col-span-1">
                            <figure>
                                <img src={process.env.NEXT_PUBLIC_API_HOST + event.thumbnail} alt="" />
                            </figure>
                            <div className="card-body p-2">
                                <h2 className="card-title text-xs font-semibold text-ellipsis">{event.title}</h2>
                                <div className="space-y-1">
                                    <p className="text-xs flex gap-1 items-center">
                                        <svg className="size-[1.5em]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                                        </svg>
                                        {format(new Date(event.date), 'dd MMMM yyyy', { locale: id })}
                                    </p>
                                    <p className="text-xs flex gap-1 items-center">
                                        <svg className="size-[1.5em]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                                        </svg>
                                        {event.currentQuota}/{event.quota}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Dock />
        </div>
    );
}
