import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  return (
    <div className="bg-gray-900 text-white p-8 shadow-lg h-screen">
      <h2 className="text-2xl font-bold mb-6 font-mono text-blue-500">
        Application Form
      </h2>
      <form className="grid gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <Input
              id="name"
              placeholder="Enter your name"
              className="bg-gray-800 text-white w-64"
            />
          </div>
          <div>
            <label htmlFor="skills" className="block font-medium mb-1">
              Skills
            </label>
            <Textarea
              id="skills"
              rows={3}
              placeholder="Enter your skills"
              className="bg-gray-800 text-white"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="cover-letter" className="block font-medium mb-1">
              Cover Letter
            </label>
            <Textarea
              id="cover-letter"
              rows={5}
              placeholder="Enter your cover letter"
              className="bg-gray-800 text-white"
            />
          </div>
          <div>
            <label htmlFor="contact" className="block font-medium mb-1">
              Contact Information
            </label>
            <Input
              id="contact"
              placeholder="Enter your contact information"
              className="bg-gray-800 text-white w-64"
            />
          </div>
        </div>
      </form>
      <div className="mt-6 flex justify-centre">
        <button className="px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-grenF-400 hover:shadow-xl transition duration-200">
          Submit
        </button>
      </div>
    </div>
  );
}
