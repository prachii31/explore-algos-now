// =====================================================================
// SORTING ALGORITHMS - AlgoVision
// ---------------------------------------------------------------------
// This file contains 5 classic sorting algorithms written in a simple,
// beginner-friendly style. Each algorithm produces a list of "frames".
// A frame is a snapshot of the array at one moment, plus information
// about which boxes the UI should highlight (compare / swap / pivot)
// and the running totals of comparisons and swaps.
//
// The Sorting page plays these frames one after another to create the
// animation. We use plain for-loops and recursion (no generators, no
// fancy patterns) so the code is easy to read and explain in a viva.
// =====================================================================

// Shape of one animation frame. The UI reads these fields to draw boxes.
export interface Frame {
  array: number[];      // current state of the array
  compare?: number[];   // indices currently being compared (yellow)
  current?: number[];   // indices currently being swapped / moved (red)
  pivot?: number;       // pivot index (used by Quick Sort)
  sorted: Set<number>;  // indices already in their final sorted position
  comparisons: number;  // total comparisons so far
  swaps: number;        // total swaps / moves so far
}

// Save a snapshot of the array as a new frame.
// We copy the array and the sorted-set so future changes don't alter
// frames we already pushed.
function saveFrame(
  array: number[],
  sorted: Set<number>,
  comparisons: number,
  swaps: number,
  highlight: { compare?: number[]; current?: number[]; pivot?: number } = {}
): Frame {
  return {
    array: [...array],
    sorted: new Set(sorted),
    comparisons,
    swaps,
    ...highlight,
  };
}

// Swap two elements in the array (used by most sorts).
function swap(array: number[], i: number, j: number): void {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}


// ---------------------------------------------------------------------
// 1) BUBBLE SORT
// ---------------------------------------------------------------------
// Idea: walk through the array and swap any two neighbours that are in
// the wrong order. After each full pass, the largest remaining number
// "bubbles up" to the end. Repeat until the array is sorted.
// Time:  O(n^2)   Space: O(1)
// ---------------------------------------------------------------------
export function bubbleSort(input: number[]): Frame[] {
  const array = [...input];      // copy so we don't change the caller's array
  const frames: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < array.length; i++) {
    // Inner loop: each pass pushes the largest value to position (n-i-1)
    for (let j = 0; j < array.length - i - 1; j++) {

      // Compare two neighbours
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, { compare: [j, j + 1] }));

      // If they are in the wrong order, swap them
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, { current: [j, j + 1] }));
      }
    }

    // The last element of this pass is now in its final spot
    sorted.add(array.length - i - 1);
  }

  // The first element is also sorted once everything else is in place
  sorted.add(0);
  frames.push(saveFrame(array, sorted, comparisons, swaps));
  return frames;
}


// ---------------------------------------------------------------------
// 2) SELECTION SORT
// ---------------------------------------------------------------------
// Idea: find the smallest number in the unsorted part of the array and
// put it at the front. Then look at the rest and repeat.
// Time:  O(n^2)   Space: O(1)
// ---------------------------------------------------------------------
export function selectionSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < array.length; i++) {
    // Assume the current position holds the smallest value
    let minIndex = i;

    // Look through the rest of the array for something smaller
    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps,
        { compare: [minIndex, j], current: [i] }));

      if (array[j] < array[minIndex]) {
        minIndex = j;  // found a new minimum
      }
    }

    // Put the smallest found value into position i
    if (minIndex !== i) {
      swap(array, i, minIndex);
      swaps++;
    }

    // Position i is now in its final place
    sorted.add(i);
    frames.push(saveFrame(array, sorted, comparisons, swaps));
  }

  return frames;
}


// ---------------------------------------------------------------------
// 3) INSERTION SORT
// ---------------------------------------------------------------------
// Idea: works like sorting playing cards in your hand. Take the next
// card and slide it left until it sits in the correct spot among the
// cards you have already sorted.
// Time:  O(n^2)   Space: O(1)
// ---------------------------------------------------------------------
export function insertionSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>([0]);  // a single element is already sorted
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < array.length; i++) {
    let j = i;

    // Keep shifting the element left while it is smaller than its neighbour
    while (j > 0) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, { compare: [j - 1, j] }));

      if (array[j - 1] > array[j]) {
        swap(array, j - 1, j);
        swaps++;
        j--;
      } else {
        break;  // correct position found, stop shifting
      }
    }

    sorted.add(i);
  }

  // Mark all indices as sorted for the final frame
  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(array, sorted, comparisons, swaps));
  return frames;
}


