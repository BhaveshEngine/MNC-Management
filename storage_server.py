import json
import mimetypes
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECORDS_FILE = os.path.join(BASE_DIR, "employee_records.txt")
ATTENDANCE_FILE = os.path.join(BASE_DIR, "attendance.txt")

PROTECTED_IDS = {"EMP-1024", "ADMIN-1"}
PROTECTED_NAMES = {"rahul sharma", "super admin"}
PROTECTED_EMAILS = {"rahul.sharma@employeehub.in", "admin@employeehub.in"}

DEFAULT_RECORDS = [
    {
        "id": "emp-1024",
        "employeeId": "EMP-1024",
        "firstName": "Rahul",
        "lastName": "Sharma",
        "name": "Rahul Sharma",
        "email": "rahul.sharma@employeehub.in",
        "phone": "9876543210",
        "contactNo": "9876543210",
        "age": 29,
        "gender": "Male",
        "dateOfBirth": "1995-03-15",
        "department": "Engineering",
        "designation": "Senior Developer",
        "salary": 780000.0,
        "managerName": "Ankit Verma",
        "joiningDate": "2024-07-12",
        "employmentType": "Full-time",
        "workLocation": "Jaipur Office",
        "address": "42 Malviya Nagar",
        "city": "Jaipur",
        "state": "Rajasthan",
        "status": "Active",
        "skills": ["React", "TypeScript", "Node.js"],
        "education": "B.Tech in Computer Science, MNIT Jaipur (2013-2017)"
    },
    {
        "id": "emp-2",
        "employeeId": "EMP-1025",
        "firstName": "Ankit",
        "lastName": "Verma",
        "name": "Ankit Verma",
        "email": "ankit.verma@mnc.com",
        "phone": "9876511111",
        "contactNo": "9876511111",
        "age": 36,
        "gender": "Male",
        "dateOfBirth": "1988-08-20",
        "department": "Engineering",
        "designation": "Engineering Manager",
        "salary": 1200000.0,
        "managerName": "CTO",
        "joiningDate": "2020-03-01",
        "employmentType": "Full-time",
        "workLocation": "Jaipur Office",
        "address": "45 IT City",
        "city": "Jaipur",
        "state": "Rajasthan",
        "status": "Active"
    },
    {
        "id": "emp-3",
        "employeeId": "EMP-1026",
        "firstName": "Aditi",
        "lastName": "Chauhan",
        "name": "Aditi Chauhan",
        "email": "aditi.chauhan@mnc.com",
        "phone": "9876522222",
        "contactNo": "9876522222",
        "age": 34,
        "gender": "Female",
        "dateOfBirth": "1990-11-10",
        "department": "Marketing",
        "designation": "Brand Manager",
        "salary": 950000.0,
        "managerName": "CMO",
        "joiningDate": "2021-06-15",
        "employmentType": "Full-time",
        "workLocation": "Delhi Office",
        "address": "78 Market Street",
        "city": "New Delhi",
        "state": "Delhi",
        "status": "Active"
    },
    {
        "id": "emp-4",
        "employeeId": "EMP-1027",
        "firstName": "Neha",
        "lastName": "Singh",
        "name": "Neha Singh",
        "email": "neha.singh@mnc.com",
        "phone": "9876533333",
        "contactNo": "9876533333",
        "age": 33,
        "gender": "Female",
        "dateOfBirth": "1991-02-25",
        "department": "Product",
        "designation": "Product Manager",
        "salary": 1100000.0,
        "managerName": "CPO",
        "joiningDate": "2022-01-10",
        "employmentType": "Full-time",
        "workLocation": "Bengaluru HQ",
        "address": "12 Product Park",
        "city": "Bengaluru",
        "state": "Karnataka",
        "status": "Active"
    },
    {
        "id": "emp-5",
        "employeeId": "EMP-1028",
        "firstName": "Amit",
        "lastName": "Kumar",
        "name": "Amit Kumar",
        "email": "amit.kumar@mnc.com",
        "phone": "9876544444",
        "contactNo": "9876544444",
        "age": 37,
        "gender": "Male",
        "dateOfBirth": "1987-09-05",
        "department": "Human Resources",
        "designation": "HR Manager",
        "salary": 900000.0,
        "managerName": "CHRO",
        "joiningDate": "2019-11-20",
        "employmentType": "Full-time",
        "workLocation": "Noida Office",
        "address": "55 HR Avenue",
        "city": "Noida",
        "state": "UP",
        "status": "Active"
    },
    {
        "id": "emp-6",
        "employeeId": "EMP-1029",
        "firstName": "Priya",
        "lastName": "Mehta",
        "name": "Priya Mehta",
        "email": "priya.mehta@mnc.com",
        "phone": "9876555555",
        "contactNo": "9876555555",
        "age": 35,
        "gender": "Female",
        "dateOfBirth": "1989-12-12",
        "department": "Finance",
        "designation": "Finance Manager",
        "salary": 1050000.0,
        "managerName": "CFO",
        "joiningDate": "2021-04-01",
        "employmentType": "Full-time",
        "workLocation": "Mumbai Office",
        "address": "99 Finance Hub",
        "city": "Mumbai",
        "state": "Maharashtra",
        "status": "Active"
    },
    {
        "id": "emp-7",
        "employeeId": "EMP-1030",
        "firstName": "Sneha",
        "lastName": "Patel",
        "name": "Sneha Patel",
        "email": "sneha.patel@mnc.com",
        "phone": "9876566666",
        "contactNo": "9876566666",
        "age": 31,
        "gender": "Female",
        "dateOfBirth": "1993-07-22",
        "department": "Operations",
        "designation": "Operations Manager",
        "salary": 850000.0,
        "managerName": "COO",
        "joiningDate": "2023-02-15",
        "employmentType": "Full-time",
        "workLocation": "Pune Office",
        "address": "33 Ops Center",
        "city": "Pune",
        "state": "Maharashtra",
        "status": "Active"
    },
    {
        "id": "emp-8",
        "employeeId": "EMP-1031",
        "firstName": "Karthik",
        "lastName": "Nair",
        "name": "Karthik Nair",
        "email": "karthik.nair@mnc.com",
        "phone": "9876577777",
        "contactNo": "9876577777",
        "age": 38,
        "gender": "Male",
        "dateOfBirth": "1986-04-30",
        "department": "Sales",
        "designation": "Sales Manager",
        "salary": 1000000.0,
        "managerName": "CSO",
        "joiningDate": "2018-10-10",
        "employmentType": "Full-time",
        "workLocation": "Hyderabad Office",
        "address": "22 Sales Tower",
        "city": "Hyderabad",
        "state": "Telangana",
        "status": "Active"
    }
]


