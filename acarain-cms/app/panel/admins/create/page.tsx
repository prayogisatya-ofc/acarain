'use client'

import axios from "@/lib/axios";
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'

export default function CreateAdmin() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const token = Cookies.get('token')

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await axios.post('/admins', {name, email, password}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            router.push('/panel/admins')
        } catch (err: any) {
            setError(err.response?.data?.message)
        }
    }

    return (
        <>
            <div className="breadcrumbs text-sm mb-2">
                <ul>
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li><Link href="/panel/admins">Admins</Link></li>
                    <li>Add admin</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl">Add admin</h1>
                <div className="flex">
                    <Link href="/panel/admins" className="btn btn-outline mr-2">Back</Link>
                    <button type="submit" form="add-form" className="btn btn-neutral">Save</button>
                </div>
            </div>
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
                        <div className="grid grid-cols-2 gap-4">
                            <fieldset className="fieldset col-span-1">
                                <legend className="fieldset-legend">Name</legend>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input w-full" placeholder="Ex: Jhon Doe" required />
                            </fieldset>
                            <fieldset className="fieldset col-span-1">
                                <legend className="fieldset-legend">Email</legend>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" placeholder="Ex: jhon@acarain.com" required />
                            </fieldset>
                        </div>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Password</legend>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input w-full" placeholder="********" required />
                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    );
}
