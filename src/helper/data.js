export function formatDate(date){
    return new Date(date).toLocaleString();
}

export function bigIntToString(value){
    if (typeof value == "bigint"){
        return value.toString();
    }else {
        throw new Error("value ini bukan bigInteger");
    }
}