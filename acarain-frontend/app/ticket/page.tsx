'use client'

import Dock from "@/lib/components/Dock";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from "next/link";
import QrView from "@/lib/components/QRView";

export default function Events() {
    const [search, setSearch] = useState('')
    const [reg, setReg] = useState<any>(null)
    const searchParams = useSearchParams()

    const fetchReg = async (id: string) => {
        try {
            const res = await axios.get(`/registrations/${id}`)
            setReg(res.data)
        } catch (err: any) {
            console.log('Failed to fetch registration', err)
            setReg(null)
        }
    }

    useEffect(() => {
        const regParam = searchParams.get('reg')
        if (regParam) {
            setSearch(regParam)
            fetchReg(regParam)
        }
    }, [])

    useEffect(() => {
        if (search) fetchReg(search)
    }, [search])

    const handleCancel = async () => {
        const ok = confirm('Are you sure you want to cancel this registration?')
        if (!ok) return

        try {
            await axios.post(`/registrations/cancel?token=${reg.cancelToken}`)
            fetchReg(search)
        } catch (err: any) {
            console.log('Failed to cancel registration', err)
        }
    }

    return (
        <div className="max-w-screen-sm mx-auto relative">
            <div className="py-4 px-4 mx-auto max-w-screen-xl mb-18">
                <label className="input w-full rounded-full mb-5">
                    <svg className="h-[1.3em] opacity-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 12A2.5 2.5 0 0 1 21 9.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 1 0 5V17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                    </svg>
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} required placeholder="Registration ID" />
                </label>

                {reg && 
                    <div>
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h1 className="text-md font-semibold mb-2">Registration</h1>
                                <div className="overflow-x-auto border-b border-base-300 pb-2 mb-2">
                                    <table className="text-nowrap w-full text-xs">
                                        <tbody>
                                            <tr>
                                                <td className="text-left py-1">Name</td>
                                                <td className="text-right py-1">{reg.name}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-1">NPM</td>
                                                <td className="text-right py-1">{reg.npm}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-1">WhatsApp</td>
                                                <td className="text-right py-1">{reg.whatsapp}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-1">Major</td>
                                                <td className="text-right py-1">{reg.major.name}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-1">Created at</td>
                                                <td className="text-right py-1">{format(new Date(reg.createdAt), 'dd MMMM yyyy, HH:mm', { locale: id })} WIB</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="col-span-1 text-center">
                                        <div className="text-xs mb-2">Registration</div>
                                        {reg.status === 'PENDING' && <span className="badge badge-warning text-xs">Pending</span>}
                                        {reg.status === 'APPROVED' && <span className="badge badge-success text-xs">Approved</span>}
                                        {reg.status === 'REJECTED' && <span className="badge badge-error text-xs">Rejected</span>}
                                        {reg.status === 'CANCELLED' && <span className="badge badge-error text-xs">Cancelled</span>}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <div className="text-xs mb-2">QR Code</div>
                                        <button className="btn btn-ghost btn-xs btn-square"
                                            onClick={() => {
                                                const modal = document.getElementById('modal_qrcode') as HTMLDialogElement;
                                                if (modal) modal.showModal();
                                            }}
                                            disabled={!(reg.status === 'APPROVED' && reg.attendance === 'ABSENT')}
                                        >
                                            <svg className="" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 4h6v6H4V4Zm10 10h6v6h-6v-6Zm0-10h6v6h-6V4Zm-4 10h.01v.01H10V14Zm0 4h.01v.01H10V18Zm-3 2h.01v.01H7V20Zm0-4h.01v.01H7V16Zm-3 2h.01v.01H4V18Zm0-4h.01v.01H4V14Z"/>
                                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01v.01H7V7Zm10 10h.01v.01H17V17Z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <div className="text-xs mb-2">Attendance</div>
                                        {reg.attendance === 'ABSENT' && <span className="badge badge-warning text-xs">Absent</span>}
                                        {reg.attendance === 'ATTENDED' && <span className="badge badge-info text-xs">Attended</span>}
                                    </div>
                                </div>
                                {reg.status !== 'REJECTED' && reg.status !== 'CANCELLED' && reg.attendance === 'ABSENT' ? 
                                    <button className="btn btn-error btn-outline btn-sm" onClick={handleCancel}>Cancel</button> : null
                                }
                            </div>
                        </div>
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h1 className="text-md font-semibold mb-2">Detail Event</h1>
                                <div className="overflow-x-auto">
                                    <table className="text-nowrap w-full text-xs">
                                        <tbody>
                                            <tr>
                                                <td className="text-left py-1">Title</td>
                                                <td className="text-right py-1">{reg.event.title}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-1">Location</td>
                                                <td className="text-right py-1">{reg.event.location}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-1">Date</td>
                                                <td className="text-right py-1">{format(new Date(reg.event.date), 'dd MMMM yyyy', { locale: id })}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-left py-1">Time</td>
                                                <td className="text-right py-1">{format(new Date(reg.event.date), 'HH:mm', { locale: id })} WIB</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <Link href={`/events/${reg.event.slug}`} className="btn btn-outline btn-neutral w-full btn-sm">Show Event</Link>
                            </div>
                        </div>
                        <dialog id="modal_qrcode" className="modal">
                            <div className="modal-box">
                                {reg.qrCode && <QrView value={reg.qrCode} />}
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button>close</button>
                            </form>
                        </dialog>
                    </div>
                }
            </div>
            <Dock />
        </div>
    );
}
