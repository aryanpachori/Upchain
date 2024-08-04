import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ResponseCardProps {
  name: string;
  date: string;
  coverletter: string;
  skills: string[];
  contact: number | string;
}

export default function ResponseCard({ name, date, coverletter, skills, contact }: ResponseCardProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto mb-5 ">
      <CardHeader>
        
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="border rounded-lg overflow-hidde">
          <div className="flex items-center justify-between bg-muted px-4 py-3 bg-gray-900">
            <div className="font-medium ">{name}</div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-md border border-neutral-300 font-semibold bg-green-400 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
                Approve
              </button>
              <button className="px-4 py-2 rounded-md border border-neutral-300 font-semibold bg-red-400 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
                Reject
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 pr-7">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground font-bold">Date Applied</div>
              <div>{date}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground font-bold">Skills</div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <div className="text-sm text-muted-foreground font-bold">Cover Letter</div>
              <div className="prose text-muted-foreground max-w-none">
                <p>{coverletter}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground font-bold">Contact</div>
              <div>{contact}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

