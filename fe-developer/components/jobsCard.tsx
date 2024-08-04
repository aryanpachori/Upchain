"use client";
import { useRouter } from "next/navigation";
interface jobsCardProps {
  title: string;
  description: string;
  requirements: string;
  amount: number | string;
}
export default function JobsCard({
  title,
  description,
  requirements,
  amount,
}: jobsCardProps) {
  const router = useRouter();
  return (
    <div className="mb-5">
      <div className="flex flex-col gap-8">
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
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
            <button
              onClick={() => router.push("/applicationForm")}
              type="submit"
              className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-green-600 text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] "
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
