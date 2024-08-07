import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface ContractCardProps{
    jobID : number,
    title : string,
    description : string
}

export default function ContractCard() {
  const getBadgeColor = (status: "Active" | "Pending" | "Completed") => {
    switch (status) {
      case "Active":
        return "bg-green-500 text-green-900";
      case "Pending":
        return "bg-yellow-500 text-yellow-900";
      case "Completed":
        return "bg-gray-500 text-gray-900";
      default:
        return "bg-gray-500 text-gray-900";
    }
  };
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 md:px-6 pt-2 ">
      <div className="flex items-center justify-between "></div>
      <div className="grid gap-4">
        <Card className="bg-gray-800 border-gray-900 ">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="font-medium text-white">Job ID: 12345</div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">
                  Job Title: Web Development
                </div>
                <div className="text-muted-foreground text-sm text-white">
                  Develop a new website for the company
                </div>
              </div>
              <Link
                href="#"
                className="text-primary hover:underline text-white"
                prefetch={false}
              >
                View Details
              </Link>
            </div>
            <Separator className="my-4 bg-gray-90" />
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter link related to this contract"
                className="flex-1"
              />
              <button className="font-medium px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-grenF-400 hover:shadow-xl transition duration-200">
                Submit
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
