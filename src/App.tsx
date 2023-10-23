import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ModeToggle } from "./components/ModeToggle/"
import { buttonVariants } from "@/components/ui/button"

const App = () => {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <Button>Click here</Button>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Button asChild variant={"link"}>
              <a href="/">Home</a>
            </Button>

            <Button asChild variant={"link"}>
              <a href="/about">About</a>
            </Button>

            <Button asChild variant={"link"}>
              <a href="/docs">Documentation</a>
            </Button>
          </div>
          <ModeToggle />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
