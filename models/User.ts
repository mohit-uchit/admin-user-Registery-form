import mongoose from "mongoose"

export interface User {
  _id?: string
  title: string
  name: string
  fatherHusbandName: string
  mobileNo: string
  emailId: string
  dateOfBirth: string
  passoutPercentage: number
  state: string
  address: string
  courseName: string
  experience: string
  collegeName: string
  photoUrl: string
  qrCodeUrl?: string
  registrationNumber: string
  hashedPassword: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
]

const userSchema = new mongoose.Schema({
  title: { type: String, required: true },
  name: { type: String, required: true },
  fatherHusbandName: { type: String, required: true },
  mobileNo: { type: String, required: true, unique: true },
  emailId: { type: String, required: true, unique: true },
  dateOfBirth: { type: String, required: true },
  passoutPercentage: { type: Number, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  courseName: { type: String, required: true },
  experience: { type: String, required: true },
  collegeName: { type: String, required: true },
  photoUrl: { type: String, required: true },
  qrCodeUrl: { type: String, default: "" },
  registrationNumber: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
})

const UserModel = mongoose.models?.User || mongoose.model<User>("User", userSchema)

export default UserModel
