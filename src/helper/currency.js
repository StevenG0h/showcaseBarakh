export function formatCurrency(number){
    return new Intl.NumberFormat().format(number)
}