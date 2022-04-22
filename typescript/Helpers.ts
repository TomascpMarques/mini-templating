/**
 * Prints messages-> values in a formatted way
 * @param {string} title The message title
 * @param {Map<string, any>} values The values to print in the message with the keys as value descriptions
 */
const miniCustomMessage = (title: string, values: { [key: string]: any }) => {
    let mssTitle = `%c[${title}]%c\n`;
    let mssTitleBorder = `${'-'.repeat(title.length)} `;
    let valuesFmt = "";

    Object.keys(values).forEach(value =>
        valuesFmt += `${value}: ${values[value]}\n`
    );

    console.log(
        mssTitle + (mssTitleBorder + '\n%c') + valuesFmt,
        'color: orange', 'color: salmon', 'color:white'
    );
};

/**
 * Given an array of values it will return the next() element in the array
 * @param values The iterators values
 * @param _indexStart the desired iterator start position defaults to 0
 * @returns An object that behaves as an iterator
 */
// const iteratorFrom = <T>(values: Array<T>, _indexStart: number = 0) => {
//     return {
//         vals: values,
//         indexer: _indexStart,
//         len: values.length,

//         next: function (): T {
//             // this.indexer++: this will increment the index after the value is used
//             // % this.vals.length: this will make the iterator start over the values
//             //                     upon a full iteration of the array
//             return this.vals[(this.indexer++ % this.vals.length)]
//         }
//     }
// };