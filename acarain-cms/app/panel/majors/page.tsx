'use client'

import axios from "@/lib/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function ListAdmin() {
    const [majors, setMajors] = useState([])
    const token = Cookies.get('token')

    const fetchMajors = async () => {
        try {
            const res = await axios.get('/majors', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMajors(res.data)
        } catch (err: any) {
            console.log('Failed to fetch majors',err)
        }
    }

    useEffect(() => {
        fetchMajors()
    }, [])

    const handleDelete = async (id: string) => {
        const ok = confirm('Are you sure you want to delete this major?')
        if (!ok) return

        try {
            const res = await axios.delete(`/majors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMajors(majors.filter((major: any) => major.id !== id))
        } catch (err: any) {
            console.log('Failed to delete major', err)
        }
    }
    return (
        <>
            <div className="breadcrumbs text-sm mb-2">
                <ul>
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li>Majors</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl">Majors</h1>
                <Link href="/panel/majors/create" className="btn btn-neutral">Add major</Link>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {majors.map((major: any, index: number) => (
                                    <tr key={major.id}>
                                        <th>{index+1}</th>
                                        <td>{major.name}</td>
                                        <td className="text-center">
                                            <Link href={`/panel/majors/${major.id}`} className="btn btn-outline mr-2">Edit</Link>
                                            <button className="btn btn-error btn-outline" onClick={() => handleDelete(major.id)}>Delete</button>
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
