'use client'

import axios from "@/lib/axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter, useParams } from 'next/navigation'
import { format, toZonedTime } from 'date-fns-tz'

export default function EditEvent() {
    const router = useRouter()
    const { id } = useParams()

    const [form, setForm] = useState({
        title: '',
        location: '',
        date: '',
        quota: 0,
        description: '',
        thumbnail: ''
    })
    const [error, setError] = useState('')
    const [uploading, setUploading] = useState(false)

    const token = Cookies.get('token')

    const fetchEvent = async () => {
        try {
            const res = await axios.get(`/events/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const event = res.data
            const jakartaDate = toZonedTime(event.date, 'Asia/Jakarta')
            const formattedDate = format(jakartaDate, "yyyy-MM-dd'T'HH:mm")

            setForm({
                title: event.title,
                location: event.location,
                date: formattedDate,
                quota: event.quota,
                description: event.description,
                thumbnail: event.thumbnail ?? ''
            })
        } catch (err: any) {
            console.log('Failed to fetch event', err)
        }
    }

    useEffect(() => {
        if (id) fetchEvent()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)

        try {
            const data = new FormData()
            data.append('file', file)

            const res = await axios.post('/upload', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })

            setForm(prev => ({ ...prev, thumbnail: res.data.url }))
        } catch (err) {
            setError('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await axios.put(`/events/${id}/edit`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            router.push('/panel/events')
        } catch (err: any) {
            setError(err.response?.data?.message)
        }
    }

    return (
        <>
            <div className="breadcrumbs text-sm mb-2">
                <ul>
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li><Link href="/panel/events">Events</Link></li>
                    <li>Edit event</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl">Edit event</h1>
                <div className="flex">
                    <Link href="/panel/events" className="btn btn-outline mr-2">Back</Link>
                    <button type="submit" form="add-form" className="btn btn-neutral">Update</button>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            {error && 
                                <div role="alert" className="alert alert-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            }
                            <form onSubmit={handleSubmit} id="add-form">
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Title</legend>
                                    <input type="text" value={form.title} name="title" onChange={handleChange} className="input w-full" placeholder="Ex: Pelatihan Mikrotik 2025" required />
                                </fieldset>
                                <div className="grid grid-cols-2 gap-4">
                                    <fieldset className="fieldset col-span-1">
                                        <legend className="fieldset-legend">Date</legend>
                                        <input type="datetime-local" value={form.date} name="date" onChange={handleChange} className="input w-full" required />
                                    </fieldset>
                                    <fieldset className="fieldset col-span-1">
                                        <legend className="fieldset-legend">Quota</legend>
                                        <input type="number" value={form.quota} name="quota" onChange={handleChange} className="input w-full" required />
                                    </fieldset>
                                </div>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Location</legend>
                                    <input type="text" value={form.location} name="location" onChange={handleChange} className="input w-full" placeholder="Ex: Lab 1 GSG" required />
                                </fieldset>
                                <fieldset className="fieldset">
                                    <legend className="fieldset-legend">Description</legend>
                                    <textarea name="description" value={form.description} onChange={handleChange} className="textarea w-full" placeholder="Enter description" required></textarea>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <img src={ process.env.NEXT_PUBLIC_API_HOST + form.thumbnail} alt="" />
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Thumbnail</legend>
                                <input type="file" className="file-input w-full" onChange={handleUpload}/>
                            </fieldset>
                            {uploading && <span className="flex items-center"><span className="loading loading-spinner loading-xs mr-2"></span>Uploading...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
