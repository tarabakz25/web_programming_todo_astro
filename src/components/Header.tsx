import AddTask from "@/components/AddTask";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-teal-50 py-4 fixed top-0 z-10 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">Compete Tasks</div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Add Task
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <AddTask />
            </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  )
}