// ---------------------------------------------------------------------
// 4) MERGE SORT
// ---------------------------------------------------------------------
// Idea (divide and conquer):
//   1. Split the array in half.
//   2. Sort each half (recursion).
//   3. Merge the two sorted halves into one sorted array.
// Time:  O(n log n)   Space: O(n)
// ---------------------------------------------------------------------
export function mergeSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  // Merge two already-sorted parts: array[left..mid] and array[mid+1..right]
  function merge(left: number, mid: number, right: number): void {
    const leftPart = array.slice(left, mid + 1);
    const rightPart = array.slice(mid + 1, right + 1);

    let i = 0;      // pointer in leftPart
    let j = 0;      // pointer in rightPart
    let k = left;   // pointer in the real array where we write

    // Pick the smaller front element each time and place it back
    while (i < leftPart.length && j < rightPart.length) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps,
        { compare: [left + i, mid + 1 + j] }));

      if (leftPart[i] <= rightPart[j]) {
        array[k] = leftPart[i];
        i++;
      } else {
        array[k] = rightPart[j];
        j++;
        swaps++;   // we count a "move from the right side" as a swap
      }
      k++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, { current: [k - 1] }));
    }

    // If anything is left in the left half, copy it over
    while (i < leftPart.length) {
      array[k] = leftPart[i];
      i++;
      k++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, { current: [k - 1] }));
    }

    // If anything is left in the right half, copy it over
    while (j < rightPart.length) {
      array[k] = rightPart[j];
      j++;
      k++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, { current: [k - 1] }));
    }
  }

  // Recursive function that keeps splitting until the parts are size 1,
  // then merges them back together in sorted order.
  function sort(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      sort(left, mid);          // sort left half
      sort(mid + 1, right);     // sort right half
      merge(left, mid, right);  // combine them
    }
  }

  sort(0, array.length - 1);

  // Final frame: everything is sorted
  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(array, sorted, comparisons, swaps));
  return frames;
}


// ---------------------------------------------------------------------
// 5) QUICK SORT
// ---------------------------------------------------------------------
// Idea (divide and conquer):
//   1. Pick a "pivot" element (we use the last element).
//   2. Move all smaller numbers to the left of the pivot and all larger
//      numbers to the right. This is called "partitioning".
//   3. The pivot is now in its final position.
//   4. Recursively quick-sort the left side and the right side.
// Time:  O(n log n) average, O(n^2) worst   Space: O(log n)
// ---------------------------------------------------------------------
export function quickSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  // Rearranges array[low..high] around a pivot and returns the pivot's
  // final index. Everything left of that index is <= pivot, everything
  // right is > pivot.
  function partition(low: number, high: number): number {
    const pivotValue = array[high];  // choose the last element as pivot
    let i = low - 1;                 // boundary of the "smaller" region

    // Walk through the range and move smaller items to the left side
    for (let j = low; j < high; j++) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps,
        { compare: [j], pivot: high }));

      if (array[j] < pivotValue) {
        i++;
        swap(array, i, j);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps,
          { current: [i, j], pivot: high }));
      }
    }

    // Place the pivot just after the smaller region — its final spot
    swap(array, i + 1, high);
    swaps++;
    return i + 1;
  }

  // Recursive function: partition, then sort the two sides
  function quick(low: number, high: number): void {
    if (low < high) {
      const pivotIndex = partition(low, high);
      sorted.add(pivotIndex);     // pivot is now in its final position
      quick(low, pivotIndex - 1); // sort the left side
      quick(pivotIndex + 1, high);// sort the right side
    } else if (low === high) {
      sorted.add(low);            // a single element is already sorted
    }
  }

  quick(0, array.length - 1);

  // Final frame: mark all indices as sorted
  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(array, sorted, comparisons, swaps));
  return frames;
}


// ---------------------------------------------------------------------
// Map of algorithm name -> function. The Sorting page uses this to
// pick which algorithm to run based on the dropdown selection.
// ---------------------------------------------------------------------
export const SORTERS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};