def atomic_write(filepath, lines):
    """
    Atomically writes content to a file via a temporary file and atomic replace.
    Ensures the target file is never partially written or corrupted.
    """
    temp_path = f"{filepath}.tmp"
    with open(temp_path, "w", encoding="utf-8") as f:
        for line in lines:
            f.write(line if line.endswith("\n") else f"{line}\n")
        f.flush()
        os.fsync(f.fileno())
    os.replace(temp_path, filepath)


def validate_input_data(payload):
    """
    Sanitize and validate input to protect file integrity:
    Rejects raw unescaped newlines and null bytes.
    """
    if not isinstance(payload, dict):
        raise ValueError("Payload must be a JSON object")

    for k, v in payload.items():
        if isinstance(v, str):
            if "\n" in v or "\r" in v:
                raise ValueError(f"Newline characters are not allowed in field '{k}'.")
            if "\0" in v:
                raise ValueError(f"Null bytes are not allowed in field '{k}'.")


def sort_records(records):
    return sorted(records, key=lambda record: (record.get("name", "").lower(), record.get("employeeId", "").lower()))


def ensure_files():
    if not os.path.exists(RECORDS_FILE) or os.path.getsize(RECORDS_FILE) == 0:
        lines = [json.dumps(r, ensure_ascii=False) for r in DEFAULT_RECORDS]
        atomic_write(RECORDS_FILE, lines)

    if not os.path.exists(ATTENDANCE_FILE):
        atomic_write(ATTENDANCE_FILE, [
            "EMP-1024|Present|2026-10-14 09:02:15",
            "EMP-1025|Present|2026-10-14 09:15:30"
        ])


