import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
// import { FilePlus2 } from 'lucide-react'; // Example Icon

// Dummy data for demonstration
const userName = "Alex"; // Replace with actual user data later
const userDocuments: any[] = []; // Replace with actual documents later. Start with empty array.

export function MainDashboard() {

  const hasDocuments = userDocuments.length > 0;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <h1 className="text-3xl font-semibold">
        Welcome back, {userName}!
      </h1>

      {/* Main Content Area */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Documents</h2>
        <Button asChild> {/* Use asChild to make the button a Link */}
          <Link to="/create-resume"> {/* Adjust link as needed */}
            {/* <FilePlus2 className="mr-2 h-4 w-4" /> */}
            Create New Resume
          </Link>
        </Button>
      </div>

      {/* Document List or Empty State */}
      {hasDocuments ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* TODO: Map over userDocuments and render DocumentCard components */}
          <p>Document list will go here...</p>
           {/* Example Card Structure:
          userDocuments.map(doc => (
            <DocumentCard key={doc.id} document={doc} />
          ))
          */}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-12 text-center">
           {/* <FilePlus2 className="mx-auto h-12 w-12 text-muted-foreground" /> */}
           <h3 className="mt-4 text-lg font-semibold">No documents yet</h3>
           <p className="mt-2 mb-4 text-sm text-muted-foreground">
             Get started by creating your first resume.
           </p>
           <Button asChild size="sm">
              <Link to="/create-resume">
                Create Resume
              </Link>
            </Button>
        </div>
      )}
    </div>
  );
} 