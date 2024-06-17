// pages/api/data.json.js

const data = {
    "testName": "Main Radiology Test",
    "date": "2024-06-16",
    "doctor": "Dr. Smith",
    "diagnosis": "Normal",
    "image": "path/to/main/image.jpg",
    "addnewreport": [
      {
        "testName": "Additional Report 1",
        "date": "2024-06-15",
        "doctor": "Dr. Johnson",
        "diagnosis": "Abnormal",
        "image": "path/to/report1/image.jpg"
      },
      {
        "testName": "Additional Report 2",
        "date": "2024-06-14",
        "doctor": "Dr. Brown",
        "diagnosis": "Normal",
        "image": "path/to/report2/image.jpg"
      }
    ]
  };
  
  export default function handler(req, res) {
    res.status(200).json(data);
  }
  