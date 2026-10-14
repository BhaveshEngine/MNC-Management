import json
import mimetypes
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

RECORDS_FILE = "employee_records.txt"
ATTENDANCE_FILE = "attendance.txt"

DEFAULT_RECORDS = [
    ["EMP-101", "28", "Aarav Sharma", "HR", "42000", "9876543210", "Jaipur"],
    ["EMP-102", "32", "Sneha Verma", "Engineering", "65000", "9988776655", "Delhi"],
]


def sort_records(records):
    return sorted(records, key=lambda record: (record["name"].lower(), record["employeeId"].lower()))


def ensure_files():
    if not os.path.exists(RECORDS_FILE):
        with open(RECORDS_FILE, "w", encoding="utf-8") as f:
            for item in DEFAULT_RECORDS:
                f.write("|".join(item) + "\n")

    if not os.path.exists(ATTENDANCE_FILE):
        with open(ATTENDANCE_FILE, "w", encoding="utf-8") as f:
            f.write("")


def load_records():
    ensure_files()
    records = []
    with open(RECORDS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("|")
            if len(parts) < 7:
                continue
            records.append({
                "id": parts[0],
                "employeeId": parts[0],
                "age": int(parts[1]),
                "name": parts[2],
                "department": parts[3],
                "salary": float(parts[4]),
                "contactNo": parts[5],
                "address": parts[6],
            })

    return sort_records(records)


def save_records(records):
    sorted_records = sort_records(records)
    with open(RECORDS_FILE, "w", encoding="utf-8") as f:
        for record in sorted_records:
            f.write("|".join([
                record["employeeId"],
                str(record["age"]),
                record["name"],
                record["department"],
                str(record["salary"]),
                record["contactNo"],
                record["address"],
            ]) + "\n")


def load_attendance():
    attendance = {}
    if not os.path.exists(ATTENDANCE_FILE):
        return attendance

    with open(ATTENDANCE_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split("|")
            if len(parts) >= 2:
                employee_id = parts[0]
                status = parts[1]
                timestamp = parts[2] if len(parts) >= 3 else ""
                attendance[employee_id] = {
                    "status": status,
                    "timestamp": timestamp,
                }
    return attendance


def save_attendance(attendance):
    with open(ATTENDANCE_FILE, "w", encoding="utf-8") as f:
        for employee_id, entry in attendance.items():
            status = entry.get("status", "Unknown") if isinstance(entry, dict) else entry
            timestamp = entry.get("timestamp", "") if isinstance(entry, dict) else ""
            f.write(f"{employee_id}|{status}|{timestamp}\n")


class RequestHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/records":
            self.send_json(200, load_records())
            return

        if self.path == "/api/attendance":
            self.send_json(200, load_attendance())
            return

        self.serve_static()

    def do_POST(self):
        if self.path == "/api/records":
            payload = self.read_json_body()
            records = load_records()
            existing_index = next((i for i, item in enumerate(records) if item["employeeId"] == payload["employeeId"]), None)

            if existing_index is None:
                records.append({
                    "id": payload["employeeId"],
                    "employeeId": payload["employeeId"],
                    "age": int(payload["age"]),
                    "name": payload["name"],
                    "department": payload["department"],
                    "salary": float(payload["salary"]),
                    "contactNo": payload["contactNo"],
                    "address": payload["address"],
                })
            else:
                records[existing_index] = {
                    "id": payload["employeeId"],
                    "employeeId": payload["employeeId"],
                    "age": int(payload["age"]),
                    "name": payload["name"],
                    "department": payload["department"],
                    "salary": float(payload["salary"]),
                    "contactNo": payload["contactNo"],
                    "address": payload["address"],
                }

            records = sort_records(records)
            save_records(records)
            self.send_json(200, {"status": "ok", "records": records})
            return

        if self.path == "/api/attendance":
            payload = self.read_json_body()
            attendance = load_attendance()
            attendance[payload["employeeId"]] = {
                "status": payload["status"],
                "timestamp": payload.get("timestamp") or datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
            save_attendance(attendance)
            self.send_json(200, {"status": "ok", "attendance": attendance})
            return

        self.send_error(404, "Not found")

    def do_DELETE(self):
        if self.path.startswith("/api/records/"):
            record_id = self.path.split("/")[-1]
            records = load_records()
            records = [item for item in records if item["employeeId"] != record_id]
            records = sort_records(records)
            save_records(records)
            self.send_json(200, {"status": "deleted", "records": records})
            return

        self.send_error(404, "Not found")

    def serve_static(self):
        clean_path = self.path.split("?")[0].split("#")[0]
        if clean_path == "/":
            clean_path = "/index.html"

        rel_path = clean_path.lstrip("/")
        base_dir = os.path.dirname(os.path.abspath(__file__))
        dist_dir = os.path.join(base_dir, "employeehub", "dist")

        # 1. Serve from built Vite React app if available
        if os.path.exists(dist_dir):
            file_path = os.path.join(dist_dir, rel_path)
            if os.path.isfile(file_path):
                self._send_file(file_path)
                return
            # SPA fallback: Any non-file path falls back to dist/index.html
            spa_index = os.path.join(dist_dir, "index.html")
            if os.path.isfile(spa_index):
                self._send_file(spa_index)
                return

        # 2. Fallback to root directory static files
        file_path = os.path.join(base_dir, rel_path)
        if os.path.isfile(file_path):
            self._send_file(file_path)
            return

        self.send_error(404, "File not found")

    def _send_file(self, file_path):
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type is None:
            mime_type = "application/octet-stream"

        with open(file_path, "rb") as f:
            content = f.read()

        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def send_json(self, status_code, payload):
        content = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def read_json_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        return json.loads(body.decode("utf-8"))


if __name__ == "__main__":
    ensure_files()
    port = int(os.environ.get("PORT", 8000))
    server = ThreadingHTTPServer(("0.0.0.0", port), RequestHandler)
    print(f"Storage server running on http://localhost:{port}")
    server.serve_forever()
