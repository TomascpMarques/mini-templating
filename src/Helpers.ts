/**
 * console.log(`%c[mini-debug]%c \n----------\nState: ${id}\nValue: ${value}`, 'color: orange')
 */

const customMessage = (title: string, values: { [key: string]: any }) => {
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