import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-600 via-red-600 to-pink-600 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600 animate-pulse">
          404
        </h1>
        <p className="text-lg text-gray-700 mt-4">หน้าเว็บที่คุณค้นหาไม่พบ</p>
        <Link 
          href="/" 
          className="mt-6 inline-block px-6 py-2 text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-lg transition duration-300 transform hover:scale-105"
        >
          กลับสู่หน้าหลัก
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
