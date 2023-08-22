import { format } from 'date-fns';

export function fDate(date){
    date = new Date(date)
    return format(date, 'dd/MM/yyyy');
}