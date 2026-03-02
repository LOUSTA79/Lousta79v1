import os
import time
from openai import OpenAI

# 1. Initialize the Client
# The client automatically looks for the OPENAI_API_KEY environment variable.
client = OpenAI()

# 2. Create an Assistant
# This defines the "personality" and capabilities of the agent.
assistant = client.beta.assistants.create(
    name="Math Tutor",
    instructions="You are a personal math tutor. Write and run code to answer math questions.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4-turbo-preview"
)

# 3. Create a Thread
# A thread is like a conversation session. It stores the message history.
thread = client.beta.threads.create()

# 4. Add a User Message to the Thread
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
)

# 5. Run the Assistant
# This tells the assistant to process the thread and respond.
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id,
    instructions="Please address the user as Jane Doe. The user has a premium account." # Optional: override instructions for this specific run
)

print(f"Run created with ID: {run.id}")

# 6. Check the Run Status
# The assistant's response is not instant. We need to check its status.
while run.status in ["queued", "in_progress"]:
    time.sleep(1) # Wait for 1 second
    run = client.beta.threads.runs.retrieve(
        thread_id=thread.id,
        run_id=run.id
    )
    print(f"Run status: {run.status}")

# 7. Retrieve and Display the Messages
if run.status == "completed":
    messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )
    # The messages are returned in reverse chronological order.
    # The first message in the list is the assistant's latest response.
    assistant_response = messages.data[0].content[0].text.value
    print("\nAssistant's Response:")
    print(assistant_response)
else:
    print(f"Run failed with status: {run.status}")