# ResolverPulse

ResolverPulse is an open source, self-hosted Discord bot that integrates with the NextDNS API to provide information on your profile.

> **Notes**
>
> ResolverPulse is currently under active development. Additional commands and features will be added over time.
>
> Dedicated documentation is planned and will be available at **docs.josephcarmosino.com** in a future release. Until then, this README serves as the primary source of documentation for ResolverPulse.

---

# Features

- Profile Information (`/profile`)
- DNS Query Statistics (`/stats`)
- Domain Analytics (`/domains`)
- Device Analytics (`/devices`)
- Blocking Reason Analytics (`/reasons`)
- Docker Support

---

# Planned Features

- Query Logs
- Real-Time Query Log Streaming
- Query Log Search and Filtering
- Query Log Download
- Allowlist Viewer
- Denylist Viewer
- Rewrite Viewer
- Protocol Analytics
- Query Type Analytics
- IP Version Analytics
- DNSSEC Analytics
- Encryption Analytics
- Source IP and Network Analytics
- Destination Country Analytics
- Major Provider Analytics
- Time-Series Analytics
- Date Range Filtering
- Multiple NextDNS Profile Support

---


# Requirements

- Discord Bot Application
- NextDNS Account
- NextDNS API Key
- NextDNS Profile ID
- Docker (recommended) or Node.js 22+

---

# Discord Bot Setup

## 1. Create a Discord Application

1. Visit the Discord Developer Portal.
2. Click **New Application**.
3. Give your application a name.
4. Navigate to **Bot**.
5. Click **Add Bot**.

> **Note**
>
> You may choose any application or bot name.

---

## 2. Enable Gateway Intents

Under **Bot** → **Privileged Gateway Intents**, enable:

- Presence Intent
- Server Members Intent
- Message Content Intent

---

## 3. Invite the Bot

Navigate to **OAuth2** → **URL Generator**.

Select the following scopes:

- `bot`
- `applications.commands`

Select the following permission:

- Administrator

Open the generated URL and invite the bot to your server.

> **Note**
>
> If you only intend to use ResolverPulse yourself, you can install the bot directly to your Discord apps instead of adding it to a server.

---

## 4. Copy Your Bot Token

Under **Bot**, click **Reset Token** (or **Copy Token** if one already exists).

You will use this value as:

```text
DISCORD_TOKEN
```

---

# NextDNS Setup

## Getting Your API Key

1. Sign in to your NextDNS account.
2. Open your **Account** page.
3. Scroll to the bottom.
4. Copy your API Key.

You will use this value as:

```text
NEXTDNS_API_KEY
```

> **Note**
>
> If you don't have an API key yet, click **Generate API Key**.

---

## Getting Your Profile ID

1. Open the NextDNS profile ResolverPulse should use.
2. Copy the six-character Profile ID displayed near the top of the page.

Example:

```text
abc1234
```

You will use this value as:

```text
NEXTDNS_PROFILE_ID
```

---

# Environment Variables

| Variable | Required | Description |
|----------|:--------:|-------------|
| `DISCORD_TOKEN` | ✅ | Discord bot token. |
| `DISCORD_ID` | ✅ | Discord user ID used for developer-only commands. |
| `NEXTDNS_API_KEY` | ✅ | NextDNS API key. |
| `NEXTDNS_PROFILE_ID` | ✅ | NextDNS profile ID. |
| `DISCORD_DEVICE_EMBED_LIMIT` | ❌ | Maximum number of devices displayed per page in the `/devices` command. Defaults to `10`. |

---

# Installation

## Docker Compose (Recommended)

Create a `.env` file.

```env
DISCORD_TOKEN=
DISCORD_ID=
NEXTDNS_API_KEY=
NEXTDNS_PROFILE_ID=
DISCORD_DEVICE_EMBED_LIMIT=
```

Create a `compose.yaml`.

```yaml
services:
  resolverpulse:
    image: josephistired/resolverpulse:latest
    container_name: resolverpulse
    restart: unless-stopped
    env_file:
      - .env
```

Start the bot.

```bash
docker compose up -d
```

View logs.

```bash
docker compose logs -f
```

Stop the bot.

```bash
docker compose down
```

---

## Docker

Pull the latest image.

```bash
docker pull josephistired/resolverpulse:latest
```

Create a `.env` file.

```env
DISCORD_TOKEN=
DISCORD_ID=
NEXTDNS_API_KEY=
NEXTDNS_PROFILE_ID=
DISCORD_DEVICE_EMBED_LIMIT=
```

Run the container.

```bash
docker run -d \
  --name resolverpulse \
  --restart unless-stopped \
  --env-file .env \
  josephistired/resolverpulse:latest
```

View logs.

```bash
docker logs -f resolverpulse
```

Stop the container.

```bash
docker stop resolverpulse
```

---

## Node.js

Clone the repository.

```bash
git clone https://github.com/josephistired/ResolverPulse.git
cd ResolverPulse
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
DISCORD_TOKEN=
DISCORD_ID=
NEXTDNS_API_KEY=
NEXTDNS_PROFILE_ID=
DISCORD_DEVICE_EMBED_LIMIT=10
```

Start the bot.

```bash
npm start
```

---

# Commands

| Command | Description |
|---------|-------------|
| `/info` | Display information about ResolverPulse. |
| `/profile` | Display information about the configured NextDNS profile. |
| `/stats` | Display DNS query statistics for the configured NextDNS profile. |
| `/domains` | Display domain analytics for the configured NextDNS profile. |
| `/devices` | Display device analytics for the configured NextDNS profile. |
| `/reasons` | Display blocking reason analytics for the configured NextDNS profile. |

---

# Contributing

Bug reports, feature requests, and pull requests are welcome.

If you would like to contribute, please open an issue first to discuss significant changes before submitting a pull request.

---

# License

ResolverPulse is licensed under the GNU General Public License v3.0.

See the `LICENSE` file for more information.