'use client'

import axios from "@/lib/axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from 'next/navigation'
import ModalDetailReg from "@/lib/components/ModalDetailReg";
import { format } from 'date-fns'
import { id as idn } from 'date-fns/locale';

export default function DetailEvent() {
    const { id } = useParams()

    const [event, setEvent] = useState<any>(null)
    const [error, setError] = useState('')
    const [selectReg, setSelectReg] = useState<any | null>(null)

    const token = Cookies.get('token')

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setEvent(res.data)
        } catch (err: any) {
            console.log('Failed to fetch event', err)
        }
    }

    useEffect(() => {
        if (id) fetchEvent()
    }, [id])

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault()

    //     try {
    //         await axios.put(`/events/${id}`, form, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         router.push('/panel/events')
    //     } catch (err: any) {
    //         setError(err.response?.data?.message)
    //     }
    // }

    const handleDelete = async (id: string) => {
        const ok = confirm('Are you sure you want to delete this registration?')
        if (!ok) return

        try {
            await axios.delete(`/registrations/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setEvent({ ...event, registrations: event.registrations.filter((reg: any) => reg.id !== id) })
        } catch (err: any) {
            console.log('Failed to delete registration', err)
        }
    }

    if (!event) return <div>Loading...</div>

    return (
        <>
            <div className="breadcrumbs text-sm mb-2">
                <ul>
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li><Link href="/panel/events">Events</Link></li>
                    <li>Detail Event</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl">Detail Event</h1>
                <div className="flex">
                    <Link href="/panel/events" className="btn btn-outline mr-2">Back</Link>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-6">
                <div className="md:col-span-2 col-span-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <img src={process.env.NEXT_PUBLIC_API_HOST + event.thumbnail} alt="" className="w-full rounded mb-2" />
                            <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                            <p className="mb-2 text-justify">{event.description}</p>
                            <div className="stats shadow text-nowrap">
                                <div className="stat place-items-center">
                                    <div className="stat-title">Location</div>
                                    <div className="font-semibold">{event.location}</div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Date</div>
                                    <div className="font-semibold">{format(new Date(event.date), 'dd MMMM yyyy, HH:mm', { locale: idn })} WIB</div>
                                </div>

                                <div className="stat place-items-center">
                                    <div className="stat-title">Quota</div>
                                    <div className="font-semibold">{event.quota - event.registrations.filter((reg: any) => reg.status === 'APPROVED').length}/{event.quota}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-3 col-span-5">
                    <div className="stats shadow mb-5 w-full">
                        <div className="stat place-items-center">
                            <div className="stat-title">Pending</div>
                            <div className="stat-value text-warning">{event.registrations.filter((reg: any) => reg.status === 'PENDING').length}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Approved</div>
                            <div className="stat-value text-success">{event.registrations.filter((reg: any) => reg.status === 'APPROVED').length}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Cancelled</div>
                            <div className="stat-value text-error">{event.registrations.filter((reg: any) => reg.status === 'CANCELLED').length}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Rejected</div>
                            <div className="stat-value text-error">{event.registrations.filter((reg: any) => reg.status === 'REJECTED').length}</div>
                        </div>
                        <div className="stat place-items-center">
                            <div className="stat-title">Attended</div>
                            <div className="stat-value text-info">{event.registrations.filter((reg: any) => reg.attendance === 'ATTENDED').length}</div>
                        </div>
                    </div>
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h1 className="font-semibold text-lg mb-2">Registrations</h1>
                            <div className="overflow-x-auto">
                                <table className="table text-nowrap">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>NPM</th>
                                            <th>Major</th>
                                            <th>Status</th>
                                            <th>Attendance</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {event.registrations.map((reg: any, index: number) => (
                                            <tr key={reg.id}>
                                                <th>{index + 1}</th>
                                                <td>{reg.name}</td>
                                                <td>{reg.npm}</td>
                                                <td>{reg.major.name}</td>
                                                <td>
                                                    {reg.status === 'PENDING' && <span className="badge badge-warning">Pending</span>}
                                                    {reg.status === 'APPROVED' && <span className="badge badge-success">Approved</span>}
                                                    {reg.status === 'REJECTED' && <span className="badge badge-error">Rejected</span>}
                                                    {reg.status === 'CANCELLED' && <span className="badge badge-error">Cancelled</span>}
                                                    {reg.status === 'ATTENDED' && <span className="badge badge-info">Attended</span>}
                                                </td>
                                                <td>
                                                    {reg.attendance === 'ABSENT' && <span className="badge badge-warning">Absent</span>}
                                                    {reg.attendance === 'ATTENDED' && <span className="badge badge-info">Attended</span>}
                                                </td>
                                                <td>
                                                    <button className="btn btn-outline btn-square btn-sm mr-2" onClick={() => setSelectReg(reg)}>
                                                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeWidth="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z" />
                                                            <path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        </svg>
                                                    </button>
                                                    <button className="btn btn-error btn-outline btn-square btn-sm" onClick={() => handleDelete(reg.id)}>
                                                        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectReg && (
                <ModalDetailReg registration={selectReg} onClose={() => setSelectReg(null)} />
            )}
        </>
    );
}
