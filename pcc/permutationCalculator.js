/*
Tool to calculate permutation compositions
Copyright (C) 2022  Simone Domenici
Copyright (C) 2022  Dorian Zedler

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

class PermutationCalculator {
  /**
   * Function to parse a string containing all permutations
   * @param {string} permutationsString A string containing all permutations separated by spaces, eg: "Id (1,7)(6,8) (1,7)(3,4)(6,8) (3,4)"
   * @returns An array of permutations
   */
  static #parsePermutationsString(permutationsString) {
    return permutationsString.split(" ");
  }

  /**
   * Function to parse a single permutation
   * @param {string} permutation A permutation, eg: "(1,7)(6,8)"
   * @param {int} highestNumber The highest number which should be handled
   * @returns An array wich reflects the numbers from 0 to highestNumber-1 to their mapping
   */
  static #parsePermutation(permutation, highestNumber) {
    let ret = [];
    for (let i = 0; i < highestNumber; i++) {
      ret[i] = i;
    }

    permutation.split("(").forEach((clause) => {
      if (clause.length > 3) {
        clause = clause.substring(0, clause.length - 1); // Delete last char (")")

        const clauseNumbers = clause.split(",").map((y) => parseInt(y));

        for (let i = 0; i < clauseNumbers.length; i++)
          ret[clauseNumbers[i] - 1] = clauseNumbers[(i + 1) % clauseNumbers.length] - 1;

      }
    });
    
    return ret;
  }

  /**
   * Convert a reflection of numbers to their mapping to a permutation string 
   * @param {int[]} permutation An array wich reflects all numbers to their mapping 
   * @returns A permutation string
   */
  static #toHumanVisualisation(permutation) {
    let perm = [...permutation];
    let ret = "";

    for (let i = 0; i < perm.length; i++) {
      if (perm[i] != i) {
        ret += "(" + (i + 1);
        let j = i;
        while (perm[j] != j) {
          let temp = perm[j];
          perm[j] = j;

          j = temp;
          if (perm[j] == j) break;
          ret += "," + (j + 1);
        }
        ret += ")";
      }
    }
    return ret ? ret : "Id";
  }

  /**
   * Compose a single permutation g○f
   * @param {string} g string with g, eg: (1,7)(6,8)
   * @param {string} f string with f, eg: (1,7)(6,8)
   * @param {int} highestNumber The highest number which should be handled, in the above example this could be 8
   * @returns An array wich reflects the numbers from 0 to highestNumber-1 to their mapping
   */
  static #compose(g, f, highestNumber) {
    const gh = PermutationCalculator.#parsePermutation(g, highestNumber)
    const fh = PermutationCalculator.#parsePermutation(f, highestNumber)

    const result = [];

    for (let i = 0; i < gh.length; i++) {
      result[i] = fh[gh[i]];
    }

    return result;
  }

  /**
   * Find the highest number in a string
   * @param {string} string 
   * @returns The highest number
   */
  static #findHighestNumber(string) {
    return string.match(/[0-9]+/g)
      .map(Number)
      .sort()
      .pop()
  }

  /**
   * This calculates g○f for the numbers 1 to highestNumber
   * @param {string} g A string containing all permutations of g separated by spaces, eg: "Id (1,7)(6,8) (1,7)(3,4)(6,8) (3,4)"
   * @param {string} f A string containing all permutations of f separated by spaces, eg: "Id (1,7)(6,8) (1,7)(3,4)(6,8) (3,4)"
   * @param {int} highestNumber The highest number which should be handled, in the above example this could be 8
   * @returns Array of rows with the human visualization of the resulting permutation
   */
  static composePermutation(g, f) {
    const highestNumber = PermutationCalculator.#findHighestNumber(g + f)
    console.log("Highest number: ", highestNumber)

    const gArray = PermutationCalculator.#parsePermutationsString(g);
    const fArray = PermutationCalculator.#parsePermutationsString(f);

    const result = {};

    for(const row in fArray) {
      const thisResultRow = {}

      for(const column in gArray) {
        const composed = PermutationCalculator.#compose(gArray[column], fArray[row], highestNumber)
        thisResultRow[gArray[column]] = PermutationCalculator.#toHumanVisualisation(composed)
      }
      
      result[fArray[row]] = thisResultRow
    }

    return result;
  }
}
