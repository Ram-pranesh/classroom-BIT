import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let gridfsBucket;

const initGridFS = () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("MongoDB connection not established");
  }
  gridfsBucket = new GridFSBucket(db, {
    bucketName: "uploads",
  });
  console.log("GridFS initialized");
};

const getGridFSBucket = () => {
  if (!gridfsBucket) {
    throw new Error("GridFSBucket not initialized");
  }
  return gridfsBucket;
};

export { initGridFS, getGridFSBucket };