# Notes on solution

- updated the dependencies (except MUI) to leverage latest features
- used AI SDK for interacting with the OpenAI API
  - used the object stream functionality to stream structured data while it's being generated
- kept the Next.js Pages Router architecture, but used the App router for the chat endpoint to
  enable streaming
- used TypeScript for the frontend
