import express from "express";
import { downloadAttendanceReport, getAttendance } from "../controllers/attendance.js";

const AttendanceRoutes=express.Router()

AttendanceRoutes.get('/getattendance',getAttendance)
AttendanceRoutes.get('/downloadreport',downloadAttendanceReport)

export default AttendanceRoutes