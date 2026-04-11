"use server"

import { cookies } from "next/headers"

const API = process.env.NEXT_PUBLIC_BOEM_API_BASE_URL
  ? `${process.env.NEXT_PUBLIC_BOEM_API_BASE_URL}/auth`
  : "http://localhost:8000/api/v1/auth"


export async function loginAction(formData) {

    const email = formData.get("email")
    const password = formData.get("password")

    const res = await fetch(`${API}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })

    const data = await res.json()

    if (!res.ok) {
        return { error: data.detail }
    }

    const cookieStore = cookies()

    cookieStore.set("access", data.access)
    cookieStore.set("refresh", data.refresh)

    return { success: true }
}



export async function registerAction(formData) {

    const res = await fetch(`${API}/register/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
            first_name: formData.get("first_name"),
            last_name: formData.get("last_name")
        })
    })

    return await res.json()
}



export async function logoutAction() {

    const cookieStore = cookies()
    const refresh = cookieStore.get("refresh")?.value

    await fetch(`${API}/logout/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refresh
        })
    })

    cookieStore.delete("access")
    cookieStore.delete("refresh")
}
