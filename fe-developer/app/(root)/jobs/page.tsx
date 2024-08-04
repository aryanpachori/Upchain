import JobsCard from "@/components/jobsCard";

export default function Component() {
  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-mono font-bold mb-8 text-blue-500">Available Positions</h1>
      <JobsCard
        title={"Software Engineer"}
        description={
          "We are looking for a talented software engineer to join our growing team. You will be responsible for developing and maintaining our web applications."
        }
        requirements={
          "3+ years of experience in software development Proficient in JavaScript, React, and Node.js Strong problem-solving and analytical skills"
        }
        amount={"100 SOL"}
      />
      <JobsCard
        title={"Software Engineer"}
        description={
          "We are looking for a talented software engineer to join our growing team. You will be responsible for developing and maintaining our web applications."
        }
        requirements={
          "3+ years of experience in software development Proficient in JavaScript, React, and Node.js Strong problem-solving and analytical skills"
        }
        amount={"100 SOL"}
      />
      
    </div>
  );
}
