const allowedUnits = {
    "mm": "Millimeters",
    "cm": "Centimeters",
    "m": "Meters",
    "km": "Kilometers",
    "mi": "Miles",
    "c": "Celsius",
    "f": "Fahrenheit",
    "k": "Kelvin",
    "g": "Grams",
    "kg": "Kilograms",
    "tonne": "Tonnes",
    "lb": "Pounds",
    "ml": "Milliliters",
    "l": "Liters",
    "gal": "Gallons"
};

// Map each unit to all units in the same category except itself
const conversionCategories = {
    "length": ["mm", "cm", "m", "km", "mi"],
    "temperature": ["c", "f", "k"],
    "weight": ["g", "kg", "tonne", "lb"],
    "volume": ["ml", "l", "gal"]
};

// Build validConversions dynamically
const validConversions = {};
for (const cat in conversionCategories) {
    const units = conversionCategories[cat];
    units.forEach(u => {
        validConversions[u] = units.filter(x => x !== u);
    });
}

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

    if (validConversions[from_unit]) {
        validConversions[from_unit].forEach(u => {
            const op = document.createElement("option");
            op.value = u;
            op.textContent = `${allowedUnits[u]} (${u})`;
            toElem.appendChild(op);
        });
    }
}

function convert() {
    const value = parseFloat(document.getElementById("value").value);
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

            if (data.note) {
                html += `<h4>Note:</h4>`;
                html += `<p>${data.note}</p>`;
            }

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
