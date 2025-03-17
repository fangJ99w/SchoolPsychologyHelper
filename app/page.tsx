'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: "assistant", content: "你好，我是校园心理助手。你可以和我分享你的问题，我会尽力帮助你。" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  // 处理流式响应
  const handleStreamResponse = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: message }
    ];

    // 添加用户消息
    setMessages(newMessages);
    
    // 添加空的助手回复，等待流式填充
    setMessages([
      ...newMessages,
      { role: "assistant", content: "" }
    ]);
    
    setIsLoading(true);
    setStreamingContent('');

    try {
      // 发起流式请求
      const response = await fetch(`/api/chat?stream=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.body) {
        throw new Error('响应无效');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        
        // 更新流式内容
        setStreamingContent(accumulatedContent);
        
        // 同时更新消息数组中的最后一条消息
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          // 更新最后一条消息（助手的回复）
          if (updatedMessages.length > 0) {
            updatedMessages[updatedMessages.length - 1] = {
              role: "assistant",
              content: accumulatedContent
            };
          }
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error('流处理错误:', error);
      // 错误处理
      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1), // 移除空的助手消息
        { role: "assistant", content: "抱歉，我遇到了一些问题。请稍后再试。" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 常规非流式请求（保留以供后备使用）
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: message }
    ];

    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: newMessages
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: response.data.message }
      ]);
    } catch (error) {
      console.error('发送消息出错:', error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "抱歉，我遇到了一些问题。请稍后再试。" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 container mx-auto max-w-4xl p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 bg-blue-50">
            <h1 className="text-xl font-bold text-center text-blue-800">校园心理助手 (DeepSeek)</h1>
            <p className="text-center text-gray-600 mt-2">
              随时倾听，专业支持，保护你的心理健康
            </p>
          </div>
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleStreamResponse} 
            isLoading={isLoading} 
          />
        </div>
      </div>
      <Footer />
    </main>
  );
} 