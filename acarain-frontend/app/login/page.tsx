'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import Cookies from 'js-cookie'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await axios.post('/auth/login', { email, password })
            const { token } = res.data
            Cookies.set('token', token, { expires: 7 })
            router.push('/panel')
        } catch (err: any) {
            setError(err.response?.data?.message)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="card shadow-sm max-w-sm w-full">
                <div className="card-body">
                    <form onSubmit={handleLogin} className='space-y-4'>
                        <h1 className="text-xl font-bold">Panel Login</h1>
                        {error && 
                            <div role="alert" className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        }
                        <div>
                            <label className="input validator input-neutral w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input type="email" placeholder="jhon@acarain.com" value={email} onChange={e => setEmail(e.target.value)} required />
                            </label>
                            <div className="validator-hint hidden">Enter valid email address</div>
                        </div>
                        <div>
                            <label className="input validator input-neutral w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            </label>
                            <div className="validator-hint hidden">Enter valid password</div>
                        </div>
                        <button type="submit" className="btn btn-neutral w-full">Login</button>
                    </form>
                </div>
            </div>
        </main>
    );
}
