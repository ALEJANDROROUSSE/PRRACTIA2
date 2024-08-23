function convertTo24HourFormat(hour, minute, period) {
    if (period === "PM" && hour < 12) {
        hour += 12;
    } else if (period === "AM" && hour === 12) {
        hour = 0;
    }
    return { hour, minute };
}

function calculateParking() {
    const day = document.getElementById("day").value;

    const entryHour = parseInt(document.getElementById("entry-hour").value);
    const entryMinute = parseInt(document.getElementById("entry-minute").value);
    const entryPeriod = document.getElementById("entry-period").value;
    const exitHour = parseInt(document.getElementById("exit-hour").value);
    const exitMinute = parseInt(document.getElementById("exit-minute").value);
    const exitPeriod = document.getElementById("exit-period").value;

    // Convertir horas a formato 24 horas
    const entryTime = convertTo24HourFormat(entryHour, entryMinute, entryPeriod);
    const exitTime = convertTo24HourFormat(exitHour, exitMinute, exitPeriod);

    // Crear objetos de fecha con las horas de entrada y salida
    let entry = new Date(1970, 0, 1, entryTime.hour, entryTime.minute);
    let exit = new Date(1970, 0, 1, exitTime.hour, exitTime.minute);

    // Ajuste para tiempos que cruzan la medianoche
    if (exitTime.hour < entryTime.hour || (exitTime.hour === entryTime.hour && exitTime.minute < entryTime.minute)) {
        exit.setDate(exit.getDate() + 1); // Ajustar para cruzar la medianoche
    }

    // Calcular la diferencia en minutos
    let totalMinutes = (exit - entry) / 60000;
    let cost = 0;

    // Cálculo del costo basado en los minutos totales
    if (totalMinutes <= 10) {
        cost = 0; // Primeros 10 minutos son gratis
    } else if (totalMinutes <= 25) {
        cost = 3; // Siguientes 15 minutos cuestan $3
    } else {
        totalMinutes -= 25; // Descontar los primeros 25 minutos
        cost = 3;

        // Primera hora completa o fracción
        if (totalMinutes > 0) {
            cost += 10; 
            totalMinutes -= 60; // Descontar la primera hora completa
        }

        // Horas adicionales (sin incluir la primera hora ya sumada)
        if (totalMinutes > 0) {
            cost += Math.ceil(totalMinutes / 60) * 5;
        }
    }

    // Aplicar descuento del 10% si es domingo
    if (day === "domingo") {
        cost *= 0.9;
    }

    // Mostrar el resultado
    document.getElementById("result").innerText = `Total a pagar: $${cost.toFixed(2)}`;
}