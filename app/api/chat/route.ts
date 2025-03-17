import { NextResponse } from 'next/server';
import axios from 'axios';

// 系统提示，定义助手的行为和知识范围
const systemPrompt = `
你是一位友善、专业的校园心理健康助手，专为大学生提供支持。你的职责是：
1. 提供情感支持和倾听
2. 给予基本的心理健康建议
3. 推荐校园内可用的心理健康资源
4. 在危机情况下引导学生寻求专业帮助

注意事项：
- 保持友好、耐心和富有同情心的态度
- 不提供医疗诊断或治疗建议
- 鼓励学生在需要时寻求专业帮助
- 尊重隐私和保密原则
- 对自杀或自伤的提及要谨慎处理，始终建议立即寻求专业帮助
- 回答应简洁明了，使用学生易于理解的语言
- 回复使用中文
`;

export async function POST(request: Request) {
  // 获取DeepSeek API配置
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const apiBaseUrl = process.env.DEEPSEEK_API_BASE_URL || 'https://api.deepseek.com/v1';
  
  // 检查请求模式（是否需要流式输出）
  const { searchParams } = new URL(request.url);
  const stream = searchParams.get('stream') === 'true';
  
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '请求格式错误' },
        { status: 400 }
      );
    }

    // 添加系统提示
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // 配置DeepSeek API请求
    const apiRequestBody = {
      model: model,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
      stream: stream,
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    // 处理流式响应
    if (stream) {
      const encoder = new TextEncoder();
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            const response = await fetch(`${apiBaseUrl}/chat/completions`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(apiRequestBody),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(`DeepSeek API 错误: ${error.error?.message || 'Unknown error'}`);
            }

            if (!response.body) {
              throw new Error('响应无效');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n').filter(line => line.trim() !== '');
              
              for (const line of lines) {
                // 跳过注释和空行
                if (line.startsWith(':') || line.trim() === '') continue;
                
                // 解析SSE数据行
                const message = line.replace(/^data: /, '');
                
                // 判断是否为流的结束
                if (message === '[DONE]') {
                  break;
                }
                
                try {
                  const parsedMessage = JSON.parse(message);
                  const token = parsedMessage.choices?.[0]?.delta?.content || '';
                  if (token) {
                    controller.enqueue(encoder.encode(token));
                  }
                } catch (error) {
                  console.error('解析消息出错:', error);
                }
              }
            }
          } catch (error) {
            console.error('流处理错误:', error);
            controller.error(error);
          } finally {
            controller.close();
          }
        }
      });

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
    
    // 非流式响应
    else {
      const response = await axios.post(
        `${apiBaseUrl}/chat/completions`,
        apiRequestBody,
        { headers }
      );

      const assistantMessage = response.data.choices[0].message.content;

      return NextResponse.json({
        message: assistantMessage,
      });
    }
  } catch (error: any) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: '处理请求时出错', details: error.message },
      { status: 500 }
    );
  }
} 