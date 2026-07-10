'use client'

import { useEffect, useState } from 'react'

export function useProfile() {
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        fetch('/api/profile')
            .then((res) => res.json())
            .then((data) => setProfile(data))
            .catch((err) => console.error(err))
    }, [])

    return profile
}