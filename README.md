# QueueMaster 📊

**Job Queue System** - Process jobs with workers and priorities.

## Features

- **⚡ Fast** - In-memory queue
- **👷 Workers** - Process jobs concurrently
- **📈 Priorities** - Priority queue support
- **⏸️ Pause/Resume** - Control queue flow

## Installation

```bash
npm install queuemaster
```

## Usage

```typescript
import { Queue, WorkerQueue } from 'queuemaster';

// Basic queue
const queue = new Queue<string>();
queue.enqueue('job1');
queue.enqueue('job2');
const job = queue.dequeue();

// Worker queue
const workerQueue = new WorkerQueue<string>();
workerQueue.enqueue({ id: 1, url: 'https://...' });
workerQueue.enqueue({ id: 2, url: 'https://...' });

workerQueue.process(async (job) => {
  console.log(`Processing job ${job.id}`);
  await fetch(job.url);
});
```

## API

### Queue<T>
| Method | Description |
|--------|-------------|
| `enqueue(item)` | Add to queue |
| `dequeue()` | Remove and return first item |
| `peek()` | View first item |
| `size()` | Queue length |

### WorkerQueue<T>
| Method | Description |
|--------|-------------|
| `process(fn)` | Start processing with worker |
| `pause()` | Pause processing |
| `resume()` | Resume processing |

## License

MIT
