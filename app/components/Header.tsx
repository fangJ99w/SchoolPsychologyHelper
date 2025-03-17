import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-600">校园心理助手</span>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li className="text-gray-700 hover:text-blue-600 cursor-pointer">首页</li>
            <li className="text-gray-700 hover:text-blue-600 cursor-pointer">资源</li>
            <li className="text-gray-700 hover:text-blue-600 cursor-pointer">关于我们</li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 