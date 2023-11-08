# Project and Course Description

## Table of Contents

1. [Introduction](#introduction)
1. [Course Content](#course-content)
1. [Project Details](#project-details)
1. [Development Setup](#development-setup)
1. [Running the Application](#running-the-application)
1. [Architecture](#architecture)

## Introduction

This repository contains the backend implementation of a proof of concept application which was developed by Luka Tarman during an intensive full stack web developer course. The purpose of this repository is to demonstrate the skillset of Luka Tarman to potential employers.

A few words about the student. Luka Tarman is an adaptable and open minded Full Stack Software Developer with a preference for the backend layer. He started with software development due to his extensive experience with computers from a young age, and the fact that he finds great joy in solving technical problems. An up to date CV of Luka can be found here: [CV](https://docs.google.com/document/d/1koF3BsafLKzIdoWY6iUA0Oq-BxEqdRP4ZrKAQ16nwnA/edit?usp=sharing).

A few words about the course instructor. The instructor is [Stanislav Jakuschevskij](https://www.linkedin.com/in/stanislav-jakuschevskij/). He is a Senior Software Engineer at IBM with a specialization in Blockchain. You can find out more about him on LinkedIn. In case a potential employer for Luka would like to ask questions about the course and Lukas programming education he or she can contact Stanislav via LinkedIn.

At the time of this writing the application is in a running state and can be demonstrated. If you want to test the application read [Running the Application](#running-the-application) below. The development continues and new features are constantly introduced.

## Course Content

The course content is documented separately. Follow this [link](/docs/course.content.md) for more info.

## Project Details

The _Steam Game Stats_ application collects current and historic player numbers of all games available on the steam platform through the steam api and other online sources. The idea behind it is at some point to identify trending "niche" games which are gaining in popularity before they hit the mainstream channels. In its current iteration there is not yet a distinction between niche and mainstream games. But this feature will be added in the future.

The backend is designed to run 24/7 and collect player numbers of games every day. It provides a REST API for the frontend.

The frontend shows a list of top trending games with a search functionality for games and a detail view with all collected player numbers in a table.

## Development Setup

You need a code editor, Node.js and MongoDB installed.

- Install the current [Node.js](https://nodejs.org/en/) version.
- Install [MongoDB](https://www.mongodb.com/try/download/community) community server.
- If you use vscode add the [MongoDB extension](https://www.mongodb.com/products/vs-code) to test your queries.
- Check out the backend code from this repo and the frontend from [here](https://github.com/lukatarman/steam-game-stats-frontend).

## Running the Application

You have to start the backend and frontend explicitly. The frontend depends on the backend. It won't display any game data if there is no running backend.

The backend can run alone, it will then start collecting game data but it expects a running MongoDB instance. Depending on your operating system first start a MongoDB server instance. Then navigate into the `steam-game-stats-backend` directory and execute in the terminal:

```bash
npm start
```

To run the backend tests execute:

```bash
npm test
```

For the frontend navigate into the `steam-game-stats-frontend` directory and execute:

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080) in your browser and explore the UI.

## Architecture

The application uses a 3-tier architecture.

Container diagram pending: [#91](https://github.com/lukatarman/steam-game-stats-backend/issues/91).

Data model diagram pending: [#91](https://github.com/lukatarman/steam-game-stats-backend/issues/91).
