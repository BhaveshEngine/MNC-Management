# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/employeehub
COPY employeehub/package*.json ./
RUN npm install
COPY employeehub/ ./
RUN npm run build

# Stage 2: Serve using Python server
FROM python:3.11-slim
WORKDIR /app
COPY storage_server.py ./
COPY employee_records.txt attendance.txt ./
COPY --from=frontend-builder /app/employeehub/dist ./employeehub/dist

ENV PORT=8000
EXPOSE 8000

CMD ["python", "storage_server.py"]
