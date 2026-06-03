// Each generator yields visualization frames.
export type Frame = {
  array: number[];
  compare?: number[];
  current?: number[];
  pivot?: number;
  sorted: Set<number>;
  comparisons: number;
  swaps: number;
};

type Yield = (f: Omit<Frame, "sorted"> & { sorted?: Set<number> }) => void;

export function* bubbleSort(input: number[]): Generator<Frame> {
  const a = [...input];
  const sorted = new Set<number>();
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      yield { array: [...a], compare: [j, j + 1], sorted: new Set(sorted), comparisons, swaps };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        yield { array: [...a], current: [j, j + 1], sorted: new Set(sorted), comparisons, swaps };
      }
    }
    sorted.add(a.length - i - 1);
  }
  sorted.add(0);
  yield { array: [...a], sorted: new Set(sorted), comparisons, swaps };
}

export function* selectionSort(input: number[]): Generator<Frame> {
  const a = [...input];
  const sorted = new Set<number>();
  let comparisons = 0, swaps = 0;
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      yield { array: [...a], compare: [min, j], current: [i], sorted: new Set(sorted), comparisons, swaps };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; swaps++; }
    sorted.add(i);
    yield { array: [...a], sorted: new Set(sorted), comparisons, swaps };
  }
}

export function* insertionSort(input: number[]): Generator<Frame> {
  const a = [...input];
  const sorted = new Set<number>([0]);
  let comparisons = 0, swaps = 0;
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0) {
      comparisons++;
      yield { array: [...a], compare: [j - 1, j], sorted: new Set(sorted), comparisons, swaps };
      if (a[j - 1] > a[j]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        swaps++;
        j--;
      } else break;
    }
    sorted.add(i);
  }
  for (let k = 0; k < a.length; k++) sorted.add(k);
  yield { array: [...a], sorted: new Set(sorted), comparisons, swaps };
}

export function* mergeSort(input: number[]): Generator<Frame> {
  const a = [...input];
  const sorted = new Set<number>();
  const state = { comparisons: 0, swaps: 0 };

  function* merge(l: number, m: number, r: number): Generator<Frame> {
    const left = a.slice(l, m + 1);
    const right = a.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      state.comparisons++;
      yield { array: [...a], compare: [l + i, m + 1 + j], sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps };
      if (left[i] <= right[j]) a[k++] = left[i++];
      else { a[k++] = right[j++]; state.swaps++; }
      yield { array: [...a], current: [k - 1], sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps };
    }
    while (i < left.length) { a[k++] = left[i++]; yield { array: [...a], current: [k - 1], sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps }; }
    while (j < right.length) { a[k++] = right[j++]; yield { array: [...a], current: [k - 1], sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps }; }
  }

  function* sort(l: number, r: number): Generator<Frame> {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      yield* sort(l, m);
      yield* sort(m + 1, r);
      yield* merge(l, m, r);
    }
  }

  yield* sort(0, a.length - 1);
  for (let k = 0; k < a.length; k++) sorted.add(k);
  yield { array: [...a], sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps };
}

export function* quickSort(input: number[]): Generator<Frame> {
  const a = [...input];
  const sorted = new Set<number>();
  const state = { comparisons: 0, swaps: 0 };

  function* partition(lo: number, hi: number): Generator<Frame, number> {
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      state.comparisons++;
      yield { array: [...a], compare: [j], pivot: hi, sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps };
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        state.swaps++;
        yield { array: [...a], current: [i, j], pivot: hi, sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps };
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    state.swaps++;
    return i + 1;
  }

  function* qs(lo: number, hi: number): Generator<Frame> {
    if (lo < hi) {
      const p = yield* partition(lo, hi);
      sorted.add(p);
      yield* qs(lo, p - 1);
      yield* qs(p + 1, hi);
    } else if (lo === hi) {
      sorted.add(lo);
    }
  }

  yield* qs(0, a.length - 1);
  for (let k = 0; k < a.length; k++) sorted.add(k);
  yield { array: [...a], sorted: new Set(sorted), comparisons: state.comparisons, swaps: state.swaps };
}

export const SORTERS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
};
