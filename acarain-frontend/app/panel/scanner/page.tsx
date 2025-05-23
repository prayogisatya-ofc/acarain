'use client'

import { Html5Qrcode } from "html5-qrcode"
import { useRef, useState } from "react"
import axios from "@/lib/axios"
import Cookies from "js-cookie"
import Link from "next/link"

export default function Scanner() {
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const [isScanning, setIsScanning] = useState(false)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [reg, setReg] = useState<any>(null)

    const startScanner = async () => {
        if (isScanning) return
        setIsScanning(true)
        setResult('')
        setError('')
        setReg(null)

        const scannerId = "qr-reader"
        
        try {
            await new Promise((resolve) => setTimeout(resolve, 100))

            const qrScanner = new Html5Qrcode(scannerId)
            scannerRef.current = qrScanner

            await qrScanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    setResult(decodedText)

                    try {
                        const res = await axios.get(`/registrations/attend?code=${decodedText}`, {
                            headers: {
                                Authorization: `Bearer ${Cookies.get('token')}`
                            }
                        })
                        setReg(res.data)
                    } catch {
                        alert("QR tidak valid atau gagal absen.")
                    }

                    await qrScanner.stop()
                    qrScanner.clear()
                    scannerRef.current = null
                    setIsScanning(false)
                },
                (scanError) => {
                    // bisa diabaikan
                }
            )
        } catch (err) {
            setError("Gagal mengakses kamera")
            setIsScanning(false)
        }
    }

    const stopScanner = async () => {
        if (scannerRef.current) {
            await scannerRef.current.stop()
            await scannerRef.current.clear()
            scannerRef.current = null
        }
        setIsScanning(false)
    }

    const handleAttend = async () => {
        try {
            await axios.post(`/registrations/attend?code=${result}`, {}, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            })
            alert("Berhasil absen")
            startScanner()
        } catch (err: any) {
            alert(err.response.data.message)
        }
    }

    return (
        <>
            <div className="breadcrumbs text-sm mb-2">
                <ul>
                    <li><Link href="/panel">Dashboard</Link></li>
                    <li>Scanner</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-3">
                <h1 className="font-semibold text-xl">Scanner</h1>
            </div>
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    {!isScanning && (
                        <button className="btn btn-neutral w-full" onClick={startScanner}>
                            Mulai Scan QR
                        </button>
                    )}

                    {isScanning && (
                        <>
                            <div id="qr-reader" className="w-full aspect-square rounded overflow-hidden mt-4" />
                            <button className="btn btn-error w-full mt-2" onClick={stopScanner}>
                                Stop Scan
                            </button>
                        </>
                    )}

                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                </div>
            </div>
            {reg && 
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h1 className="text-md font-semibold mb-2">Detail Registration</h1>
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
                                </tbody>
                            </table>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="col-span-1 text-center">
                                <div className="text-xs mb-2">Registration</div>
                                {reg.status === 'PENDING' && <span className="badge badge-warning text-xs">Pending</span>}
                                {reg.status === 'APPROVED' && <span className="badge badge-success text-xs">Approved</span>}
                                {reg.status === 'REJECTED' && <span className="badge badge-error text-xs">Rejected</span>}
                                {reg.status === 'CANCELLED' && <span className="badge badge-error text-xs">Cancelled</span>}
                            </div>
                            <div className="col-span-1 text-center">
                                <div className="text-xs mb-2">Attendance</div>
                                {reg.attendance === 'ABSENT' && <span className="badge badge-warning text-xs">Absent</span>}
                                {reg.attendance === 'ATTENDED' && <span className="badge badge-info text-xs">Attended</span>}
                            </div>
                        </div>
                        {reg.status === 'APPROVED' && reg.attendance === 'ABSENT' ? 
                            <button className="btn btn-neutral btn-outline btn-sm" onClick={handleAttend}>Attend</button> : null
                        }
                    </div>
                </div>
            }
        </>
    )
}
