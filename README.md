
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

# Running requirements

You will need to have the following installed:
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

Simply clone this git project and simply use docker compose:
```
docker compose up
```

# Development

In order to develop this project, you will need to have the following installed:
- [Magefile](https://magefile.org/) 
- [Node.js](https://nodejs.org/en/download/) (v20+)
  - We use [yarn](https://yarnpkg.com/) as the package manager, not npm or pnpm
- [Conda or Miniconda](https://www.anaconda.com/docs/getting-started/miniconda/main)
  - Python 3.12+
- [Poetry](https://python-poetry.org/)

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
