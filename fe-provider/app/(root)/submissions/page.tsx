"use client";
import SubmissionCard from "@/components/submissionCard";
import { useEffect, useState } from "react";
import axios from "axios"
import { BACKEND_URL } from "@/utils";
interface submissionProps{
  JobId : number,
  title : string,
  submissonLink : string,
  Job :{
    id : number,
    title : string 
  }
}

export default function Component() {

  useEffect(()=>{
    fetchsubmissions()
  },[])
   
  const[submission ,setSubmission] = useState<submissionProps[]>([]);
  async function fetchsubmissions() {
    const response = await axios.get(`${BACKEND_URL}/submission`,{
      headers:{
        "Authorization" : localStorage.getItem("token")
      }
    })
    setSubmission(response.data)
  }
  return (
    <div className="bg-gray-900  h-screen pt-5 pb-5">
      <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 font-mono text-green-500">
          Review Job Submissions
        </h1>
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-900">
            <div className="px-6 py-4 bg-gray-800 flex items-center justify-between">
              <div className="font-medium text-white">Submissions</div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

               {submission.map((submission)=>(
                <SubmissionCard
                JobId={submission.Job.id}
                title={submission.Job.title}
                submissonLink={submission.submissonLink}
                />
               ))}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
