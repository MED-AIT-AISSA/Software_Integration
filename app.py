from flask import Flask, request, jsonify, render_template
from unit_converter import UnitConverter

app = Flask(__name__)
converter = UnitConverter()

# Home page
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/help", methods=["GET"])
def help():
    return jsonify({
        "description": "Unit Converter API",
        "usage": {
            "endpoint": "/convert",
            "method": "POST"
        },
        "allowed_units": {
            "length": ["mm", "cm", "m", "km", "mi"],
            "temperature": ["c", "f", "k"],
            "weight": ["g", "kg", "tonne", "lb"],
            "volume": ["ml", "l", "gal"]
        },
        "note": "Only Celsius ('c') can be negative. All other units must be non-negative."
    })



# Convert
@app.route("/convert", methods=["POST"])
def convert():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    for field in ("value", "from_unit", "to_unit"):
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        value = float(data["value"])
    except:
        return jsonify({"error": "value must be a number"}), 400

    try:
        result = converter.convert(value, data["from_unit"], data["to_unit"])
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({
        "result": result,
        "unit": data["to_unit"]
    })


if __name__ == "__main__":
    app.run(debug=True)
