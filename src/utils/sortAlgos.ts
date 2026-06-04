// =====================================================================
// SORTING ALGORITHMS
// ---------------------------------------------------------------------
// Each algorithm returns a list of "steps". A step is a snapshot of the
// array at one moment in time, along with information about which indices
// are being compared / swapped, how many comparisons and swaps happened
// so far, and which indices are already in their final sorted position.
//
// The Sorting page plays these steps one by one to animate the algorithm.
// We use plain functions (not generators) so the code is easy to read
// and explain in a viva.
// =====================================================================

// A single snapshot of the array during sorting.
export interface Frame {
  array: number[];           // current state of the array
  compare?: number[];        // indices being compared (yellow)
  current?: number[];        // indices being swapped / moved (red)
  pivot?: number;            // pivot index (used by quick sort)
  sorted: Set<number>;       // indices that are already in final place
  comparisons: number;       // running count of comparisons
  swaps: number;             // running count of swaps
}

// Helper to build a frame without repeating the same fields everywhere.
function makeFrame(
  array: number[],
  sorted: Set<number>,
  comparisons: number,
  swaps: number,
  extra: { compare?: number[]; current?: number[]; pivot?: number } = {}
): Frame {
  return {
    array: [...array],                  // copy so future changes don't mutate past frames
    sorted: new Set(sorted),            // copy so future changes don't mutate past frames
    comparisons,
    swaps,
    ...extra,
  };
}

// ---------------------------------------------------------------------
// 1) BUBBLE SORT
// Repeatedly compare neighbours and swap if they are in the wrong order.
// After every full pass the largest remaining element "bubbles" to the end.
// ---------------------------------------------------------------------
export function bubbleSort(input: number[]): Frame[] {
  const arr = [...input];               // work on a copy
  const steps: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Compare two adjacent elements
      comparisons++;
      steps.push(makeFrame(arr, sorted, comparisons, swaps, { compare: [j, j + 1] }));

      if (arr[j] > arr[j + 1]) {
        // Swap because they are in the wrong order
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        steps.push(makeFrame(arr, sorted, comparisons, swaps, { current: [j, j + 1] }));
      }
    }
    // The last element of this pass is now in its final position
    sorted.add(arr.length - i - 1);
  }

  // Mark the very first element too (loop above stops before reaching it)
  sorted.add(0);
  steps.push(makeFrame(arr, sorted, comparisons, swaps));
  return steps;
}

// ---------------------------------------------------------------------
// 2) SELECTION SORT
// Find the smallest element in the unsorted part and put it at the front.
// ---------------------------------------------------------------------
export function selectionSort(input: number[]): Frame[] {
  const arr = [...input];
  const steps: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;                   // assume current position holds the min

    for (let j = i + 1; j < arr.length; j++) {
      // Compare current min with the next element
      comparisons++;
      steps.push(makeFrame(arr, sorted, comparisons, swaps, { compare: [minIndex, j], current: [i] }));

      if (arr[j] < arr[minIndex]) {
        minIndex = j;                   // found a new minimum
      }
    }

    // Swap the found minimum into position i
    if (minIndex !== i) {
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
      swaps++;
    }

    // Mark element i as sorted and record a frame
    sorted.add(i);
    steps.push(makeFrame(arr, sorted, comparisons, swaps));
  }

  return steps;
}

// ---------------------------------------------------------------------
// 3) INSERTION SORT
// Take each element and shift it left until it is in the right place,
// just like sorting playing cards in your hand.
// ---------------------------------------------------------------------
export function insertionSort(input: number[]): Frame[] {
  const arr = [...input];
  const steps: Frame[] = [];
  const sorted = new Set<number>([0]); // the first element is trivially sorted
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < arr.length; i++) {
    let j = i;
    // Shift element left while it is smaller than its left neighbour
    while (j > 0) {
      comparisons++;
      steps.push(makeFrame(arr, sorted, comparisons, swaps, { compare: [j - 1, j] }));

      if (arr[j - 1] > arr[j]) {
        const temp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = temp;
        swaps++;
        j--;
      } else {
        break;                          // correct position found
      }
    }
    sorted.add(i);
  }

  // All indices are sorted at the end
  for (let k = 0; k < arr.length; k++) sorted.add(k);
  steps.push(makeFrame(arr, sorted, comparisons, swaps));
  return steps;
}

// ---------------------------------------------------------------------
// 4) MERGE SORT
// Divide the array in halves, sort each half, then merge them together.
// We use plain recursion and push frames as we go.
// ---------------------------------------------------------------------
export function mergeSort(input: number[]): Frame[] {
  const arr = [...input];
  const steps: Frame[] = [];
  const sorted = new Set<number>();
  // We track counters in a small object so the helper functions can update them
  const counters = { comparisons: 0, swaps: 0 };

  // Merge the two sorted halves arr[left..mid] and arr[mid+1..right]
  function merge(left: number, mid: number, right: number): void {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      counters.comparisons++;
      steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps,
        { compare: [left + i, mid + 1 + j] }));

      // Pick the smaller of the two front elements
      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i++;
      } else {
        arr[k] = rightPart[j];
        j++;
        counters.swaps++;               // count this as a move
      }
      k++;
      steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps,
        { current: [k - 1] }));
    }

    // Copy any leftovers from the left half
    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      i++;
      k++;
      steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps,
        { current: [k - 1] }));
    }
    // Copy any leftovers from the right half
    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      j++;
      k++;
      steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps,
        { current: [k - 1] }));
    }
  }

  // Recursive divider
  function sort(left: number, right: number): void {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      sort(left, mid);
      sort(mid + 1, right);
      merge(left, mid, right);
    }
  }

  sort(0, arr.length - 1);

  // Final frame: everything is sorted
  for (let k = 0; k < arr.length; k++) sorted.add(k);
  steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps));
  return steps;
}

// ---------------------------------------------------------------------
// 5) QUICK SORT
// Pick a pivot (last element here), move smaller items to its left and
// larger to its right, then recursively sort the two sides.
// ---------------------------------------------------------------------
export function quickSort(input: number[]): Frame[] {
  const arr = [...input];
  const steps: Frame[] = [];
  const sorted = new Set<number>();
  const counters = { comparisons: 0, swaps: 0 };

  // Place pivot in correct position and return that index
  function partition(low: number, high: number): number {
    const pivotValue = arr[high];       // choose the last element as pivot
    let i = low - 1;                    // boundary of the "smaller" region

    for (let j = low; j < high; j++) {
      counters.comparisons++;
      steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps,
        { compare: [j], pivot: high }));

      if (arr[j] < pivotValue) {
        i++;
        // Swap arr[i] and arr[j]
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        counters.swaps++;
        steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps,
          { current: [i, j], pivot: high }));
      }
    }

    // Put the pivot in its correct place
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    counters.swaps++;
    return i + 1;
  }

  function quick(low: number, high: number): void {
    if (low < high) {
      const p = partition(low, high);
      sorted.add(p);                    // pivot is now in its final place
      quick(low, p - 1);
      quick(p + 1, high);
    } else if (low === high) {
      sorted.add(low);                  // single element is sorted
    }
  }

  quick(0, arr.length - 1);

  for (let k = 0; k < arr.length; k++) sorted.add(k);
  steps.push(makeFrame(arr, sorted, counters.comparisons, counters.swaps));
  return steps;
}

// Map algorithm key -> function. Used by the Sorting page.
export const SORTERS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};
