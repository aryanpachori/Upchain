import ContractCard from "@/components/contractsCard";

export default function Component() {
  return (
    <div className="bg-gray-900 h-screen p-10 ">
      <h1 className="text-4xl font-bold font-mono text-blue-500 p-7 text-center">
        Active Contracts
      </h1>
      <ContractCard jobID={1234} title="Website design" description="Design the website" status='Active' />
       
    </div>
  );
}
