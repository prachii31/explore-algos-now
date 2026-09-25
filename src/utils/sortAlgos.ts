// =====================================================================
// SORTING ALGORITHMS - AlgoVision
// ---------------------------------------------------------------------
// Each algorithm produces an array of "frames" (snapshots) that the
// Sorting page plays one after another to create an animation.
//
// Every frame can also carry a human-readable `message` that the UI
// shows in the "Current Step" panel so students can follow along.
// =====================================================================

// Shape of one animation frame.
export interface Frame {
  array: number[];      // current state of the array
  compare?: number[];   // indices currently being compared (yellow)
  current?: number[];   // indices currently being swapped / moved (red)
  pivot?: number;       // pivot index (used by Quick Sort)
  sorted: Set<number>;  // indices already in their final sorted position
  comparisons: number;  // total comparisons so far
  swaps: number;        // total swaps / moves so far
  message?: string;     // explanation of what is happening in this frame
}

// Save a snapshot of the array as a new frame.
function saveFrame(
  array: number[],
  sorted: Set<number>,
  comparisons: number,
  swaps: number,
  highlight: {
    compare?: number[];
    current?: number[];
    pivot?: number;
    message?: string;
  } = {}
): Frame {
  return {
    array: [...array],
    sorted: new Set(sorted),
    comparisons,
    swaps,
    ...highlight,
  };
}

// Swap two elements in the array.
function swap(array: number[], i: number, j: number): void {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}


// ---------------------------------------------------------------------
// 1) BUBBLE SORT
// ---------------------------------------------------------------------
export function bubbleSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Starting Bubble Sort" }));

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // Compare two neighbours
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [j, j + 1],
        message: `Comparing ${array[j]} and ${array[j + 1]}`,
      }));

      // Swap if they are in the wrong order
      if (array[j] > array[j + 1]) {
        const a = array[j];
        const b = array[j + 1];
        swap(array, j, j + 1);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [j, j + 1],
          message: `Swapping ${a} and ${b}`,
        }));
      }
    }

    // Largest of this pass is now in its final spot
    const finalIdx = array.length - i - 1;
    sorted.add(finalIdx);
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `${array[finalIdx]} is now in its final sorted position`,
    }));
  }

  sorted.add(0);
  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Array is fully sorted ✅" }));
  return frames;
}


// ---------------------------------------------------------------------
// 2) SELECTION SORT
// ---------------------------------------------------------------------
export function selectionSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Starting Selection Sort" }));

  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      current: [i],
      message: `Searching for the minimum element from index ${i}`,
    }));

    for (let j = i + 1; j < array.length; j++) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [minIndex, j],
        current: [i],
        message: `Comparing ${array[j]} with current minimum ${array[minIndex]}`,
      }));

      if (array[j] < array[minIndex]) {
        minIndex = j;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          compare: [minIndex],
          current: [i],
          message: `New minimum found: ${array[minIndex]}`,
        }));
      }
    }

    if (minIndex !== i) {
      const minVal = array[minIndex];
      swap(array, i, minIndex);
      swaps++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        current: [i, minIndex],
        message: `Placing ${minVal} into its final position`,
      }));
    }

    sorted.add(i);
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `${array[i]} is now in its final sorted position`,
    }));
  }

  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Array is fully sorted ✅" }));
  return frames;
}


// ---------------------------------------------------------------------
// 3) INSERTION SORT
// ---------------------------------------------------------------------
export function insertionSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>([0]);
  let comparisons = 0;
  let swaps = 0;

  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Starting Insertion Sort" }));

  for (let i = 1; i < array.length; i++) {
    const inserting = array[i];
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      current: [i],
      message: `Inserting ${inserting} into the sorted portion`,
    }));

    let j = i;
    while (j > 0) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [j - 1, j],
        message: `Comparing ${inserting} with ${array[j - 1]}`,
      }));

      if (array[j - 1] > array[j]) {
        const moved = array[j - 1];
        swap(array, j - 1, j);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [j - 1, j],
          message: `Shifting ${moved} to the right`,
        }));
        j--;
      } else {
        break;
      }
    }

    sorted.add(i);
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      message: `Inserted ${inserting} into its correct position`,
    }));
  }

  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Array is fully sorted ✅" }));
  return frames;
}




// ---------------------------------------------------------------------
// 5) QUICK SORT
// ---------------------------------------------------------------------
export function quickSort(input: number[]): Frame[] {
  const array = [...input];
  const frames: Frame[] = [];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Starting Quick Sort" }));

  function partition(low: number, high: number): number {
    const pivotValue = array[high];
    let i = low - 1;

    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      pivot: high,
      message: `Selected pivot ${pivotValue}`,
    }));

    for (let j = low; j < high; j++) {
      comparisons++;
      frames.push(saveFrame(array, sorted, comparisons, swaps, {
        compare: [j],
        pivot: high,
        message: `Comparing ${array[j]} with pivot ${pivotValue}`,
      }));

      if (array[j] < pivotValue) {
        i++;
        const moved = array[j];
        swap(array, i, j);
        swaps++;
        frames.push(saveFrame(array, sorted, comparisons, swaps, {
          current: [i, j],
          pivot: high,
          message: `Moving ${moved} to the left partition`,
        }));
      }
    }

    swap(array, i + 1, high);
    swaps++;
    frames.push(saveFrame(array, sorted, comparisons, swaps, {
      current: [i + 1],
      message: `Placing pivot ${pivotValue} into its final position`,
    }));
    return i + 1;
  }

  function quick(low: number, high: number): void {
    if (low < high) {
      const pivotIndex = partition(low, high);
      sorted.add(pivotIndex);
      quick(low, pivotIndex - 1);
      quick(pivotIndex + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }

  quick(0, array.length - 1);

  for (let k = 0; k < array.length; k++) sorted.add(k);
  frames.push(saveFrame(array, sorted, comparisons, swaps,
    { message: "Array is fully sorted ✅" }));
  return frames;
}


// Map of algorithm name -> function.
export const SORTERS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  
  quick: quickSort,
};
