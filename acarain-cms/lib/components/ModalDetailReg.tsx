"use client"

import { useEffect, useRef, useState } from "react"
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import axios from "@/lib/axios"
import Cookies from "js-cookie"

export default function ModalDetailReg({
    registration,
    onClose,
}: {
    registration: any
    onClose: () => void
}) {
    const modalRef = useRef<HTMLDialogElement>(null)
    const [status, setStatus] = useState(registration.status)
    const [attendance, setAttendance] = useState(registration.attendance)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (registration && modalRef.current) {
            modalRef.current.showModal()
        }
    }, [registration])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await axios.put(`/registrations/${registration.id}`, { status, attendance }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            })
            setStatus(res.data.status)
            setAttendance(res.data.attendance)
            registration.status = res.data.status
            registration.attendance = res.data.attendance
            setSuccess(true)
        } catch (err: any) {
            console.log('Failed to update registration', err)
        }
    }

    return (
        <dialog ref={modalRef} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-3">Detail Registration</h3>
                {success && 
                    <div role="alert" className="alert alert-success mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Registration status or attendance has been updated</span>
                    </div>
                }
                <div className="overflow-x-auto">
                    <table className="w-full text-nowrap">
                        <tbody>
                            <tr className="">
                                <td className="text-left py-2">Name</td>
                                <td className="text-right py-2">{registration.name}</td>
                            </tr>
                            <tr className="">
                                <td className="text-left py-2">NPM</td>
                                <td className="text-right py-2">{registration.npm}</td>
                            </tr>
                            <tr className="">
                                <td className="text-left py-2">Major</td>
                                <td className="text-right py-2">{registration.major.name}</td>
                            </tr>
                            <tr className="">
                                <td className="text-left py-2">WhatsApp</td>
                                <td className="text-right py-2">{registration.whatsapp}</td>
                            </tr>
                            <tr className="">
                                <td className="text-left py-2">Status</td>
                                <td className="text-right py-2">
                                    {registration.status === 'PENDING' && <span className="badge badge-warning">Pending</span>}
                                    {registration.status === 'APPROVED' && <span className="badge badge-success">Approved</span>}
                                    {registration.status === 'REJECTED' && <span className="badge badge-error">Rejected</span>}
                                    {registration.status === 'CANCELLED' && <span className="badge badge-error">Cancelled</span>}
                                </td>
                            </tr>
                            <tr className="">
                                <td className="text-left py-2">Attendance</td>
                                <td className="text-right py-2">
                                    {registration.attendance === 'ABSENT' && <span className="badge badge-warning">Absent</span>}
                                    {registration.attendance === 'ATTENDED' && <span className="badge badge-info">Attended</span>}
                                </td>
                            </tr>
                            <tr className="">
                                <td className="text-left py-2">Created at</td>
                                <td className="text-right py-2">{format(new Date(registration.createdAt), 'dd MMMM yyyy, HH:mm', { locale: id })} WIB</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <form id="status-form" className="mt-3" onSubmit={handleUpdate}>
                    <div className="grid grid-cols-2 gap-4">
                        <fieldset className="fieldset md:col-span-1 col-span-2">
                            <legend className="fieldset-legend">Status</legend>
                            <select defaultValue={registration.status} onChange={(e) => setStatus(e.target.value)} className="select w-full">
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </fieldset>
                        <fieldset className="fieldset md:col-span-1 col-span-2">
                            <legend className="fieldset-legend">Attendance</legend>
                            <select defaultValue={registration.attendance} onChange={(e) => setAttendance(e.target.value)} className="select w-full">
                                <option value="ABSENT">Absent</option>
                                <option value="ATTENDED">Attended</option>
                            </select>
                        </fieldset>
                    </div>
                </form>
                <div className="modal-action">
                    <button type="submit" form="status-form" className="btn btn-neutral" disabled={registration.status === status && registration.attendance === attendance}>Update</button>
                    <form method="dialog">
                        <button onClick={onClose} className="btn">Close</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}
