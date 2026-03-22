import os
import json
import urllib.request
import ssl
from google import genai
from google.genai import types

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fallback_groq(text: str, system_prompt: str = "You are SynAegis, an autonomous God-Mode cloud infrastructure AI. Respond concisely and technically.") -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found")
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = json.dumps({
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ],
        "temperature": 0.3
    }).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as response:
        res = json.loads(response.read().decode())
        return res['choices'][0]['message']['content'].strip()

def fallback_openrouter(text: str, system_prompt: str = "You are SynAegis, an autonomous God-Mode cloud infrastructure AI. Respond concisely and technically.") -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY not found")
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = json.dumps({
        "model": "meta-llama/llama-3-8b-instruct:free",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ],
        "max_tokens": 1024,
        "temperature": 0.3
    }).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(req, context=ctx) as response:
        res = json.loads(response.read().decode())
        return res['choices'][0]['message']['content'].strip()

def chat_with_ai(text: str) -> str:
    """Uses Google Gemini, falls back to Groq, then OpenRouter."""
    system_instruction = "You are SynAegis, an autonomous God-Mode cloud infrastructure AI. Respond concisely and technically."
    
    # Attempt 1: Gemini
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key and api_key != "mock_key":
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=text,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.3,
                ),
            )
            return response.text
    except Exception as e:
        print(f"Gemini chat failed: {e}. Falling back to Groq...")
    
    # Attempt 2: Groq
    try:
        return fallback_groq(text, system_instruction)
    except Exception as e:
        print(f"Groq chat failed: {e}. Falling back to OpenRouter...")

    # Attempt 3: OpenRouter
    try:
        return fallback_openrouter(text, system_instruction)
    except Exception as e:
        print(f"OpenRouter chat failed: {e}.")
        
    return "Error: All AI models (Gemini, Groq, OpenRouter) failed to respond or are not configured properly."

def summarize_mr_with_ai(mr_diff_text: str) -> str:
    """Uses Google Gemini to summarize a merge request, falls back to Groq, then OpenRouter."""
    prompt = f"Summarize this GitLab merge request diff and assess its risk level:\n\n{mr_diff_text[:4000]}"
    system_instruction = "You are a senior DevOps engineer reviewing code."
    
    # Attempt 1: Gemini
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key and api_key != "mock_key":
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.3,
                ),
            )
            return response.text
    except Exception as e:
        print(f"Gemini MR summary failed: {e}. Falling back to Groq...")
    
    # Attempt 2: Groq
    try:
        return fallback_groq(prompt, system_instruction)
    except Exception as e:
        print(f"Groq MR summary failed: {e}. Falling back to OpenRouter...")

    # Attempt 3: OpenRouter
    try:
        return fallback_openrouter(prompt, system_instruction)
    except Exception as e:
        print(f"OpenRouter MR summary failed: {e}.")
        
    return "Error: All models failed to summarize MR."
