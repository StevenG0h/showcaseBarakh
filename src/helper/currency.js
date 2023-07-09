export function formatCurrency(number){
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'IDR',
      })
}