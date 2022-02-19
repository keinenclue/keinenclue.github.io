/*
Tool to generate html Table from console.table compatible object
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

class Table {
  /**
   * Generate the table header
   * @param {object} table The table object
   * @param {string} title The title
   * @param {object} data The data object (compatible to console.table)
   */
  static #generateHeader(table, title, data) {
    const header = table.createTHead();
    const row = header.insertRow();

    // Get all column names from the first row
    const colums = [];
    if (data.constructor === Object) {
      colums.push(title);
    }
    colums.push(...Object.keys(Object.entries(data)[0][1]));

    colums.forEach((column) => {
      const cell = document.createElement("th");
      row.appendChild(cell);
      cell.setAttribute("scope", "col");
      cell.innerHTML = column;
    });
  }

  /**
   * Generate rows for a table
   * @param {object} table The table object
   * @param {object} data The data object (compatible to console.table)
   */
  static #generateRows(table, data) {
    const body = table.createTBody();
    Object.entries(data).forEach((rowEntry) => {
      const row = body.insertRow();

      if (data.constructor === Object) {
        // row name if it is given
        const cell = document.createElement("th");
        row.appendChild(cell);
        cell.setAttribute("scope", "row");
        cell.innerHTML = rowEntry[0];
      }

      // row content
      Object.entries(rowEntry[1]).forEach((columnEntry) => {
        const td = row.insertCell();
        td.appendChild(document.createTextNode(columnEntry[1]));
      });
    });
  }

  /**
   * Generate a table from a map of data which is compatible with console.table()
   * @param {object} data Map of format:
   *                      Option1: {row1: {column1: "cell1", column2: "cell2"}, row2: {column1: "cell3", column2: "cell4"}}
   *                      Option2: [{column1: "cell1", column2: "cell2"}, {column1: "cell3", column2: "cell4"}]
   * @param {string} title The title of the table
   * @param {string[]} classes Array of classes to add to the table
   * @returns A table object which can be added to DOM
   */
  static generate(title, data, classes) {
    const table = document.createElement("table");
    table.classList.add(...classes);

    Table.#generateHeader(table, title, data);
    Table.#generateRows(table, data);

    return table;
  }
}
