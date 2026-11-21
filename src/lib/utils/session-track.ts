// src/lib/utils/session-track.ts
export async function trackSession() {
    try {
        // Solo ejecutar en el cliente
        if (typeof window === 'undefined') return;

        const response = await fetch('/api/auth/session-track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ip_address: 'client-side', // No podemos obtener IP real desde el cliente
                user_agent: navigator.userAgent,
            }),
        });

        if (!response.ok) {
            console.error('Error al registrar sesión:', await response.text());
        }
    } catch (error) {
        console.error('Error al registrar sesión:', error);
    }
}