def load_records():
    ensure_files()
    records = []
    with open(RECORDS_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            # 1. JSON-per-line format (preserves ALL fields)
            if line.startswith("{"):
                try:
                    rec = json.loads(line)
                    rec["id"] = rec.get("id") or rec.get("employeeId")
                    rec["employeeId"] = rec.get("employeeId") or rec.get("id")
                    name = rec.get("name") or f"{rec.get('firstName', '')} {rec.get('lastName', '')}".strip()
                    rec["name"] = name
                    rec["firstName"] = rec.get("firstName") or (name.split(" ")[0] if name else "")
                    rec["lastName"] = rec.get("lastName") or (" ".join(name.split(" ")[1:]) if len(name.split(" ")) > 1 else "")
                    rec["phone"] = rec.get("phone") or rec.get("contactNo") or ""
                    rec["contactNo"] = rec.get("contactNo") or rec.get("phone") or ""
                    rec["salary"] = float(rec.get("salary", 0))
                    rec["age"] = int(rec.get("age", 30)) if str(rec.get("age", "30")).isdigit() else 30
                    records.append(rec)
                    continue
                except Exception as err:
                    print(f"Warning: Failed to parse JSON line: {err}")

            # 2. Legacy pipe-delimited format backward compatibility
            parts = line.split("|")
            if len(parts) >= 7:
                emp_id = parts[0]
                age = int(parts[1]) if parts[1].isdigit() else 30
                name = parts[2]
                name_split = name.split(" ", 1)
                first_name = name_split[0]
                last_name = name_split[1] if len(name_split) > 1 else ""
                dept = parts[3]
                salary = float(parts[4]) if parts[4] else 0.0
                contact = parts[5]
                address = parts[6]
                records.append({
                    "id": emp_id,
                    "employeeId": emp_id,
                    "firstName": first_name,
                    "lastName": last_name,
                    "name": name,
                    "email": f"{first_name.lower()}@employeehub.in",
                    "phone": contact,
                    "contactNo": contact,
                    "age": age,
                    "gender": "Other",
                    "dateOfBirth": "",
                    "address": address,
                    "city": "",
                    "state": "",
                    "department": dept,
                    "designation": "Employee",
                    "managerName": "Management",
                    "joiningDate": "2024-01-01",
                    "employmentType": "Full-time",
                    "workLocation": "HQ",
                    "salary": salary,
                    "status": "Active",
                    "skills": [],
                    "education": ""
                })

    return sort_records(records)


def save_records(records):
    sorted_records = sort_records(records)
    lines = [json.dumps(r, ensure_ascii=False) for r in sorted_records]
    atomic_write(RECORDS_FILE, lines)


def is_protected_record(record_id, records):
    """
    Checks if an employee record is protected from deletion (demo employee Rahul Sharma or Admin).
    """
    clean_id = record_id.strip().upper()
    if clean_id in PROTECTED_IDS:
        return True

    for r in records:
        r_id = str(r.get("id", "")).strip().upper()
        r_empid = str(r.get("employeeId", "")).strip().upper()
        if clean_id in (r_id, r_empid):
            r_name = str(r.get("name", "")).strip().lower()
            r_email = str(r.get("email", "")).strip().lower()
            if r_name in PROTECTED_NAMES or r_email in PROTECTED_EMAILS:
                return True

    return False


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
    lines = []
    for employee_id, entry in attendance.items():
        status = entry.get("status", "Unknown") if isinstance(entry, dict) else entry
        timestamp = entry.get("timestamp", "") if isinstance(entry, dict) else ""
        lines.append(f"{employee_id}|{status}|{timestamp}")
    atomic_write(ATTENDANCE_FILE, lines)


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
        if self.path in ("/api/reset", "/api/records/reset"):
            save_records(DEFAULT_RECORDS)
            atomic_write(ATTENDANCE_FILE, [
                "EMP-1024|Present|2026-10-14 09:02:15",
                "EMP-1025|Present|2026-10-14 09:15:30"
            ])
            self.send_json(200, {
                "status": "ok",
                "message": "Demo data reset successfully",
                "records": DEFAULT_RECORDS
            })
            return

        if self.path == "/api/records":
            try:
                payload = self.read_json_body()
                validate_input_data(payload)
            except Exception as e:
                self.send_json(400, {"error": str(e)})
                return

            records = load_records()
            emp_id = payload.get("employeeId") or payload.get("id")
            if not emp_id:
                self.send_json(400, {"error": "employeeId is required"})
                return

            # Construct full record object preserving ALL fields
            name = payload.get("name") or f"{payload.get('firstName', '')} {payload.get('lastName', '')}".strip()
            first_name = payload.get("firstName") or (name.split(" ")[0] if name else "")
            last_name = payload.get("lastName") or (" ".join(name.split(" ")[1:]) if len(name.split(" ")) > 1 else "")

            full_record = {
                "id": payload.get("id") or emp_id,
                "employeeId": emp_id,
                "firstName": first_name,
                "lastName": last_name,
                "name": name,
                "email": payload.get("email") or f"{first_name.lower()}@employeehub.in",
                "phone": payload.get("phone") or payload.get("contactNo") or "",
                "contactNo": payload.get("contactNo") or payload.get("phone") or "",
                "age": int(payload.get("age", 30)) if str(payload.get("age", "30")).isdigit() else 30,
                "gender": payload.get("gender") or "Other",
                "dateOfBirth": payload.get("dateOfBirth") or "",
                "address": payload.get("address") or "",
                "city": payload.get("city") or "",
                "state": payload.get("state") or "",
                "department": payload.get("department") or "",
                "designation": payload.get("designation") or "Employee",
                "managerName": payload.get("managerName") or "",
                "joiningDate": payload.get("joiningDate") or datetime.now().strftime("%Y-%m-%d"),
                "employmentType": payload.get("employmentType") or "Full-time",
                "workLocation": payload.get("workLocation") or "HQ",
                "salary": float(payload.get("salary", 0.0)),
                "status": payload.get("status") or "Active",
                "skills": payload.get("skills") or [],
                "education": payload.get("education") or ""
            }

            existing_index = next((i for i, item in enumerate(records) if item["employeeId"] == emp_id or item.get("id") == emp_id), None)

            if existing_index is None:
                records.append(full_record)
            else:
                # Merge existing with new fields
                merged = {**records[existing_index], **full_record}
                records[existing_index] = merged

            records = sort_records(records)
            save_records(records)
            self.send_json(200, {"status": "ok", "record": full_record, "records": records})
            return

        if self.path == "/api/attendance":
            try:
                payload = self.read_json_body()
                validate_input_data(payload)
            except Exception as e:
                self.send_json(400, {"error": str(e)})
                return

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

            if is_protected_record(record_id, records):
                self.send_json(403, {
                    "error": "Forbidden: Demo employee (Rahul Sharma) and admin account cannot be deleted."
                })
                return

            records = [item for item in records if item["employeeId"] != record_id and item.get("id") != record_id]
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
        dist_dir = os.path.join(BASE_DIR, "employeehub", "dist")

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
        file_path = os.path.join(BASE_DIR, rel_path)
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
        content = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def read_json_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        return json.loads(body.decode("utf-8"))


if __name__ == "__main__":
    ensure_files()
    port = int(os.environ.get("PORT", 8000))
    server = ThreadingHTTPServer(("0.0.0.0", port), RequestHandler)
    print(f"Storage server running on http://localhost:{port}")
    server.serve_forever()
