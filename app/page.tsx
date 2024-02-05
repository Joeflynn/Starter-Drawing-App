import Canvas from "@/components/Canvas";
import MenuBar from "@/components/TopBar";
import { ModeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between p-0">
      <div className="flex items-center justify-center content-center w-full h-fit px-2 py-3">
        <MenuBar />
      </div>
      <div className="flex items-center justify-center content-center w-full h-full">
        <Canvas
          width={1024}
          height={768}
          brushColor={"#000000"}
          brushSize={35}
          backgroundColor={"#ffffff"}
          brushOpacity={1}
          activeTool={"brush"}
        />
      </div>
    </main>
  );
}
