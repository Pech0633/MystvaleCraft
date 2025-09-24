export default function Loader() {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[150]"> 
        <div className="relative h-24 w-24 rounded-full animate-spin bg-gradient-to-br from-rose-500 via-pink-400 to-fuchsia-300">
          <span className="absolute h-full w-full rounded-full bg-gradient-to-br from-rose-500 via-pink-400 to-fuchsia-300 blur-sm"></span>
          <span className="absolute h-full w-full rounded-full bg-gradient-to-br from-rose-500 via-pink-400 to-fuchsia-300 blur-md"></span>
          <span className="absolute h-full w-full rounded-full bg-gradient-to-br from-rose-500 via-pink-400 to-fuchsia-300 blur-xl"></span>
          <span className="absolute h-full w-full rounded-full bg-gradient-to-br from-rose-500 via-pink-400 to-fuchsia-300 blur-3xl"></span>
          <div className="absolute top-2.5 left-2.5 right-2.5 bottom-2.5 rounded-full bg-white border-[5px] border-white z-10"></div>
        </div>
      </div>
    );
  }
  