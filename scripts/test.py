import requests


def send_msg(message):
    # Replace with your bot's token and chat ID
    bot_token = "7094665518:AAGfNzhlI2tbCUGcY4zjcWCwgE5y643oz7s"
    chat_id = "5513567781"

    # Set up the URL with the bot token, chat ID, and message
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message
    }

    # Send the message
    response = requests.post(url, data=payload)

    # Check for successful request
    if response.status_code == 200:
        print("Message sent successfully!")
    else:
        print(f"Failed to send message. Status code: {response.status_code}")
        print("Response:", response.json())

send_msg('project building is completed successfully')