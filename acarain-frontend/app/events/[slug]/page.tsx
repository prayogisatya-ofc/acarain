'use client'

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useParams, useRouter } from "next/navigation";
import NavbarUser from "@/lib/components/NavbarUser";
import Cookies from "js-cookie";

export default function DetailEvent() {
    const { slug } = useParams()
    const router = useRouter()

    const [event, setEvent] = useState<any>(null)
    const [name, setName] = useState('')
    const [npm, setNpm] = useState('')
    const [majorId, setMajor] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [majors, setMajors] = useState([])

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`/front/events/${slug}`)
            setEvent(res.data)
        } catch (err: any) {
            console.log('Failed to fetch event', err)
        }
    }

    const fetchMajors = async () => {
        try {
            const res = await axios.get('/majors')
            setMajors(res.data)
        } catch (err) {
            console.log('Failed to fetch majors', err)
        }
    }

    useEffect(() => {
        fetchEvent()
        fetchMajors()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await axios.post('/registrations', { eventId: event.id, name, npm, majorId, whatsapp }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            })
            setName('')
            setNpm('')
            setMajor('')
            setWhatsapp('')
            router.push(`/ticket?reg=${res.data.id}`)
        } catch (err: any) {
            console.log('Failed to register', err)
        }
    }

    if (!event) return <div>Loading...</div>

    return (
        <div className="max-w-screen-sm mx-auto relative">
            <NavbarUser title="Event" />

            <img src={process.env.NEXT_PUBLIC_API_HOST + event.thumbnail} alt="" className="w-full" />

            <div className="py-4 px-4 mx-auto max-w-screen-xl">
                <h1 className="text-md font-semibold mb-3">{event.title}</h1>

                <div className="grid grid-cols-3 mb-3">
                    <div className="col-span-1">
                        <h2 className="text-xs font-semibold mb-1">Date</h2>
                        <p className="text-xs font-light">{format(new Date(event.date), 'dd MMMM yyyy', { locale: id })}</p>
                    </div>
                    <div className="col-span-1">
                        <h2 className="text-xs font-semibold mb-1">Time</h2>
                        <p className="text-xs font-light">{format(new Date(event.date), 'HH:mm', { locale: id })} WIB</p>
                    </div>
                    <div className="col-span-1">
                        <h2 className="text-xs font-semibold mb-1">Location</h2>
                        <p className="text-xs font-light">{event.location}</p>
                    </div>
                </div>

                <div className="mb-3">
                    <h2 className="text-xs font-semibold mb-1">Description</h2>
                    <p className="text-xs font-light text-justify">{event.description}</p>
                </div>

                <div className="mb-18">
                    <div className="flex justify-between">
                        <h2 className="text-xs font-semibold mb-1">Quota</h2>
                        <p className="text-xs font-light">{event.currentQuota} / {event.quota}</p>
                    </div>
                    <progress className="progress w-full" value={event.currentQuota} max={event.quota}></progress>
                </div>
            </div>

            <div className="w-full px-4 py-4 fixed z-10 bottom-0 left-0 right-0 bg-base-100">
                <button
                    className="btn btn-neutral w-full"
                    onClick={() => {
                        const modal = document.getElementById('modal_register') as HTMLDialogElement;
                        if (modal) modal.showModal();
                    }}
                    disabled={event.currentQuota <= 0}
                >
                    Register
                </button>
            </div>

            <dialog id="modal_register" className="modal">
                <div className="modal-box">
                    <h3 className="font-semibold text-base mb-3">Biodata</h3>
                    <form id="register-form" onSubmit={handleSubmit}>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Full name</legend>
                            <input type="text" className="input" placeholder="Ex: Jhon Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">NPM</legend>
                            <input type="text" className="input" placeholder="Ex: 22312009" value={npm} onChange={(e) => setNpm(e.target.value)} required />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">WhatsApp</legend>
                            <input type="text" className="input" placeholder="Ex: 081234567890" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Major</legend>
                            <select defaultValue="Pick a major" className="select" onChange={(e) => setMajor(e.target.value)} required>
                                <option disabled={true}>Pick a major</option>
                                {majors && majors.map((major: any) => (
                                    <option key={major.id} value={major.id}>{major.name}</option>
                                ))}
                            </select>
                        </fieldset>
                    </form>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                        <button type="submit" form="register-form" className="btn btn-neutral">Register</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
