
# Elysia
A powerful human co-pilot, inspired by Iron Man's Jarvis.

This is meant to be more than just a personal voice assistant, but a mind reader.
It's designed to bridge the gap between needing to type out your prompts between chatgpt and your vscode editor.

An intelligent machine, designed to always be listening & watching everywhere... That can connect to anything.
It will automatically remind you, automatically create todos & followups, and automatically do what you need.
The end goal, is to be the perfect thought reader.  GH

### Monitoring
Intended to be always listening to your voice, ephermally.
It'll be your assistant taking notes at meetings.
It can listen to other's conversations.
It will always be watching in your interest.

### A thought reader
"I wrote this down for you."
"I created put that down on a TODO checklist for you."
"I opened the garage door for you"

### Can handle things for you
Email management
Text management

### Spellcasting
"Elysia, ask my friends if they'd be interested in attending a board game event at my house tomorrow night"

### Available everywhere
Laptops, Chrome, VSCode, ready to go.

# Architecture
This was written and developed in a Windows 11 environment with an AMD CPU and AMD GPU.
However, it was designed to be flexible enough to run on any platform, including Linux and MacOS.
It uses Docker to containerize the application, making it easy to deploy and run on any system that supports Docker.

# Requirements
You will need to have the following installed:
- Docker
- Docker Compose
- Node.js (optional, it's useful for your IDE)
  - We use yarn as the package manager, not npm or pnpm
- Conda or Miniconda (optional, it's useful for your IDE)
  - Python 3.12+ (optional, it's useful for your IDE)

# Installation & running
Clone the project and simply use docker compose:
```
docker compose up
```

# Development

Setup a conda environment with Python 3.12+:
```bash
conda env create -f environment.yml
conda activate elysia
```
And ensure you have the latest pip & poetry installed:
```bash
python -m pip install --upgrade pip poetry
```

Installing Node.js dependencies:
```bash
yarn install
```
This will install all necessary dependencies for the common folder, and other subfolders using workspaces.

Installing Python dependencies (in your Conda environment running Python 3.12+):
```bash
cd langgraph
conda activate elysia
poetry install --no-root
```
