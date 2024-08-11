"use client";

import { useRouter } from "next/navigation";

interface jobsCardProps {
  title: string;
  description: string;
  requirements: string;
  amount: number;
  jobId: number;
}
export default function JobsCard({
  title,
  description,
  requirements,
  amount,
  jobId,
}: jobsCardProps) {
  const router = useRouter();

  

  return (
    <div className="mb-5">
      <div className="flex flex-col gap-8">
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              {title}
              <br />{" "}
              <span className="font-mono  text-red-400 text-base">
                [JOB ID: {jobId}]
              </span>
            </h2>
            <p className="text-gray-400 mb-4">{description}</p>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Requirements:</h3>
              <ul className="list-disc pl-6">
                <li>{requirements}</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Salary Range:</h3>
              <p>{amount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}