import express from "express";
import { addstudents, delteteStudents, getStudents } from "../controllers/students.js";

const StudentRoutes=express.Router()

StudentRoutes.post('/addstudents',addstudents)
StudentRoutes.get('/getstudents',getStudents)
StudentRoutes.delete('/deletestudents',delteteStudents)

export default StudentRoutes