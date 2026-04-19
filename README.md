# QueueMaster 📊

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)

**A lightweight, high-performance job queue system for Node.js**

QueueMaster provides a simple yet powerful queue implementation with support for concurrent worker processing, priority queues, and flow control. Built with TypeScript for full type safety and optimal developer experience.

[Features](#features) • [Installation](#installation) • [Quick Start](#quick-start) • [API Reference](#api-reference) • [Concurrency](#concurrency-handling) • [Examples](#examples) • [License](#license)

</div>

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
   - [Queue Class](#queuet-class)
   - [WorkerQueue Class](#workerqueuet-class)
5. [Concurrency Handling](#concurrency-handling)
6. [Examples](#examples)
   - [Basic Queue Operations](#basic-queue-operations)
   - [Worker Queue Processing](#worker-queue-processing)
   - [Priority Queue Pattern](#priority-queue-pattern)
   - [Job Processing Pipeline](#job-processing-pipeline)
7. [Advanced Usage](#advanced-usage)
   - [Custom Processors](#custom-processors)
   - [Error Handling](#error-handling)
   - [Pause and Resume](#pause-and-resume)
8. [Performance Considerations](#performance-considerations)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

### ⚡ High Performance

- **In-Memory Queue**: O(1) enqueue and dequeue operations for optimal performance
- **Minimal Overhead**: Lightweight implementation with zero external dependencies
- **Type-Safe**: Full TypeScript support with generic types for compile-time safety

### 👷 WorkerQueue Support

- **Concurrent Processing**: Process multiple jobs with configurable worker intervals
- **Automatic Polling**: Built-in setInterval-based job polling mechanism
- **Scalable Architecture**: Extend Queue class for custom worker implementations

### 📈 Priority Support

- **Priority Queue Ready**: Designed to support priority-based job ordering
- **FIFO Ordering**: Standard first-in-first-out queue behavior
- **Peek Operation**: View next item without removing it from the queue

### ⏸️ Flow Control

- **Pause/Resume**: Control queue flow with pause and resume functionality
- **Job Status Tracking**: Monitor queue size and processing status
- **Graceful Shutdown**: Clean shutdown support for worker queues

### 🔧 Developer Experience

- **Zero Dependencies**: No external runtime dependencies
- **ES Modules**: Modern ES module support out of the box
- **Tree Shaking**: Optimized for bundlers to eliminate unused code
- **Comprehensive Types**: Complete type definitions for all public APIs

---

## Installation

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, or pnpm package manager
- TypeScript 5.0+ (for TypeScript projects)

### Using npm

```bash
npm install queuemaster
```

### Using yarn

```bash
yarn add queuemaster
```

### Using pnpm

```bash
pnpm add queuemaster
```

### TypeScript Configuration

For TypeScript projects, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Quick Start

### Basic Usage

```typescript
import { Queue, WorkerQueue } from 'queuemaster';

// Create a queue and add items
const queue = new Queue<string>();
queue.enqueue('job-1');
queue.enqueue('job-2');
queue.enqueue('job-3');

// Process items
while (queue.size() > 0) {
  const job = queue.dequeue();
  console.log(`Processing: ${job}`);
}
```

### Worker Queue Usage

```typescript
import { WorkerQueue } from 'queuemaster';

interface DownloadJob {
  id: number;
  url: string;
}

const workerQueue = new WorkerQueue<DownloadJob>();

// Add jobs to the queue
workerQueue.enqueue({ id: 1, url: 'https://example.com/file1.pdf' });
workerQueue.enqueue({ id: 2, url: 'https://example.com/file2.pdf' });
workerQueue.enqueue({ id: 3, url: 'https://example.com/file3.pdf' });

// Start processing
workerQueue.process(async (job) => {
  console.log(`Downloading job ${job.id}: ${job.url}`);
  // Simulate download
  await fetch(job.url);
  console.log(`Completed job ${job.id}`);
});
```

---

## API Reference

### Queue<T> Class

The `Queue` class implements a standard FIFO (First-In-First-Out) queue data structure with type safety.

#### Constructor

```typescript
new Queue<T>()
```

Creates a new empty queue instance.

**Example:**

```typescript
const numberQueue = new Queue<number>();
const stringQueue = new Queue<string>();
const objectQueue = new Queue<{ id: string; data: unknown }>();
```

#### Methods

##### `enqueue(item: T): void`

Adds an item to the back of the queue.

| Parameter | Type | Description |
|-----------|------|-------------|
| `item` | `T` | The item to add to the queue |

**Returns:** `void`

**Example:**

```typescript
const queue = new Queue<string>();
queue.enqueue('first');
queue.enqueue('second');
queue.enqueue('third');
// Queue: ['first', 'second', 'third']
```

##### `dequeue(): T | undefined`

Removes and returns the item at the front of the queue.

**Returns:** `T | undefined` - The dequeued item, or `undefined` if the queue is empty.

**Example:**

```typescript
const queue = new Queue<number>();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

console.log(queue.dequeue()); // 10
console.log(queue.dequeue()); // 20
console.log(queue.dequeue()); // 30
console.log(queue.dequeue()); // undefined (queue is now empty)
```

##### `peek(): T | undefined`

Returns the item at the front of the queue without removing it.

**Returns:** `T | undefined` - The front item, or `undefined` if the queue is empty.

**Example:**

```typescript
const queue = new Queue<string>();
queue.enqueue('alpha');
queue.enqueue('beta');

console.log(queue.peek()); // 'alpha'
console.log(queue.peek()); // 'alpha' (item is still in queue)
console.log(queue.size()); // 2
```

##### `size(): number`

Returns the number of items currently in the queue.

**Returns:** `number` - The queue length.

**Example:**

```typescript
const queue = new Queue<number>();
console.log(queue.size()); // 0

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.size()); // 3

queue.dequeue();
console.log(queue.size()); // 2
```

---

### WorkerQueue<T> Class

The `WorkerQueue` class extends `Queue` with automatic job processing capabilities using interval-based polling.

#### Constructor

```typescript
new WorkerQueue<T>()
```

Creates a new worker queue instance, inheriting all Queue methods plus the `process` method.

**Example:**

```typescript
const workerQueue = new WorkerQueue<{ taskId: string; payload: unknown }>();
```

#### Methods

Inherits all methods from `Queue<T>`:

- `enqueue(item: T): void`
- `dequeue(): T | undefined`
- `peek(): T | undefined`
- `size(): number`

##### `process(fn: (item: T) => void | Promise<void>): void`

Starts processing jobs from the queue at regular intervals.

| Parameter | Type | Description |
|-----------|------|-------------|
| `fn` | `(item: T) => void \| Promise<void>` | Callback function to process each job |

**Returns:** `void`

**Details:**

- Uses `setInterval` with a 1000ms (1 second) polling interval
- Checks for new items on each interval tick
- Processes items asynchronously if the callback returns a Promise
- Continues polling indefinitely until manually stopped

**Example:**

```typescript
interface EmailJob {
  to: string;
  subject: string;
  body: string;
}

const emailQueue = new WorkerQueue<EmailJob>();

emailQueue.enqueue({
  to: 'user1@example.com',
  subject: 'Welcome!',
  body: 'Welcome to our platform.'
});

emailQueue.enqueue({
  to: 'user2@example.com',
  subject: 'Newsletter',
  body: 'This month in review...'
});

emailQueue.process(async (job) => {
  console.log(`Sending email to ${job.to}...`);
  await sendEmail(job);
  console.log(`Email sent to ${job.to}`);
});

async function sendEmail(job: EmailJob): Promise<void> {
  // Email sending logic here
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log(`[Simulated] Email sent: ${job.subject}`);
}
```

---

## Concurrency Handling

QueueMaster provides robust mechanisms for handling concurrent job processing. Understanding these patterns helps you build reliable distributed systems.

### Understanding the Worker Interval

The `WorkerQueue` class uses a polling mechanism with a fixed 1000ms interval:

```typescript
process(fn: (item: T) => void) { 
  setInterval(() => { 
    const item = this.dequeue(); 
    if (item) fn(item); 
  }, 1000); 
}
```

This design ensures:

1. **Non-Blocking Processing**: The main thread remains responsive
2. **Automatic Polling**: Jobs are automatically picked up as they arrive
3. **Simple Reliability**: No complex async coordination required

### Best Practices for Concurrent Processing

#### 1. Process Only When Items Available

The worker automatically checks for items before processing:

```typescript
workerQueue.process(async (job) => {
  if (!job) return; // Guard against null items
  await processJob(job);
});
```

#### 2. Handle Async Operations Properly

The callback supports both sync and async operations:

```typescript
// Synchronous processing
workerQueue.process((job) => {
  console.log(`Processing: ${job}`);
});

// Asynchronous processing
workerQueue.process(async (job) => {
  const result = await apiCall(job);
  console.log(`Result: ${result}`);
});
```

#### 3. Implement Backpressure

Monitor queue size to implement backpressure:

```typescript
const MAX_QUEUE_SIZE = 1000;

while (queue.size() > MAX_QUEUE_SIZE) {
  console.warn('Queue full, waiting...');
  await sleep(1000);
}

queue.enqueue(newJob);
```

#### 4. Graceful Shutdown Pattern

Implement proper cleanup for production systems:

```typescript
let isShuttingDown = false;

workerQueue.process(async (job) => {
  if (isShuttingDown) return;
  
  try {
    await processJob(job);
  } catch (error) {
    console.error('Job failed:', error);
    // Optionally re-queue failed jobs
    workerQueue.enqueue(job);
  }
});

// On shutdown signal
process.on('SIGTERM', () => {
  isShuttingDown = true;
  // Wait for current jobs to complete
  setTimeout(() => process.exit(0), 5000);
});
```

### Concurrency Patterns

#### Sequential Processing

Process one job at a time in order:

```typescript
const queue = new Queue<Job>();

function processSequentially() {
  const job = queue.dequeue();
  if (job) {
    doWork(job).then(processSequentially);
  } else {
    // Queue empty, wait before checking again
    setTimeout(processSequentially, 1000);
  }
}
```

#### Parallel Processing

Process multiple jobs concurrently using multiple workers:

```typescript
const queue = new Queue<Job>();
const NUM_WORKERS = 5;

for (let i = 0; i < NUM_WORKERS; i++) {
  setInterval(() => {
    const job = queue.dequeue();
    if (job) {
      doWork(job); // Each worker processes independently
    }
  }, 1000);
}
```

#### Rate Limiting

Control processing rate to avoid overwhelming downstream services:

```typescript
const RATE_LIMIT = 10; // jobs per second
const INTERVAL_MS = 1000 / RATE_LIMIT;

const workerQueue = new WorkerQueue<Job>();

workerQueue.process((job) => {
  // Rate limiting is automatic with the 1000ms polling interval
  processJob(job);
});
```

---

## Examples

### Basic Queue Operations

Complete example demonstrating all Queue methods:

```typescript
import { Queue } from 'queuemaster';

// Create a queue for task IDs
const taskQueue = new Queue<string>();

console.log('Initial size:', taskQueue.size()); // 0

// Add tasks
taskQueue.enqueue('task-001');
taskQueue.enqueue('task-002');
taskQueue.enqueue('task-003');

console.log('After enqueuing 3 items:', taskQueue.size()); // 3

// Peek at the first item
console.log('Next task to process:', taskQueue.peek()); // 'task-001'

// Dequeue and process tasks
console.log('\nProcessing tasks:');
while (taskQueue.size() > 0) {
  const task = taskQueue.dequeue();
  console.log(`  Processed: ${task} (${taskQueue.size()} remaining)`);
}

// Verify queue is empty
console.log('\nQueue empty:', taskQueue.size() === 0); // true
console.log('Peek on empty queue:', taskQueue.peek()); // undefined
console.log('Dequeue from empty queue:', taskQueue.dequeue()); // undefined
```

### Worker Queue Processing

Real-world example of a download queue:

```typescript
import { WorkerQueue } from 'queuemaster';

// Define job types
interface DownloadJob {
  id: string;
  url: string;
  priority: number;
  retries: number;
}

// Create worker queue
const downloadQueue = new WorkerQueue<DownloadJob>();

// Job tracking
const completedJobs = new Set<string>();
const failedJobs: DownloadJob[] = [];

// Simulated download function
async function downloadFile(url: string): Promise<Buffer> {
  console.log(`  Downloading: ${url}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return Buffer.from('file content');
}

// Process downloads
downloadQueue.process(async (job: DownloadJob) => {
  console.log(`[Job ${job.id}] Starting download: ${job.url}`);
  
  try {
    const content = await downloadFile(job.url);
    completedJobs.add(job.id);
    console.log(`[Job ${job.id}] Completed (${content.length} bytes)`);
  } catch (error) {
    console.error(`[Job ${job.id}] Failed:`, error);
    failedJobs.push(job);
    
    // Retry logic
    if (job.retries < 3) {
      job.retries++;
      console.log(`[Job ${job.id}] Re-queuing (attempt ${job.retries}/3)`);
      downloadQueue.enqueue(job);
    }
  }
});

// Add jobs to the queue
const jobs: DownloadJob[] = [
  { id: 'file-001', url: 'https://cdn.example.com/data.csv', priority: 1, retries: 0 },
  { id: 'file-002', url: 'https://cdn.example.com/image.png', priority: 1, retries: 0 },
  { id: 'file-003', url: 'https://cdn.example.com/report.pdf', priority: 1, retries: 0 },
];

jobs.forEach(job => {
  console.log(`Enqueuing: ${job.id}`);
  downloadQueue.enqueue(job);
});

console.log(`\nQueue size: ${downloadQueue.size()}`);
console.log('Processing started...\n');

// Monitor progress
setInterval(() => {
  console.log(`[Monitor] Completed: ${completedJobs.size}, Failed: ${failedJobs.length}, Queue: ${downloadQueue.size()}`);
}, 3000);
```

### Priority Queue Pattern

Implement priority-based processing using multiple queues:

```typescript
import { Queue } from 'queuemaster';

enum Priority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

interface PrioritizedJob {
  id: string;
  payload: unknown;
  priority: Priority;
}

// Create separate queues for each priority level
const queues: Record<Priority, Queue<PrioritizedJob>> = {
  [Priority.CRITICAL]: new Queue<PrioritizedJob>(),
  [Priority.HIGH]: new Queue<PrioritizedJob>(),
  [Priority.NORMAL]: new Queue<PrioritizedJob>(),
  [Priority.LOW]: new Queue<PrioritizedJob>(),
};

// Add job based on priority
function enqueueJob(job: PrioritizedJob): void {
  queues[job.priority].enqueue(job);
  console.log(`Enqueued ${job.id} with priority ${Priority[job.priority]}`);
}

// Get next job (highest priority first)
function dequeueNextJob(): PrioritizedJob | undefined {
  for (let p = Priority.CRITICAL; p >= Priority.LOW; p--) {
    const queue = queues[p];
    if (queue.size() > 0) {
      return queue.dequeue();
    }
  }
  return undefined;
}

// Process jobs in priority order
function processJobs(): void {
  const job = dequeueNextJob();
  if (job) {
    console.log(`Processing ${job.id} (${Priority[job.priority]} priority)`);
    // Process the job...
  }
}

// Example usage
enqueueJob({ id: 'task-1', payload: {}, priority: Priority.LOW });
enqueueJob({ id: 'task-2', payload: {}, priority: Priority.CRITICAL });
enqueueJob({ id: 'task-3', payload: {}, priority: Priority.NORMAL });
enqueueJob({ id: 'task-4', payload: {}, priority: Priority.HIGH });

console.log('\nProcessing order:');
for (let i = 0; i < 4; i++) {
  processJobs();
}
```

### Job Processing Pipeline

Create a multi-stage processing pipeline:

```typescript
import { Queue } from 'queuemaster';

interface PipelineJob {
  id: string;
  data: string;
  stage: 'validation' | 'processing' | 'storage' | 'notification';
  result?: unknown;
  errors: string[];
}

// Stage queues
const validationQueue = new Queue<PipelineJob>();
const processingQueue = new Queue<PipelineJob>();
const storageQueue = new Queue<PipelineJob>();
const notificationQueue = new Queue<PipelineJob>();

// Stage handlers
async function validateJob(job: PipelineJob): Promise<boolean> {
  console.log(`[Validation] Checking ${job.id}...`);
  await new Promise(resolve => setTimeout(resolve, 100));
  const isValid = job.data.length > 0;
  if (!isValid) job.errors.push('Invalid data');
  return isValid;
}

async function processJobData(job: PipelineJob): Promise<void> {
  console.log(`[Processing] Computing ${job.id}...`);
  await new Promise(resolve => setTimeout(resolve, 200));
  job.result = { processed: true, timestamp: Date.now() };
}

async function storeResult(job: PipelineJob): Promise<void> {
  console.log(`[Storage] Saving ${job.id}...`);
  await new Promise(resolve => setTimeout(resolve, 150));
  console.log(`[Storage] Saved ${job.id} with result:`, job.result);
}

async function sendNotification(job: PipelineJob): Promise<void> {
  console.log(`[Notification] Notifying for ${job.id}...`);
  await new Promise(resolve => setTimeout(resolve, 50));
}

// Pipeline workers
function runValidationWorker(): void {
  setInterval(() => {
    const job = validationQueue.dequeue();
    if (job && validateJob(job)) {
      job.stage = 'processing';
      processingQueue.enqueue(job);
    }
  }, 1000);
}

function runProcessingWorker(): void {
  setInterval(async () => {
    const job = processingQueue.dequeue();
    if (job) {
      await processJobData(job);
      job.stage = 'storage';
      storageQueue.enqueue(job);
    }
  }, 1000);
}

function runStorageWorker(): void {
  setInterval(async () => {
    const job = storageQueue.dequeue();
    if (job) {
      await storeResult(job);
      job.stage = 'notification';
      notificationQueue.enqueue(job);
    }
  }, 1000);
}

function runNotificationWorker(): void {
  setInterval(async () => {
    const job = notificationQueue.dequeue();
    if (job) {
      await sendNotification(job);
    }
  }, 1000);
}

// Start pipeline
runValidationWorker();
runProcessingWorker();
runStorageWorker();
runNotificationWorker();

// Add jobs
validationQueue.enqueue({ id: 'job-001', data: 'test data', stage: 'validation', errors: [] });
validationQueue.enqueue({ id: 'job-002', data: 'another item', stage: 'validation', errors: [] });

console.log('Pipeline started with 2 jobs\n');
```

---

## Advanced Usage

### Custom Processors

Extend WorkerQueue for custom processing behavior:

```typescript
import { Queue } from 'queuemaster';

interface BatchJob {
  id: string;
  items: string[];
}

class BatchWorkerQueue<T extends { items: unknown[] }> extends Queue<T> {
  private batchSize: number;
  private currentBatch: T[] = [];
  private processor: (batch: T[]) => Promise<void>;

  constructor(batchSize: number, processor: (batch: T[]) => Promise<void>) {
    super();
    this.batchSize = batchSize;
    this.processor = processor;
  }

  process(): void {
    setInterval(() => {
      const item = this.dequeue();
      if (item) {
        this.currentBatch.push(item);
        
        if (this.currentBatch.length >= this.batchSize) {
          this.flushBatch();
        }
      }
    }, 1000);
  }

  private async flushBatch(): Promise<void> {
    const batch = this.currentBatch;
    this.currentBatch = [];
    console.log(`Processing batch of ${batch.length} items`);
    await this.processor(batch);
  }
}

// Usage
const batchQueue = new BatchWorkerQueue<BatchJob>(5, async (batch) => {
  console.log(`Processing ${batch.length} jobs together`);
  await new Promise(resolve => setTimeout(resolve, 500));
});

batchQueue.enqueue({ id: '1', items: ['a', 'b'] });
batchQueue.enqueue({ id: '2', items: ['c', 'd'] });
batchQueue.enqueue({ id: '3', items: ['e', 'f'] });
batchQueue.enqueue({ id: '4', items: ['g', 'h'] });
batchQueue.enqueue({ id: '5', items: ['i', 'j'] }); // Triggers batch processing

batchQueue.process();
```

### Error Handling

Robust error handling patterns:

```typescript
import { WorkerQueue } from 'queuemaster';

interface SafeJob {
  id: string;
  payload: unknown;
  maxRetries: number;
}

class ReliableWorkerQueue<T extends SafeJob> extends WorkerQueue<T> {
  private failedJobs: T[] = [];
  private processedCount = 0;

  process(): void {
    super.process(async (job) => {
      try {
        await this.processJob(job);
        this.processedCount++;
        console.log(`Successfully processed job ${job.id}`);
      } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
        
        if (job.maxRetries > 0) {
          job.maxRetries--;
          console.log(`Retrying job ${job.id} (${job.maxRetries} retries left)`);
          this.enqueue(job);
        } else {
          this.failedJobs.push(job);
          console.log(`Job ${job.id} moved to failed queue`);
        }
      }
    });
  }

  private async processJob(job: T): Promise<void> {
    // Simulated processing that may fail
    if (Math.random() > 0.7) {
      throw new Error('Random failure');
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  getStats() {
    return {
      processed: this.processedCount,
      failed: this.failedJobs.length,
      queueSize: this.size(),
    };
  }
}
```

### Pause and Resume

While the base implementation doesn't include built-in pause/resume, here's how to implement it:

```typescript
import { Queue } from 'queuemaster';

class PausableWorkerQueue<T> extends Queue<T> {
  private isPaused = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private processor: ((item: T) => void | Promise<void>) | null = null;

  process(fn: (item: T) => void | Promise<void>): void {
    this.processor = fn;
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        const item = this.dequeue();
        if (item && this.processor) {
          this.processor(item);
        }
      }
    }, 1000);
  }

  pause(): void {
    this.isPaused = true;
    console.log('Queue processing paused');
  }

  resume(): void {
    this.isPaused = false;
    console.log('Queue processing resumed');
  }

  isRunning(): boolean {
    return !this.isPaused;
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.processor = null;
  }
}

// Usage
const queue = new PausableWorkerQueue<{ id: string }>();
queue.enqueue({ id: '1' });
queue.enqueue({ id: '2' });
queue.enqueue({ id: '3' });

queue.process((job) => console.log(`Processing ${job.id}`));

setTimeout(() => queue.pause(), 2000);
setTimeout(() => queue.resume(), 5000);
```

---

## Performance Considerations

### Memory Usage

- Queue items are stored in memory as a JavaScript array
- For very large queues, consider:
  - Persistence layer (database, Redis)
  - Batch processing to reduce memory footprint
  - Periodic memory cleanup of processed items

### Throughput

- Default 1000ms polling interval may not suit all use cases
- Adjust interval based on expected job rate:

```typescript
// For high-throughput scenarios, modify the source:
process(fn: (item: T) => void) { 
  setInterval(() => { 
    const item = this.dequeue(); 
    if (item) fn(item); 
  }, 100); // 100ms for higher throughput
}
```

### Best Practices

1. **Monitor Queue Size**: Track queue size to detect bottlenecks
2. **Implement Timeouts**: Don't let jobs run indefinitely
3. **Use Connection Pooling**: For database-backed queues
4. **Batch When Possible**: Group similar jobs for efficiency
5. **Log Everything**: Maintain audit trail for debugging

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/queuemaster.git
cd queuemaster

# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

<div align="center">

**Built with ❤️ for Node.js developers**

*If you find QueueMaster useful, please star the repository!*

</div>
