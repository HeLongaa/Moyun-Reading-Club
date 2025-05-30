"""AI助手相关API的响应处理"""
from flask import Flask, request, jsonify, make_response
from service.Network import API
from service.response._Utils import _loginCheck


def lLMResponse(app: Flask, api: API):
    """
    AI助手相关的API路由
    :param app: Flask app
    :param api: API对象，用于获取大语言模型的结果
    """

    @app.route("/api/llm/chat", methods=["POST"])
    def chat_with_llm():
        """
        与AI助手对话
        请求体格式：
        {
            "messages": [
                {"role": "user", "content": "用户消息"},
                {"role": "assistant", "content": "助手回复"},
                ...
            ],
            "prompt_type": "literary" // 可选，默认为"literary"
        }
        """
        _loginCheck()
        
        data = request.get_json()
        if not data or "messages" not in data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing messages in request body"
            }), 400)

        # 根据不同类型设置不同的提示词
        prompt_type = data.get("prompt_type", "literary")
        prompts = {
            "literary": "你是一个擅长文学创作的人。",
            "academic": "你是一个专注于学术讨论的专家。",
            "critical": "你是一个专业的书评人。",
            "casual": "你是一个友好的阅读伙伴。"
        }
        prompt = prompts.get(prompt_type, prompts["literary"])

        try:
            result = api.getLLMSuggestion_Qwen(data["messages"], prompt)
            if not result:
                return make_response(jsonify({
                    "status": "error",
                    "message": "Failed to generate response"
                }), 500)

            return jsonify({
                "status": "success",
                "data": {
                    "reply": result,
                    "prompt_type": prompt_type
                }
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"AI service error: {str(e)}"
            }), 500)
