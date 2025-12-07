class UnitConverter:

    def __init__(self):

        # Reference systems for simpler conversions
        self.ref_units = {
            "length": {
                "base": "m",
                "units": {
                    "mm": 0.001,
                    "cm": 0.01,
                    "m": 1,
                    "km": 1000,
                    "mi": 1609.34
                }
            },

            "weight": {
                "base": "kg",
                "units": {
                    "g": 0.001,
                    "kg": 1,
                    "tonne": 1000,
                    "lb": 0.453592
                }
            },

            "volume": {
                "base": "l",
                "units": {
                    "ml": 0.001,
                    "l": 1,
                    "gal": 3.78541
                }
            },

            "temperature": {
                "units": ["c", "f", "k"]
            }
        }

        self.negative_allowed = {"c", "f", "k"}

    # ---------- MASTER CONVERT ----------

    def convert(self, value, from_unit, to_unit):

        from_unit = from_unit.lower()
        to_unit = to_unit.lower()

        # Temperature handled separately
        if from_unit in ["c", "f", "k"] and to_unit in ["c", "f", "k"]:
            return self.convert_temperature(value, from_unit, to_unit)

        # Generic conversions
        for category, system in self.ref_units.items():
            if category == "temperature":
                continue

            if from_unit in system["units"] and to_unit in system["units"]:
                return self.convert_generic(value, from_unit, to_unit, system)

        raise ValueError(f"Unsupported conversion: {from_unit} → {to_unit}")

    # ---------- GENERIC UNIT CONVERSION ----------

    def convert_generic(self, value, from_unit, to_unit, system):

        # Convert to base unit
        base_value = value * system["units"][from_unit]

        # Convert from base to target
        return base_value / system["units"][to_unit]

    # ---------- TEMPERATURE CONVERSION ----------

    def convert_temperature(self, value, from_u, to_u):
        if from_u == to_u:
            return value

        # Convert to Kelvin
        if from_u == "c":
            k = value + 273.15
        elif from_u == "f":
            k = (value - 32) * 5/9 + 273.15
        elif from_u == "k":
            k = value
        else:
            raise ValueError("Unsupported temperature unit")

        # Convert Kelvin to target unit
        if to_u == "c":
            return k - 273.15
        elif to_u == "f":
            return (k - 273.15) * 9/5 + 32
        elif to_u == "k":
            return k
        else:
            raise ValueError("Unsupported temperature unit")
