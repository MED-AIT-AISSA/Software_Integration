class UnitConverter:

    def __init__(self):
        self.conversions = {
            # Length
            ("mi", "km"): self.miles_to_km,
            ("km", "mi"): self.km_to_miles,
            ("m", "cm"): self.m_to_cm,
            ("cm", "m"): self.cm_to_m,

            # Temperature
            ("c", "f"): self.c_to_f,
            ("f", "c"): self.f_to_c,

            # Weight
            ("kg", "lb"): self.kg_to_lb,
            ("lb", "kg"): self.lb_to_kg,

            # Volume
            ("l", "ml"): self.l_to_ml,
            ("ml", "l"): self.ml_to_l,
            ("l", "gal"): self.l_to_gal,
            ("gal", "l"): self.gal_to_l,
        }

        self.negative_allowed = {"c", "f"}

    def convert(self, value, from_unit, to_unit):
        from_unit = from_unit.lower()
        to_unit = to_unit.lower()

        key = (from_unit, to_unit)

        if key not in self.conversions:
            raise ValueError(f"Unsupported conversion: {from_unit} → {to_unit}")

        if value < 0 and from_unit not in self.negative_allowed:
            raise ValueError(f"Negative value not allowed for unit: {from_unit}")

        return self.conversions[key](value)

    # Length
    def miles_to_km(self, v): return v * 1.60934
    def km_to_miles(self, v): return v / 1.60934
    def m_to_cm(self, v): return v * 100
    def cm_to_m(self, v): return v / 100

    # Temperature
    def c_to_f(self, v): return (v * 9/5) + 32
    def f_to_c(self, v): return (v - 32) * 5/9

    # Weight
    def kg_to_lb(self, v): return v * 2.20462
    def lb_to_kg(self, v): return v / 2.20462

    # Volume
    def l_to_ml(self, v): return v * 1000
    def ml_to_l(self, v): return v / 1000
    def l_to_gal(self, v): return v * 0.264172
    def gal_to_l(self, v): return v / 0.264172
