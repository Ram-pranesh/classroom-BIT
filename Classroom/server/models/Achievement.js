import mongoose from "mongoose";

// Academic Details
const academicDetailSchema = new mongoose.Schema(
  {
    institutionName: String,
    yearOfPassing: String,
    percentage: String,
    degreeOrClass: String,
  },
  { _id: false }
);

// Paper Presentations
const paperPresentationSchema = new mongoose.Schema(
  {
    title: String,
    startDate: String,
    endDate: String,
    description: String,
    collegeName: String,
    conferenceName: String,
    proof: String,
  },
  { _id: false }
);

// Placement
const placementSchema = new mongoose.Schema(
  {
    companyName: String,
    salary: String,
    proof: String,
    dateOfPlacement: String,
  },
  { _id: false }
);

// Project Details
const projectDetailSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    document: String,
    description: String,
    startDate: String,
    endDate: String,
  },
  { _id: false }
);

// Competitions
const competitionSchema = new mongoose.Schema(
  {
    title: String,
    organizer: String,
    winningDetails: String,
    startDate: String,
    endDate: String,
    upload: String,
    description: String,
  },
  { _id: false }
);

// Internship
const internshipSchema = new mongoose.Schema(
  {
    companyName: String,
    role: String,
    startDate: String,
    endDate: String,
    certificate: String,
    description: String,
  },
  { _id: false }
);

// Online Course
const onlineCourseSchema = new mongoose.Schema(
  {
    courseName: String,
    startDate: String,
    endDate: String,
    certifications: String,
    description: String,
  },
  { _id: false }
);

// Product Development
const productDevelopmentSchema = new mongoose.Schema(
  {
    productName: String,
    details: String,
    startDate: String,
    endDate: String,
    upload: String,
  },
  { _id: false }
);

// Publications
const publicationSchema = new mongoose.Schema(
  {
    title: String,
    journalName: String,
    category: String,
    startDate: String,
    endDate: String,
    proof: String,
  },
  { _id: false }
);

// Patents
const patentSchema = new mongoose.Schema(
  {
    title: String,
    startDate: String,
    endDate: String,
    proof: String,
  },
  { _id: false }
);

// Entrepreneurship
const entrepreneurshipSchema = new mongoose.Schema(
  {
    title: String,
    companyName: String,
    website: String,
    proof: String,
    product: String,
  },
  { _id: false }
);

const AchievementSchema = new mongoose.Schema(
  {
    _id: String, // userEmail
    academicDetails: [academicDetailSchema],
    paperPresentations: [paperPresentationSchema],
    placement: [placementSchema],
    projectDetails: [projectDetailSchema],
    competitions: [competitionSchema],
    internship: [internshipSchema],
    onlineCourse: [onlineCourseSchema],
    productDevelopment: [productDevelopmentSchema],
    publications: [publicationSchema],
    patents: [patentSchema],
    entrepreneurship: [entrepreneurshipSchema],
  },
  { strict: false }
);

const Achievement = mongoose.model("Achievement", AchievementSchema);

export default Achievement;