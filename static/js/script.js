const allowedUnits = {
    "mi": "Miles",
    "km": "Kilometers",
    "m": "Meters",
    "cm": "Centimeters",
    "c": "Celsius",
    "f": "Fahrenheit",
    "kg": "Kilograms",
    "lb": "Pounds",
    "l": "Liters",
    "ml": "Milliliters",
    "gal": "Gallons"
};

const validConversions = {
    "mi": ["km"],
    "km": ["mi"],
    "m": ["cm"],
    "cm": ["m"],
    "c": ["f"],
    "f": ["c"],
    "kg": ["lb"],
    "lb": ["kg"],
    "l": ["ml", "gal"],
    "ml": ["l"],
    "gal": ["l"]
};

window.onload = function () {
    const fromElem = document.getElementById("from_unit");

    for (const unit in allowedUnits) {
        const op = document.createElement("option");
        op.value = unit;
        op.textContent = `${allowedUnits[unit]} (${unit})`;
        fromElem.appendChild(op);
    }

    updateToUnits();
};

function updateToUnits() {
    const from_unit = document.getElementById("from_unit").value;
    const toElem = document.getElementById("to_unit");

    toElem.innerHTML = ""; // clear

    validConversions[from_unit].forEach(u => {
        const op = document.createElement("option");
        op.value = u;
        op.textContent = `${allowedUnits[u]} (${u})`;
        toElem.appendChild(op);
    });
}

function convert() {
    const value = document.getElementById("value").value;
    const from_unit = document.getElementById("from_unit").value;
    const to_unit = document.getElementById("to_unit").value;

    fetch("/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, from_unit, to_unit })
    })
        .then(r => r.json())
        .then(data => {
            const out = document.getElementById("output");

            if (data.error)
                out.innerHTML = `<div class="error">${data.error}</div>`;
            else
                out.innerHTML = `<div class="result">Result: <strong>${data.result} ${data.unit}</strong></div>`;
        });
}

function showHelp() {
    fetch("/help")
        .then(r => r.json())
        .then(data => {
            let html = `<h3>API Help</h3>`;
            html += `<p>${data.description}</p>`;
            html += `<h4>Allowed Units:</h4>`;

            for (const type in data.allowed_units)
                html += `<p><strong>${type}:</strong> ${data.allowed_units[type].join(", ")}</p>`;

            document.getElementById("helpContent").innerHTML = html;
            document.getElementById("helpModal").style.display = "block";
        });
}

function closeHelp() {
    document.getElementById("helpModal").style.display = "none";
}

window.onclick = function (e) {
    const modal = document.getElementById("helpModal");
    if (e.target === modal) modal.style.display = "none";
};
