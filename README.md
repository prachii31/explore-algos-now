

# AlgoVision 🚀

AlgoVision is an interactive web application that helps users understand Data Structures and Algorithms through visual animations and step-by-step execution.

## Features

### Sorting Algorithms
- Bubble Sort
- Selection Sort
- Insertion Sort
- Quick Sort

### Searching Algorithms
- Linear Search
- Binary Search

### Data Structures
- Stack Visualization
- Queue Visualization
- Linked List Visualization
- Binary Search Tree (BST) Visualization

### Additional Features
- Custom array input
- Step-by-step algorithm execution
- Speed control for animations
- Algorithm information and complexity analysis
- Responsive UI

## Tech Stack

- React
- TypeScript
- Vite
- TanStack Router
- CSS

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal (usually `http://localhost:3000`).

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
├── routes/
│   ├── index.tsx
│   ├── sorting.tsx
│   ├── searching.tsx
│   ├── stack.tsx
│   ├── queue.tsx
│   ├── linked-list.tsx
│   └── bst.tsx
│
├── components/
│   └── AlgoInfo.tsx
│
└── utils/
    ├── algoData.ts
    └── sortAlgos.ts
```


