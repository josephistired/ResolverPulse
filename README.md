# ResolverPulse

ResolverPulse is a lightweight Discord bot that integrates with the NextDNS API to provide profile information, DNS analytics, and query statistics directly through Discord slash commands.

> **Notes**
> 
> ResolverPulse is currently under active development. Additional commands and features will be added over time.
> 
> Dedicated documentation is planned and will be available at **docs.josephcarmosino.com** in a future release. Until then, this README serves as the primary source of documentation for ResolverPulse.

---

## Features

- Profile Information (`/profile`)
- DNS Query Statistics (`/stats`)
- Docker Support

---

## Planned Features

- Domain Analytics
- Device Analytics
- Query Logs
- Blocking Reasons
- Allowlist Viewer
- Denylist Viewer
- Network Insights

---

## Requirements

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
4. Navigate to the **Bot** page.
5. Click **Add Bot**.

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

Administrator

Open the generated URL and invite the bot to your server.

---

## 4. Copy Your Bot Token

Under **Bot**, click **Reset Token** (or **Copy Token** if one already exists).

You'll use this value later as:

```text
DISCORD_TOKEN
```

---

# NextDNS Setup

## Getting Your API Key

1. Log into your NextDNS account.
2. Open your **Account** page.
3. Scroll to the bottom.
4. Copy your API Key.

You will use this value as:

```text
NEXTDNS_API_KEY
```

---

## Getting Your Profile ID

1. Open the NextDNS profile you want ResolverPulse to use.
2. The Profile ID is the six-character identifier displayed near the top of the page.

Example:

```text
abc1234
```

You will use this value as:

```text
NEXTDNS_PROFILE_ID
```

---

# Installation

## Docker Compose (Recommended)

Create a `.env` file.

```env
DISCORD_TOKEN=
DISCORD_ID=
NEXTDNS_API_KEY=
NEXTDNS_PROFILE_ID=
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
```

Start the bot.

```bash
npm start
```

---

# Commands

| Command | Description |
|---------|-------------|
| `/info` | Displays information about ResolverPulse. |
| `/profile` | Displays information about the configured NextDNS profile. |
| `/stats` | Displays DNS query statistics for the configured profile. |

---

# Roadmap

- [x] Docker support
- [x] Profile information
- [x] DNS query statistics
- [ ] Domain analytics
- [ ] Device analytics
- [ ] Query logs
- [ ] Blocking reasons
- [ ] Allowlist viewer
- [ ] Denylist viewer
- [ ] Network insights

---

# Contributing

Issues, feature requests, and pull requests are welcome.

---

# License

ResolverPulse is licensed under the GNU General Public License v3.0. See the `LICENSE` file for more information.
