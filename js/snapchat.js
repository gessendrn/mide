(async function() {
    // 1. Credenciales (¡NO las expongas en producción! Usa un backend)
    const config = {
        apiToken: "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzQzMDI4Nzc0LCJzdWIiOiI3MTY4MDIxNS0zMDIwLTRjNDMtYTZjMS1hNmQ4YjlkZTY0OWZ-U1RBR0lOR35kODI3OWVhNi02NzUwLTQ2M2MtYmFiYi0yNGY5MzBhMzQ5ZGQifQ.VHluS-PwakeyPgdM_n_3AM5DJOgTCqiJtAph2FRkfBA", // Del Snap Developer Dashboard
        appId: "cd1fce39-978f-4c43-bf20-93bfa81c804c", // OAuth Client ID
        lensId: "59750560887" // Opcional: ID de tu filtro
    };

    try {
        // 2. Inicializar Camera Kit
        const cameraKit = await window.CameraKit.initialize({
            apiToken: config.apiToken,
            appId: config.appId
        });

        // 3. Crear sesión y conectar cámara
        const session = await cameraKit.createSession();
        document.getElementById("video").srcObject = session.output.live;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });
        await session.setSource(stream);
        await session.play();

        // 4. Aplicar filtro (si tienes Lens ID)
        if (config.lensId) {
            await session.applyLens(config.lensId);
            console.log("✅ Filtro aplicado!");
        }

        // 5. Control del botón
        document.getElementById("startButton").addEventListener("click", () => {
            console.log("Grabando...");
            // Lógica para grabar aquí
        });

    } catch (error) {
        console.error("❌ Error:", error);
        console.log("Error al cargar la cámara.");
    }
})();