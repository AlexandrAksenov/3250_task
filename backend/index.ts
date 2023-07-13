import express, { Request, Response } from 'express';

interface UserData {
  email: string;
  number: string;
}

const app = express();

app.use(express.json());

let processingTimeout: NodeJS.Timeout | null = null;

app.post('/search', (req: Request, res: Response) => {
  if (processingTimeout) {
    clearTimeout(processingTimeout);
  }

  processingTimeout = setTimeout(() => {
    const { email, number } = req.body;

    const users: UserData[] = [
      { email: 'jim@gmail.com', number: '221122' },
      { email: 'jam@gmail.com', number: '830347' },
      { email: 'john@gmail.com', number: '221122' },
      { email: 'jams@gmail.com', number: '349425' },
      { email: 'jams@gmail.com', number: '141424' },
      { email: 'jill@gmail.com', number: '822287' },
      { email: 'jill@gmail.com', number: '822286' },
    ];

    const results = users.filter((user) => {
      if (email && !user.email.includes(email)) {
        return false;
      }

      if (number && !user.number.includes(number.replace(/-/g, ''))) {
        return false;
      }

      return true;
    });

    res.json(results);
  }, 5000);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
