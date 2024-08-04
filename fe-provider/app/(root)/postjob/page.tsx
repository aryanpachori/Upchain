export default function Component() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Post a Job</h1>
            <p className="text-lg text-blue-400">Upchain.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Job Posting</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="job-title" className="block text-gray-400">
                  Job Title
                </label>
                <input
                  type="text"
                  id="job-title"
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="job-description"
                  className="block text-gray-400"
                >
                  Job Description
                </label>
                <textarea
                  id="job-description"
                  rows={5}
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="job-requirements"
                  className="block text-gray-400"
                >
                  Job Requirements
                </label>
                <textarea
                  id="job-requirements"
                  rows={5}
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="job-salary" className="block text-gray-400">
                  Amount
                </label>
                <input
                  type="text"
                  id="job-salary"
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-green-600 text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] "
              >
                Post Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
