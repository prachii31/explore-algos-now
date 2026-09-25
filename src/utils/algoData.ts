import type { AlgoInfoProps } from "@/components/AlgoInfo";

export const SORTING_INFO: Record<string, AlgoInfoProps> = {
  bubble: {
    name: "Bubble Sort",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Largest elements 'bubble' to the end on each pass.",
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    pseudocode: `for i from 0 to n-1
  for j from 0 to n-i-2
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`,
  },
  selection: {
    name: "Selection Sort",
    description: "Divides the array into a sorted and unsorted region. Repeatedly selects the minimum element from the unsorted region and moves it to the end of the sorted region.",
    time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    pseudocode: `for i from 0 to n-1
  min = i
  for j from i+1 to n-1
    if arr[j] < arr[min]
      min = j
  swap(arr[i], arr[min])`,
  },
  insertion: {
    name: "Insertion Sort",
    description: "Builds the sorted array one element at a time by inserting each element into its correct position among the previously sorted ones.",
    time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    space: "O(1)",
    pseudocode: `for i from 1 to n-1
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,
  },
  
  quick: {
    name: "Quick Sort",
    description: "Picks a 'pivot' element and partitions the array so elements smaller than the pivot are on its left and larger on the right. Recursively sorts the partitions.",
    time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    space: "O(log n)",
    pseudocode: `quickSort(arr, low, high):
  if low < high
    p = partition(arr, low, high)
    quickSort(arr, low, p-1)
    quickSort(arr, p+1, high)`,
  },
};

export const SEARCHING_INFO: Record<string, AlgoInfoProps> = {
  linear: {
    name: "Linear Search",
    description: "Sequentially checks each element of the array until the target value is found or the end of the array is reached.",
    time: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    space: "O(1)",
    pseudocode: `for i from 0 to n-1
  if arr[i] == target
    return i
return -1`,
  },
  binary: {
    name: "Binary Search",
    description: "Efficiently finds a target in a SORTED array by repeatedly dividing the search interval in half. Requires the array to be sorted first.",
    time: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    space: "O(1)",
    pseudocode: `low = 0, high = n-1
while low <= high
  mid = (low + high) / 2
  if arr[mid] == target return mid
  else if arr[mid] < target low = mid+1
  else high = mid-1
return -1`,
  },
};

export const STACK_INFO: AlgoInfoProps = {
  name: "Stack (LIFO)",
  description: "A Last-In-First-Out linear data structure. Insertions (push) and deletions (pop) happen at the same end called the 'top'.",
  space: "O(n)",
  pseudocode: `push(x): stack[++top] = x
pop():    return stack[top--]
peek():   return stack[top]`,
};

export const QUEUE_INFO: AlgoInfoProps = {
  name: "Queue (FIFO)",
  description: "A First-In-First-Out linear data structure. Elements are added at the rear and removed from the front.",
  space: "O(n)",
  pseudocode: `enqueue(x): queue[++rear] = x
dequeue():  return queue[front++]
front():    return queue[front]`,
};

export const LL_INFO: AlgoInfoProps = {
  name: "Singly Linked List",
  description: "A linear collection of nodes where each node holds data and a pointer to the next node. Allows O(1) insertion/deletion at the head.",
  space: "O(n)",
  pseudocode: `insertHead(x): node -> head; head = node
insertTail(x): traverse to last; last.next = node
delete(x):     find x, prev.next = curr.next
search(x):     traverse until node.data == x`,
};

export const BST_INFO: AlgoInfoProps = {
  name: "Binary Search Tree",
  description: "A binary tree where every left descendant is less than the node and every right descendant is greater. Enables fast lookup, insert and delete.",
  time: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
  space: "O(n)",
  pseudocode: `insert(node, x):
  if node == null: return Node(x)
  if x < node.val: node.left = insert(node.left, x)
  else if x > node.val: node.right = insert(node.right, x)
  return node`,
};
