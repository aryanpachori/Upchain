"use client"
import ResponseCard from "@/components/ResponseCard";
import { BACKEND_URL } from "@/utils";
import { useEffect, useState } from "react";
import axios from "axios";

interface Responses {
  id: number;
  name: string;
  coverLetter: string;
  Skills: string[];
  contactInforamtion: string;
  dateApplied: string;
}

export default function Component() {
  const [responses, setResponses] = useState<Responses[]>([]);

  async function responseList() {
    try {
      const list = await axios.get(`${BACKEND_URL}/application`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setResponses(list.data);
    } catch (e) {
      console.error("Error fetching responses", e);
    }
  }

  useEffect(() => {
    responseList();
  }, []);

  return (
    <div className="bg-gray-900 pb-5 min-h-screen ">
      <h1 className="text-3xl font-bold text-center pt-10 font-mono text-green-500">
        JOB RESPONSES
      </h1>

      {
        responses.map((res) => (
          <ResponseCard
            key={res.id} 
            name={res.name}
            coverletter={res.coverLetter}
            date={res.dateApplied}
            contact={res.contactInforamtion}
            skills={res.Skills}
          />
        ))
     
      }
    </div>
  );
}
