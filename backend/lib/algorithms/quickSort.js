// Quick Sort Step Generator
// Generates AlgoStep[] for visualization

function generateQuickSortSteps(arr) {
  const steps = [];
  const array = [...arr];

  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  }

  function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    steps.push({
      index: steps.length,
      type: 'partition_start',
      state: {
        array: [...array],
        low,
        high,
        pivot: high,
        i: i,
        j: low,
      },
      description: `Starting partition with pivot ${pivot} at index ${high}`,
    });

    for (let j = low; j < high; j++) {
      steps.push({
        index: steps.length,
        type: 'compare',
        state: {
          array: [...array],
          low,
          high,
          pivot: high,
          i: i,
          j: j,
          current: j,
        },
        description: `Comparing ${array[j]} with pivot ${pivot}`,
      });

      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];

        steps.push({
          index: steps.length,
          type: 'swap',
          state: {
            array: [...array],
            low,
            high,
            pivot: high,
            i: i,
            j: j,
            swapped: [i, j],
          },
          description: `Swapping ${array[i]} and ${array[j]} since ${array[j]} < ${pivot}`,
        });
      }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];

    steps.push({
      index: steps.length,
      type: 'pivot_swap',
      state: {
        array: [...array],
        low,
        high,
        pivot: i + 1,
        finalPivot: i + 1,
      },
      description: `Placing pivot ${pivot} at its correct position ${i + 1}`,
    });

    return i + 1;
  }

  quickSort(0, array.length - 1);

  steps.push({
    index: steps.length,
    type: 'complete',
    state: {
      array: [...array],
    },
    description: 'Quick sort completed',
  });

  return steps;
}

module.exports = { generateQuickSortSteps };