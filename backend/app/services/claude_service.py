from collections.abc import AsyncGenerator

from groq import AsyncGroq

from app.config import settings

client = AsyncGroq(api_key=settings.GROQ_API_KEY)


async def generate_title(user_message: str) -> str:
    response = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "Generate a concise title (5 words or less) for a conversation "
                    "based on the user's first message. "
                    "Return only the title, no quotes, no punctuation at the end."
                ),
            },
            {"role": "user", "content": user_message},
        ],
        max_tokens=20,
    )
    return response.choices[0].message.content.strip()


async def stream_response(
    messages: list[dict], system_context: str = ""
) -> AsyncGenerator[str, None]:
    final_messages = list(messages)
    if system_context:
        system_msg = {
            "role": "system",
            "content": (
                "You have access to the following uploaded documents. "
                "Use this content to answer the user's questions accurately. "
                "If the answer is not in the documents, say so.\n\n"
                f"{system_context}"
            ),
        }
        final_messages.insert(0, system_msg)

    stream = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=final_messages,
        stream=True,
    )
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content
