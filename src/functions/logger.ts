import chalk from "chalk";

export default async function log(message: string, error: boolean) {
    if(error === false) {
        return console.log(`${chalk.bold(chalk.cyan(`Fortress`))}${chalk.bold(chalk.blue(`MG`))} >> ${message}`)
    } else {
        return console.log(`${chalk.bold(chalk.red(`FortressMG`))} >> ${message}`)
    }
}