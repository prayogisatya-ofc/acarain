'use client'

import axios from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function ListAdmin() {
    const [admins, setAdmins] = useState([])
    const token = Cookies.get('token')

    const fetchAdmins = async () => {
        try {
            const res = await axios.get('/admins', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAdmins(res.data)
        } catch (err: any) {
            console.log('Failed to fetch admins',err)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

    const handleDelete = async (id: string) => {
        const ok = confirm('Are you sure you want to delete this admin?')
        if (!ok) return

        try {
            const res = await axios.delete(`/admins/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAdmins(admins.filter((admin: any) => admin.id !== id))
        } catch (err: any) {
            console.log('Failed to delete admin', err)
        }
    }
    return (
        <>
            <div className="breadcrumbs text-sm mb-2">
                <ul>
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li>Admins</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl">Admins</h1>
                <Link href="/panel/admins/create" className="btn btn-neutral">Add admin</Link>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Created at</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin: any, index: number) => (
                                    <tr key={admin.id}>
                                        <th>{index+1}</th>
                                        <td>{admin.name}</td>
                                        <td>{admin.email}</td>
                                        <td>{format(new Date(admin.createdAt), "dd MMMM yyyy, HH:mm", {locale: id})} WIB</td>
                                        <td>
                                            <Link href={`/panel/admins/${admin.id}`} className="btn btn-outline mr-2">Edit</Link>
                                            <button className="btn btn-error btn-outline" onClick={() => handleDelete(admin.id)}>Delete</button>
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
