import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">校园心理助手</h3>
            <p className="text-gray-400 text-sm mt-1">关爱心理健康，从这里开始</p>
          </div>
          
          <div className="text-center md:text-right">
            <div className="mb-2">
              <span className="text-gray-400 text-sm">紧急联系：</span>
              <span className="text-white">校园心理咨询中心 - 123-4567-8910</span>
            </div>
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} 校园心理助手. 保留所有权利.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 