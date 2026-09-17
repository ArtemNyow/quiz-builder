# Quiz Builder — API

Express + TypeScript + Prisma. See the [root README](../README.md) for the full setup guide.

| Method   | Route          | Purpose                            |
| -------- | -------------- | ---------------------------------- |
| `POST`   | `/quizzes`     | Create a quiz with its questions   |
| `GET`    | `/quizzes`     | List quizzes with a question count |
| `GET`    | `/quizzes/:id` | Read one quiz with all questions   |
| `DELETE` | `/quizzes/:id` | Delete a quiz (questions cascade)  |
| `GET`    | `/health`      | Liveness probe                     |
