'use client'

import axios from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function ListEvent() {
    const [events, setEvents] = useState([])
    const token = Cookies.get('token')

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/events', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setEvents(res.data)
        } catch (err: any) {
            console.log('Failed to fetch admins', err)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleDelete = async (id: string) => {
        const ok = confirm('Are you sure you want to delete this event?')
        if (!ok) return

        try {
            await axios.delete(`/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setEvents(events.filter((event: any) => event.id !== id))
        } catch (err: any) {
            console.log('Failed to delete event', err)
        }
    }

    return (
        <>
            <div className="breadcrumbs text-sm mb-2">
                <ul>
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li>Events</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl">Events</h1>
                <Link href="/panel/events/create" className="btn btn-neutral">Add event</Link>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Quota</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event: any, index: number) => (
                                    <tr key={event.id}>
                                        <th>{index+1}</th>
                                        <td>{event.title}</td>
                                        <td>{event.location}</td>
                                        <td>{format(new Date(event.date), "dd MMMM yyyy, HH:mm", {locale: id})} WIB</td>
                                        <td>{event.currentQuota}/{event.quota}</td> 
                                        <td>
                                            <Link href={`/panel/events/${event.id}`} className="btn btn-outline btn-primary mr-2">Detail</Link>
                                            <Link href={`/panel/events/${event.id}/edit`} className="btn btn-outline mr-2">Edit</Link>
                                            <button className="btn btn-error btn-outline" onClick={() => handleDelete(event.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
